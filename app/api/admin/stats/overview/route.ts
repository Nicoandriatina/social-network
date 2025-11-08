// app/api/admin/stats/overview/route.ts
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/middleware/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // 🔒 Vérification admin
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d";

    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const [
      totalUsers,
      usersThisPeriod,
      usersPreviousPeriod,
      usersByType,
      totalDonations,
      donationsThisPeriod,
      totalMonetaryAmount,
      activeProjects,
      pendingValidations,
      pendingDonations,
      totalLikes,
      totalComments,
      totalShares,
    ] = await Promise.all([
      // Total utilisateurs
      prisma.user.count(),

      // Utilisateurs période actuelle
      prisma.user.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Utilisateurs période précédente
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate,
          },
        },
      }),

      // Répartition par type
      prisma.user.groupBy({
        by: ["type"],
        _count: true,
      }),

      // Total donations
      prisma.don.count(),

      // Donations cette période
      prisma.don.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Montant total monétaire
      prisma.don.aggregate({
        where: { 
          type: "MONETAIRE", 
          montant: { not: null } 
        },
        _sum: { montant: true },
      }),

      // Projets avec au moins 1 don
      prisma.project.count({
        where: {
          dons: { some: {} },
        },
      }),

      // Utilisateurs + enseignants non validés
      prisma.user.count({
        where: {
          OR: [
            { isValidated: false },
            { 
              enseignant: { 
                validated: false 
              } 
            },
          ],
        },
      }),

      // Dons EN_ATTENTE depuis > 7 jours
      prisma.don.count({
        where: {
          statut: "EN_ATTENTE",
          createdAt: {
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Total likes
      prisma.projectLike.count(),

      // Total commentaires
      prisma.projectComment.count(),

      // Total partages
      prisma.projectShare.count(),
    ]);

    const growthRate =
      usersPreviousPeriod > 0
        ? ((usersThisPeriod - usersPreviousPeriod) / usersPreviousPeriod) * 100
        : 0;

    const userDistribution = usersByType.reduce(
      (acc, item) => {
        acc[item.type] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    const response = {
      period,
      kpis: {
        totalUsers: {
          value: totalUsers,
          change: parseFloat(growthRate.toFixed(1)),
          newThisPeriod: usersThisPeriod,
        },
        totalDonations: {
          value: totalDonations,
          newThisPeriod: donationsThisPeriod,
        },
        totalAmount: {
          value: totalMonetaryAmount._sum.montant || 0,
          formatted: new Intl.NumberFormat("fr-MG", {
            style: "currency",
            currency: "MGA"
          }).format(totalMonetaryAmount._sum.montant || 0),
        },
        activeProjects: {
          value: activeProjects,
        },
        engagement: {
          likes: totalLikes,
          comments: totalComments,
          shares: totalShares,
          total: totalLikes + totalComments + totalShares,
        },
      },
      alerts: {
        pendingValidations,
        pendingDonations,
        total: pendingValidations + pendingDonations,
      },
      userDistribution,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Erreur API /admin/stats/overview:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des statistiques" },
      { status: 500 }
    );
  }
}