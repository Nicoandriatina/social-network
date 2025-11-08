// app/api/admin/stats/donations/route.ts
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/middleware/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    let startDate: Date | undefined;
    const now = new Date();
    
    switch (period) {
      case "7d":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
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

    // 1. Statistiques globales des dons
    const [totalDonations, receivedDonations, sentDonations, pendingDonations] = await Promise.all([
      prisma.don.count({
        where: startDate ? { createdAt: { gte: startDate } } : undefined
      }),
      prisma.don.count({
        where: {
          statut: "RECEPTIONNE",
          ...(startDate && { createdAt: { gte: startDate } })
        }
      }),
      prisma.don.count({
        where: {
          statut: "ENVOYE",
          ...(startDate && { createdAt: { gte: startDate } })
        }
      }),
      prisma.don.count({
        where: {
          statut: "EN_ATTENTE",
          ...(startDate && { createdAt: { gte: startDate } })
        }
      })
    ]);

    // 2. Montants totaux par type de don
    const donationsByType = await prisma.don.groupBy({
      by: ['type'],
      _count: { id: true },
      _sum: {
        montant: true,
        quantite: true
      },
      where: {
        statut: "RECEPTIONNE",
        ...(startDate && { createdAt: { gte: startDate } })
      }
    });

    // 3. Entonnoir de conversion
    const funnel = {
      created: totalDonations,
      sent: sentDonations + receivedDonations,
      received: receivedDonations,
      conversionRate: totalDonations > 0 
        ? ((receivedDonations / totalDonations) * 100).toFixed(1)
        : 0
    };

    // 4. Évolution des dons (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyDonations = await prisma.$queryRaw<Array<{
      date: Date;
      count: bigint;
      amount: number;
    }>>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::bigint as count,
        COALESCE(SUM(CASE WHEN type = 'MONETAIRE' THEN montant ELSE 0 END), 0)::float as amount
      FROM "Don"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // 5. Temps moyen de traitement
    const processedDonations = await prisma.don.findMany({
      where: {
        statut: "RECEPTIONNE",
        dateReception: { not: null }
      },
      select: {
        createdAt: true,
        dateReception: true
      }
    });

    const processingTimes = processedDonations.map(don => {
      const created = new Date(don.createdAt).getTime();
      const received = new Date(don.dateReception!).getTime();
      return (received - created) / (1000 * 60 * 60 * 24);
    });

    const averageProcessingTime = processingTimes.length > 0
      ? (processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length).toFixed(1)
      : 0;

    // 6. Dons bloqués (en attente > 14 jours)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const stuckDonations = await prisma.don.findMany({
      where: {
        statut: { in: ["EN_ATTENTE", "ENVOYE"] },
        createdAt: { lt: fourteenDaysAgo }
      },
      select: {
        id: true,
        libelle: true,
        statut: true,
        createdAt: true,
        donateur: {
          select: {
            fullName: true
          }
        },
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
      },
      take: 10
    });

    // 7. Top établissements bénéficiaires
    const topRecipientSchools = await prisma.etablissement.findMany({
      select: {
        id: true,
        nom: true,
        adresse: true,
        _count: {
          select: {
            donsRecus: {
              where: {
                statut: "RECEPTIONNE"
              }
            }
          }
        }
      },
      orderBy: {
        donsRecus: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // 8. Valeur moyenne des dons monétaires
    const monetaryDonations = await prisma.don.aggregate({
      where: {
        type: "MONETAIRE",
        statut: "RECEPTIONNE",
        montant: { not: null },
        ...(startDate && { createdAt: { gte: startDate } })
      },
      _avg: { montant: true },
      _sum: { montant: true },
      _count: true
    });

    // 9. Taux de satisfaction
    const satisfactionRate = totalDonations > 0
      ? ((receivedDonations / totalDonations) * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalDonations,
          receivedDonations,
          sentDonations,
          pendingDonations,
          totalAmount: monetaryDonations._sum.montant || 0,
          averageDonationAmount: monetaryDonations._avg.montant || 0,
          averageProcessingTime: parseFloat(averageProcessingTime),
          satisfactionRate: parseFloat(satisfactionRate)
        },
        donationsByType: donationsByType.map(item => ({
          type: item.type,
          count: item._count.id,
          totalAmount: item._sum.montant || 0,
          totalQuantity: item._sum.quantite || 0
        })),
        funnel: {
          created: funnel.created,
          sent: funnel.sent,
          received: funnel.received,
          conversionRate: parseFloat(funnel.conversionRate)
        },
        dailyDonations: dailyDonations.map(day => ({
          date: day.date.toISOString().split('T')[0],
          count: Number(day.count),
          amount: Number(day.amount)
        })),
        stuckDonations: stuckDonations.map(don => ({
          id: don.id,
          libelle: don.libelle,
          statut: don.statut,
          daysStuck: Math.floor(
            (Date.now() - new Date(don.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          ),
          donor: don.donateur.fullName,
          recipient: don.project?.etablissement?.nom || "N/A",
          projectTitle: don.project?.titre || "N/A"
        })),
        topRecipientSchools: topRecipientSchools.map(school => ({
          id: school.id,
          name: school.nom,
          address: school.adresse,
          donationsReceived: school._count.donsRecus
        })),
        period,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Erreur Stats Donations API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des statistiques de dons",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}