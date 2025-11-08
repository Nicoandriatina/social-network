// app/api/admin/stats/top-donors/route.ts
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/middleware/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");
    const period = searchParams.get("period") || "all";

    let startDate: Date | undefined;
    const now = new Date();
    
    switch (period) {
      case "30d":
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "90d":
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case "1y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = undefined;
    }

    // Requête pour obtenir les top donateurs
    const topDonors = await prisma.user.findMany({
      where: {
        type: "DONATEUR",
        donsFaits: {
          some: {
            statut: "RECEPTIONNE",
            ...(startDate && { createdAt: { gte: startDate } })
          }
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        createdAt: true,
        donsFaits: {
          where: {
            statut: "RECEPTIONNE",
            ...(startDate && { createdAt: { gte: startDate } })
          },
          select: {
            id: true,
            type: true,
            montant: true,
            quantite: true,
            createdAt: true,
            project: {
              select: {
                titre: true,
                etablissement: {
                  select: {
                    nom: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        donsFaits: {
          _count: "desc"
        }
      },
      take: limit
    });

    // Enrichir les données avec statistiques
    const enrichedDonors = topDonors.map((donor) => {
      const donations = donor.donsFaits;
      
      // Calculer le montant total
      const totalAmount = donations
        .filter(d => d.type === "MONETAIRE" && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0);

      // Calculer le nombre total de dons par type
      const donationsByType = {
        MONETAIRE: donations.filter(d => d.type === "MONETAIRE").length,
        VIVRES: donations.filter(d => d.type === "VIVRES").length,
        NON_VIVRES: donations.filter(d => d.type === "NON_VIVRES").length
      };

      // Trouver le dernier don
      const lastDonation = donations.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )[0];

      // Calculer la fréquence de don
      const firstDonationDate = donations.length > 0 
        ? new Date(Math.min(...donations.map(d => d.createdAt.getTime())))
        : new Date();
      
      const monthsSinceFirstDonation = Math.max(
        1,
        Math.ceil(
          (Date.now() - firstDonationDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
        )
      );
      
      const donationFrequency = donations.length / monthsSinceFirstDonation;

      // Établissements bénéficiaires uniques
      const uniqueSchools = new Set(
        donations
          .map(d => d.project?.etablissement?.nom)
          .filter(Boolean)
      );

      return {
        id: donor.id,
        fullName: donor.fullName,
        email: donor.email,
        avatar: donor.avatar,
        memberSince: donor.createdAt,
        stats: {
          totalDonations: donations.length,
          totalAmount: totalAmount,
          donationsByType: donationsByType,
          uniqueSchools: uniqueSchools.size,
          donationFrequency: parseFloat(donationFrequency.toFixed(2)),
          lastDonationDate: lastDonation?.createdAt || null,
          lastDonationProject: lastDonation?.project?.titre || null
        }
      };
    });

    // Statistiques globales pour contexte
    const globalStats = await prisma.don.aggregate({
      where: {
        statut: "RECEPTIONNE",
        type: "MONETAIRE",
        ...(startDate && { createdAt: { gte: startDate } })
      },
      _sum: {
        montant: true
      },
      _count: true
    });

    return NextResponse.json({
      success: true,
      data: {
        topDonors: enrichedDonors,
        period: period,
        limit: limit,
        globalStats: {
          totalDonations: globalStats._count,
          totalAmount: globalStats._sum.montant || 0,
          averagePerDonor: enrichedDonors.length > 0
            ? (globalStats._sum.montant || 0) / enrichedDonors.length
            : 0
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Erreur Top Donateurs API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des top donateurs",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}

// Endpoint pour obtenir les détails d'un donateur spécifique
export async function POST(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { donorId } = await request.json();

    if (!donorId) {
      return NextResponse.json(
        { error: "ID donateur requis" },
        { status: 400 }
      );
    }

    const donorDetails = await prisma.user.findUnique({
      where: {
        id: donorId,
        type: "DONATEUR"
      },
      include: {
        donsFaits: {
          where: {
            statut: "RECEPTIONNE"
          },
          include: {
            project: {
              include: {
                etablissement: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!donorDetails) {
      return NextResponse.json(
        { error: "Donateur non trouvé" },
        { status: 404 }
      );
    }

    // Analyser l'historique mensuel
    const monthlyHistory = donorDetails.donsFaits.reduce((acc, don) => {
      const monthKey = don.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = {
          count: 0,
          amount: 0
        };
      }
      acc[monthKey].count++;
      if (don.montant) {
        acc[monthKey].amount += don.montant;
      }
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

    return NextResponse.json({
      success: true,
      data: {
        donor: donorDetails,
        monthlyHistory: monthlyHistory
      }
    });

  } catch (error) {
    console.error("❌ Erreur détails donateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails" },
      { status: 500 }
    );
  }
}