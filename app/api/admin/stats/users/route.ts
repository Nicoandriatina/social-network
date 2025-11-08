// app/api/admin/stats/users/route.ts
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

    // 1. Statistiques globales par type
    const usersByType = await prisma.user.groupBy({
      by: ['type'],
      _count: { id: true },
      where: startDate ? { createdAt: { gte: startDate } } : undefined
    });

    // 2. Croissance journalière (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySignups = await prisma.$queryRaw<Array<{
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
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // 3. Utilisateurs validés
    const [totalUsers, validatedUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isValidated: true } })
    ]);

    const activationRate = totalUsers > 0 
      ? ((validatedUsers / totalUsers) * 100).toFixed(1)
      : 0;

    // 4. Utilisateurs en attente de validation
    const pendingValidation = await prisma.user.groupBy({
      by: ['type'],
      _count: { id: true },
      where: { isValidated: false }
    });

    // 5. Répartition par pays (country)
    const usersByCountry = await prisma.user.groupBy({
      by: ['country'],
      _count: { id: true },
      where: {
        country: { not: null }
      },
      orderBy: {
        _count: { id: 'desc' }
      },
      take: 10
    });

    // 6. Top 10 utilisateurs les plus actifs
    const mostActiveUsers = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        type: true,
        avatar: true,
        _count: {
          select: {
            projects: true,
            projectComments: true,
            projectLikes: true
          }
        }
      },
      orderBy: {
        projects: { _count: 'desc' }
      },
      take: 10
    });

    // 7. Nouveaux utilisateurs cette semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newUsersThisWeek = await prisma.user.count({
      where: { createdAt: { gte: oneWeekAgo } }
    });

    // 8. Distribution par ancienneté
    const now2 = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now2.getMonth() - 1);
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now2.getMonth() - 3);
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now2.getMonth() - 6);

    const [
      lessThanMonth,
      oneToThreeMonths,
      threeToSixMonths,
      moreThanSixMonths
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: oneMonthAgo } } }),
      prisma.user.count({ 
        where: { 
          createdAt: { 
            gte: threeMonthsAgo,
            lt: oneMonthAgo
          } 
        } 
      }),
      prisma.user.count({ 
        where: { 
          createdAt: { 
            gte: sixMonthsAgo,
            lt: threeMonthsAgo
          } 
        } 
      }),
      prisma.user.count({ where: { createdAt: { lt: sixMonthsAgo } } })
    ]);

    // 9. Statistiques par rôle
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { id: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          validatedUsers,
          activationRate: parseFloat(activationRate),
          newUsersThisWeek
        },
        usersByType: usersByType.map(item => ({
          type: item.type,
          count: item._count.id
        })),
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.id
        })),
        dailySignups: dailySignups.map(day => ({
          date: day.date.toISOString().split('T')[0],
          etablissements: Number(day.etablissements),
          enseignants: Number(day.enseignants),
          donateurs: Number(day.donateurs)
        })),
        pendingValidation: pendingValidation.map(item => ({
          type: item.type,
          count: item._count.id
        })),
        usersByCountry: usersByCountry.map(item => ({
          country: item.country || 'Non spécifié',
          count: item._count.id
        })),
        mostActiveUsers: mostActiveUsers.map(user => ({
          id: user.id,
          fullName: user.fullName,
          type: user.type,
          avatar: user.avatar,
          activityScore: 
            user._count.projects * 3 + 
            user._count.projectComments * 2 + 
            user._count.projectLikes,
          details: {
            projects: user._count.projects,
            comments: user._count.projectComments,
            likes: user._count.projectLikes
          }
        })),
        usersByTenure: {
          lessThanMonth,
          oneToThreeMonths,
          threeToSixMonths,
          moreThanSixMonths
        },
        period,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Erreur Stats Users API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des statistiques utilisateurs",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}