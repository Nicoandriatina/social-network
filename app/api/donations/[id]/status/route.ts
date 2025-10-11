// app/api/donations/[id]/status/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { emitSocketNotification } from "@/lib/emit-socket-notification";

export const runtime = "nodejs";


// Schéma de validation pour changer le statut
const updateStatusSchema = z.object({
  status: z.enum(["EN_ATTENTE", "ENVOYE", "RECEPTIONNE"], {
    required_error: "Le statut est obligatoire"
  }),
});

// PATCH - Mettre à jour le statut d'un don
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    const resolvedParams = await params;
    const body = await req.json();
    
    // Validation des données
    const validation = updateStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Données invalides",
        details: validation.error.flatten()
      }, { status: 400 });
    }

    const { status } = validation.data;

    // Récupérer le don avec ses relations
    const don = await prisma.don.findUnique({
      where: { id: resolvedParams.id },
      include: {
        donateur: {
          select: { id: true, fullName: true }
        },
        project: {
          select: {
            auteurId: true,
            etablissementId: true,
            titre: true
          }
        },
        beneficiaireEtab: {
          select: { 
            admin: { select: { id: true } }
          }
        }
      }
    });

    if (!don) {
      return NextResponse.json({ error: "Don non trouvé" }, { status: 404 });
    }

    // Vérifier les permissions selon le type d'utilisateur et le statut demandé
    let hasPermission = false;

    if (status === "ENVOYE") {
      // Seul le donateur peut marquer comme "ENVOYÉ"
      hasPermission = don.donateurId === payload.userId;
    } else if (status === "RECEPTIONNE") {
      // Seul le bénéficiaire peut marquer comme "RÉCEPTIONNÉ"
      if (don.project) {
        // Don vers un projet : l'auteur du projet peut valider
        hasPermission = don.project.auteurId === payload.userId;
      } else if (don.etablissementId) {
        // Don vers un établissement : l'admin de l'établissement peut valider
        hasPermission = don.beneficiaireEtab?.admin.some(admin => admin.id === payload.userId) || false;
      } else if (don.personnelId) {
        // Don vers un personnel : le personnel peut valider
        hasPermission = don.personnelId === payload.userId;
      }
    } else if (status === "EN_ATTENTE") {
      // Retour en arrière possible par le donateur ou le bénéficiaire
      hasPermission = don.donateurId === payload.userId || 
                     don.project?.auteurId === payload.userId ||
                     don.personnelId === payload.userId;
    }

    if (!hasPermission) {
      return NextResponse.json({ 
        error: "Vous n'avez pas les permissions pour modifier ce statut" 
      }, { status: 403 });
    }

    // Vérifier la cohérence du changement de statut
    const validTransitions = {
      "EN_ATTENTE": ["ENVOYE"],
      "ENVOYE": ["RECEPTIONNE", "EN_ATTENTE"],
      "RECEPTIONNE": ["EN_ATTENTE"] // Permet de "dé-réceptionner" si erreur
    };

    if (!validTransitions[don.statut]?.includes(status)) {
      return NextResponse.json({ 
        error: `Transition de statut invalide: ${don.statut} → ${status}` 
      }, { status: 400 });
    }

    // Mettre à jour le don
    const updateData: any = { statut: status };
    
    if (status === "ENVOYE" && !don.dateEnvoi) {
      updateData.dateEnvoi = new Date();
    } else if (status === "RECEPTIONNE" && !don.dateReception) {
      updateData.dateReception = new Date();
    } else if (status === "EN_ATTENTE") {
      // Reset des dates si retour à en attente
      updateData.dateEnvoi = null;
      updateData.dateReception = null;
    }

    const updatedDon = await prisma.don.update({
      where: { id: resolvedParams.id },
      data: updateData,
      include: {
        donateur: {
          select: { id: true, fullName: true }
        },
        project: {
          select: {
            titre: true,
            auteurId: true,
            etablissement: { select: { nom: true } }
          }
        },
        beneficiaireEtab: {
          select: { 
            nom: true,
            admin: { select: { id: true } }
          }
        },
        beneficiairePersonnel: {
          select: { id: true, fullName: true }
        }
      }
    });

    // 🔔 NOTIFICATIONS SELON LE CHANGEMENT DE STATUT
    try {
      if (status === 'ENVOYE') {
        // Notifier le bénéficiaire que le don est envoyé
        let recipientId = null;
        
        if (don.project) {
          recipientId = don.project.auteurId;
        } else if (don.personnelId) {
          recipientId = don.personnelId;
        } else if (don.beneficiaireEtab) {
          recipientId = don.beneficiaireEtab.admin[0]?.id;
        }

        if (recipientId) {
          const notification = await prisma.notification.create({
            data: {
              userId: recipientId,
              type: 'DONATION_RECEIVED',
              title: 'Don en cours d\'acheminement',
              content: `Le don "${don.libelle}" a été envoyé et est en cours d'acheminement`,
              donId: don.id,
              relatedUserId: don.donateurId
            }
          });
          await emitSocketNotification(notification.id);
          console.log('✅ Notification "don envoyé" créée et émise');
        }
      } 
      else if (status === 'RECEPTIONNE') {
        // Notifier le donateur que le don est reçu
        const notification = await prisma.notification.create({
          data: {
            userId: don.donateurId,
            type: 'DONATION_RECEIVED',
            title: 'Don réceptionné',
            content: `Votre don "${don.libelle}" a été reçu avec succès. Merci pour votre générosité !`,
            donId: don.id,
            relatedUserId: payload.userId
          }
        });
        await emitSocketNotification(notification.id);
        console.log('✅ Notification "don réceptionné" créée et émise');
      }
    } catch (notifError) {
      console.error('❌ Erreur notification statut don:', notifError);
      // On continue même si la notification échoue
    }

    return NextResponse.json({ 
      message: "Statut mis à jour avec succès",
      donation: updatedDon
    });

  } catch (error) {
    console.error("PATCH /api/donations/[id]/status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET - Récupérer les dons selon le profil utilisateur
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    // Récupérer les dons selon le type d'utilisateur
    let whereCondition: any = {};

    if (payload.type === "DONATEUR") {
      whereCondition.donateurId = payload.userId;
    } else if (payload.type === "ETABLISSEMENT") {
      // Dons reçus par l'établissement ou ses projets
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { etablissement: true }
      });

      if (user?.etablissement) {
        whereCondition.OR = [
          { etablissementId: user.etablissement.id },
          { project: { etablissementId: user.etablissement.id } }
        ];
      }
    } else if (payload.type === "ENSEIGNANT") {
      whereCondition.personnelId = payload.userId;
    }

    const donations = await prisma.don.findMany({
      where: whereCondition,
      include: {
        donateur: {
          select: { fullName: true, avatar: true }
        },
        project: {
          select: {
            titre: true,
            etablissement: { select: { nom: true } }
          }
        },
        beneficiaireEtab: {
          select: { nom: true }
        },
        beneficiairePersonnel: {
          select: { fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ donations });

  } catch (error) {
    console.error("GET donations by user type error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}