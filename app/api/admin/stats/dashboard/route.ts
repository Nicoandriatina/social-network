// app/api/admin/stats/dashboard/route.ts
// API optionnelle qui agrège toutes les données en une seule requête
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

    // Récupérer toutes les données en parallèle
    const [
      // KPIs
      totalUsers,
      usersThisPeriod,
      usersPreviousPeriod,
      totalDonations,
      totalMonetaryAmount,
      activeProjects,
      pendingValidations,
      
      // User Growth
      dailySignups,
      
      // Donations
      donationsByType,
      donationsByStatus,
      topProjects,
      
      // Engagement
      totalLikes,
      totalComments,
      totalShares,
      prevLikes,
      prevComments,
      prevShares
    ] = await Promise.all([
      // KPIs
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startDate } } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(startDate!.getTime() - (now.getTime() - startDate!.getTime())),
            lt: startDate
          }
        }
      }),
      prisma.don.count(),
      prisma.don.aggregate({
        where: { type: "MONETAIRE", montant: { not: null } },
        _sum: { montant: true }
      }),
      prisma.project.count({ where: { dons: { some: {} } } }),
      prisma.user.count({
        where: {
          OR: [
            { isValidated: false },
            { enseignant: { validated: false } }
          ]
        }
      }),
      
      // User Growth (30 derniers jours)
      prisma.$queryRaw<Array<{
        date: Date;
        etablissements: bigint;
        enseignants: bigint;
        donateurs: bigint;
      }>>`
        SELECT 
          DATE("createdAt") as date,
          COUNT(CASE WHEN type = 'ETABLISSEMENT' THEN 1 END) as etablissements,
          COUNT(CASE WHEN type = 'ENSEIGNANT' THEN 1 END) as enseignants,
          COUNT(CASE WHEN type = 'DONATEUR' THEN 1 END) as donateurs
        FROM "User"
        WHERE "createdAt" >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
      
      // Donations by type
      prisma.don.groupBy({
        by: ['type'],
        _count: { id: true },
        where: { statut: "RECEPTIONNE" }
      }),
      
      // Donations by status
      prisma.don.groupBy({
        by: ['statut'],
        _count: { id: true }
      }),
      
      // Top projects
      prisma.project.findMany({
        where: {
          datePublication: { not: null },
          dons: { some: { statut: "RECEPTIONNE" } }
        },
        select: {
          id: true,
          titre: true,
          _count: {
            select: { dons: { where: { statut: "RECEPTIONNE" } } }
          },
          dons: {
            where: { statut: "RECEPTIONNE", type: "MONETAIRE" },
            select: { montant: true }
          }
        },
        orderBy: { dons: { _count: 'desc' } },
        take: 5
      }),
      
      // Engagement
      prisma.projectLike.count({ where: startDate ? { createdAt: { gte: startDate } } : undefined }),
      prisma.projectComment.count({ where: startDate ? { createdAt: { gte: startDate } } : undefined }),
      prisma.projectShare.count({ where: startDate ? { createdAt: { gte: startDate } } : undefined }),
      
      // Previous period engagement
      prisma.projectLike.count({
        where: {
          createdAt: {
            gte: new Date(startDate!.getTime() - (now.getTime() - startDate!.getTime())),
            lt: startDate
          }
        }
      }),
      prisma.projectComment.count({
        where: {
          createdAt: {
            gte: new Date(startDate!.getTime() - (now.getTime() - startDate!.getTime())),
            lt: startDate
          }
        }
      }),
      prisma.projectShare.count({
        where: {
          createdAt: {
            gte: new Date(startDate!.getTime() - (now.getTime() - startDate!.getTime())),
            lt: startDate
          }
        }
      })
    ]);

    // Calculer les croissances
    const growthRate = usersPreviousPeriod > 0
      ? ((usersThisPeriod - usersPreviousPeriod) / usersPreviousPeriod) * 100
      : 0;

    const likesGrowth = prevLikes > 0 
      ? ((totalLikes - prevLikes) / prevLikes) * 100 
      : totalLikes > 0 ? 100 : 0;
    
    const commentsGrowth = prevComments > 0 
      ? ((totalComments - prevComments) / prevComments) * 100 
      : totalComments > 0 ? 100 : 0;
    
    const sharesGrowth = prevShares > 0 
      ? ((totalShares - prevShares) / prevShares) * 100 
      : totalShares > 0 ? 100 : 0;

    // Préparer les données du funnel
    const statusMap = donationsByStatus.reduce((acc, item) => {
      acc[item.statut] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    const funnel = {
      created: totalDonations,
      sent: (statusMap['ENVOYE'] || 0) + (statusMap['RECEPTIONNE'] || 0),
      received: statusMap['RECEPTIONNE'] || 0
    };

    // Formatter les top projects
    const formattedTopProjects = topProjects.map(p => ({
      id: p.id,
      title: p.titre,
      donations: p._count.dons,
      amount: p.dons.reduce((sum, d) => sum + (d.montant || 0), 0)
    }));

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalUsers,
          growth: growthRate,
          totalDonations,
          totalAmount: totalMonetaryAmount._sum.montant || 0,
          activeProjects,
          pendingValidations
        },
        userGrowth: dailySignups.map(day => ({
          date: day.date.toISOString().split('T')[0],
          etablissements: Number(day.etablissements),
          enseignants: Number(day.enseignants),
          donateurs: Number(day.donateurs)
        })),
        donationsByType: donationsByType.map(item => ({
          type: item.type,
          count: item._count.id
        })),
        donationFunnel: funnel,
        topProjects: formattedTopProjects,
        engagement: {
          likes: totalLikes,
          likesGrowth,
          comments: totalComments,
          commentsGrowth,
          shares: totalShares,
          sharesGrowth
        },
        period,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Erreur Dashboard API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des données du dashboard",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}