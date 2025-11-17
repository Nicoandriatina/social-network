// app/api/admin/donations/list/route.ts
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/middleware/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type"); // MONETAIRE, VIVRES, NON_VIVRES
    const status = searchParams.get("status"); // EN_ATTENTE, ENVOYE, RECEPTIONNE
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Construction des filtres
    const where: any = {};

    if (type) where.type = type;
    if (status) where.statut = status;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { libelle: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { donateur: { fullName: { contains: search, mode: "insensitive" } } },
        { project: { titre: { contains: search, mode: "insensitive" } } }
      ];
    }

    // Récupération des dons
    const [donations, totalCount] = await Promise.all([
      prisma.don.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          donateur: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatar: true,
              type: true
            }
          },
          project: {
            select: {
              id: true,
              titre: true,
              reference: true,
              categorie: true,
              etablissement: {
                select: {
                  nom: true,
                  adresse: true
                }
              }
            }
          },
          beneficiaireEtab: {
            select: {
              nom: true,
              adresse: true
            }
          },
          beneficiairePersonnel: {
            select: {
              fullName: true,
              email: true
            }
          }
        }
      }),
      prisma.don.count({ where })
    ]);

    // Enrichir les données
    const enrichedDonations = donations.map(don => {
      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(don.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      const processingTime = don.dateReception
        ? Math.floor(
            (new Date(don.dateReception).getTime() - new Date(don.createdAt).getTime()) / 
            (1000 * 60 * 60 * 24)
          )
        : null;

      // Déterminer le bénéficiaire
      let recipient = null;
      if (don.project) {
        recipient = {
          type: "project",
          name: don.project.titre,
          school: don.project.etablissement?.nom
        };
      } else if (don.beneficiaireEtab) {
        recipient = {
          type: "school",
          name: don.beneficiaireEtab.nom,
          address: don.beneficiaireEtab.adresse
        };
      } else if (don.beneficiairePersonnel) {
        recipient = {
          type: "user",
          name: don.beneficiairePersonnel.fullName
        };
      }

      return {
        id: don.id,
        reference: don.reference,
        libelle: don.libelle,
        description: don.description,
        type: don.type,
        statut: don.statut,
        montant: don.montant,
        quantite: don.quantite,
        unite: don.unite,
        createdAt: don.createdAt,
        dateEnvoi: don.dateEnvoi,
        dateReception: don.dateReception,
        daysSinceCreation,
        processingTime,
        donateur: don.donateur,
        recipient,
        isStuck: don.statut !== "RECEPTIONNE" && daysSinceCreation > 14
      };
    });

    // Statistiques pour le contexte
    const [typeStats, statusStats, monetaryTotal] = await Promise.all([
      prisma.don.groupBy({
        by: ['type'],
        _count: { id: true },
        where
      }),
      prisma.don.groupBy({
        by: ['statut'],
        _count: { id: true },
        where
      }),
      prisma.don.aggregate({
        where: { ...where, type: "MONETAIRE" },
        _sum: { montant: true }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        donations: enrichedDonations,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount
        },
        stats: {
          byType: typeStats.map(s => ({ type: s.type, count: s._count.id })),
          byStatus: statusStats.map(s => ({ status: s.statut, count: s._count.id })),
          totalMonetary: monetaryTotal._sum.montant || 0
        }
      }
    });

  } catch (error) {
    console.error("❌ Erreur API Donations List:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des dons"
      },
      { status: 500 }
    );
  }
}

// Détails d'un don spécifique
export async function POST(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { donationId } = await request.json();

    const donation = await prisma.don.findUnique({
      where: { id: donationId },
      include: {
        donateur: {
          include: {
            _count: {
              select: {
                donsFaits: true
              }
            }
          }
        },
        project: {
          include: {
            etablissement: true,
            auteur: {
              select: {
                fullName: true,
                email: true
              }
            }
          }
        },
        etablissementDirect: true,
        beneficiaireDirect: true
      }
    });

    if (!donation) {
      return NextResponse.json(
        { error: "Don non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: donation
    });

  } catch (error) {
    console.error("❌ Erreur détails don:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails" },
      { status: 500 }
    );
  }
}