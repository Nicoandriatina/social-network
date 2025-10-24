// app/api/donateurs/[id]/donations/route.ts (VERSION CORRIGÉE)
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { checkFriendship } from "@/lib/helpers/checkFriendship";

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
      type: string;
    };

    const { id } = await params;

    console.log('📥 Récupération donations pour donateur ID:', id);

    // Vérifier que l'utilisateur cible existe et est un donateur
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        fullName: true
      }
    });

    console.log('👤 Donateur trouvé:', targetUser);

    if (!targetUser || targetUser.type !== "DONATEUR") {
      return NextResponse.json({ 
        error: "Donateur non trouvé" 
      }, { status: 404 });
    }

    // Vérifier si les utilisateurs sont amis
    const areFriends = await checkFriendship(payload.userId, id);

    // Récupérer les donations effectuées par le donateur
    const donations = await prisma.don.findMany({
      where: {
        donateurId: id
      },
      select: {
        id: true,
        libelle: true,
        type: true,
        quantite: true,
        montant: true,
        statut: true,
        dateEnvoi: true,
        dateReception: true,
        createdAt: true,
        // ✅ Projet lié (si donation via projet)
        project: {
          select: {
            id: true,
            titre: true,
            etablissement: {
              select: {
                nom: true
              }
            }
          }
        },
        // ✅ Bénéficiaire établissement (si donation directe)
        beneficiaireEtab: {
          select: {
            id: true,
            nom: true
          }
        },
        // ✅ Bénéficiaire personnel (si donation à un enseignant)
        beneficiairePersonnel: {
          select: {
            id: true,
            fullName: true,
            etablissement: {
              select: {
                nom: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    console.log('💝 Donations trouvées:', donations.length);

    // Calculer les statistiques
    const stats = {
      totalDonations: donations.length,
      totalAmount: areFriends ? donations
        .filter(d => d.type === 'MONETAIRE' && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0) : 0,
      projectsSupported: new Set(
        donations
          .filter(d => d.project?.id)
          .map(d => d.project!.id)
      ).size,
      lastDonationDate: donations.length > 0 ? donations[0].createdAt.toISOString() : null
    };

    // Transformer les données pour le frontend
    const transformedDonations = donations.map(don => {
      // ✅ Déterminer la destination correctement
      let destinationType: 'project' | 'etablissement' | 'personnel';
      let destinationName: string;
      let etablissementName: string | undefined;

      if (don.project) {
        // Don via un projet
        destinationType = 'project';
        destinationName = don.project.titre;
        etablissementName = don.project.etablissement?.nom;
      } else if (don.beneficiaireEtab) {
        // Don direct à un établissement
        destinationType = 'etablissement';
        destinationName = don.beneficiaireEtab.nom;
      } else if (don.beneficiairePersonnel) {
        // Don direct à un enseignant
        destinationType = 'personnel';
        destinationName = don.beneficiairePersonnel.fullName;
        etablissementName = don.beneficiairePersonnel.etablissement?.nom;
      } else {
        // Cas par défaut (ne devrait pas arriver)
        destinationType = 'etablissement';
        destinationName = 'Non spécifié';
      }

      return {
        id: don.id,
        libelle: don.libelle,
        type: don.type,
        quantite: don.quantite,
        // Montant visible uniquement aux amis
        montant: areFriends ? don.montant : null,
        statut: don.statut,
        dateEnvoi: don.dateEnvoi?.toISOString(),
        dateReception: don.dateReception?.toISOString(),
        createdAt: don.createdAt.toISOString(),
        project: don.project ? {
          id: don.project.id,
          titre: don.project.titre
        } : null,
        destination: {
          type: destinationType,
          name: destinationName,
          etablissement: etablissementName
        }
      };
    });

    return NextResponse.json({ 
      donations: transformedDonations,
      stats,
      areFriends
    });

  } catch (error) {
    console.error("GET /api/donateurs/[id]/donations error:", error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}