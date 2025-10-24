// app/api/etablissements/[id]/donations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('📥 Récupération donations pour ID:', id);
    
    // CORRECTION: L'ID peut être soit l'ID de l'utilisateur, soit l'ID de l'établissement
    // On cherche d'abord si c'est un utilisateur
    let etablissementId = id;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: { 
        id: true,
        type: true,
        etablissementId: true 
      }
    });

    console.log('👤 Utilisateur trouvé:', user);

    // Si c'est un utilisateur de type ETABLISSEMENT, utiliser son etablissementId
    if (user && user.type === "ETABLISSEMENT" && user.etablissementId) {
      etablissementId = user.etablissementId;
      console.log('🏫 ID établissement extrait:', etablissementId);
    }

    // Vérifier que l'établissement existe
    const etablissement = await prisma.etablissement.findUnique({
      where: { id: etablissementId },
      select: { id: true, nom: true }
    });

    console.log('🏢 Établissement trouvé:', etablissement);

    if (!etablissement) {
      console.error('❌ Établissement non trouvé');
      return NextResponse.json({ 
        error: "Établissement non trouvé",
        debug: {
          userId: id,
          etablissementId,
          userFound: !!user,
          userType: user?.type,
          userEtablissementId: user?.etablissementId
        }
      }, { status: 404 });
    }

    // Récupérer les donations reçues par l'établissement
    // Soit directement, soit via ses projets
    const donations = await prisma.don.findMany({
      where: {
        OR: [
          { etablissementId: etablissement.id },
          { project: { etablissementId: etablissement.id } }
        ]
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
        donateur: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            titre: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Transformer les données pour le frontend
    const transformedDonations = donations.map(don => ({
      id: don.id,
      libelle: don.libelle,
      type: don.type,
      quantite: don.quantite,
      montant: don.montant,
      statut: don.statut,
      dateEnvoi: don.dateEnvoi?.toISOString(),
      dateReception: don.dateReception?.toISOString(),
      createdAt: don.createdAt.toISOString(),
      donateur: don.donateur,
      project: don.project
    }));

    return NextResponse.json({ donations: transformedDonations });
  } catch (e) {
    console.error("GET /api/etablissements/[id]/donations error", e);
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: e instanceof Error ? e.message : String(e)
    }, { status: 500 });
  }
}