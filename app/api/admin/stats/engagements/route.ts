// app/api/admin/stats/engagement/route.ts
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

    let startDate: Date;
    const now = new Date();
    
    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

   

    // 1. Métriques globales d'engagement (période actuelle)
    const [totalLikes, totalComments, totalShares, totalProjects] = await Promise.all([
      prisma.projectLike.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.projectComment.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.projectShare.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.project.count({
        where: {
          datePublication: { not: null },
          createdAt: { gte: startDate }
        }
      })
    ]);

    

    // 2. Période précédente pour calculer la croissance
    const periodLength = now.getTime() - startDate.getTime();
    const previousPeriodStart = new Date(startDate.getTime() - periodLength);

    const [prevLikes, prevComments, prevShares] = await Promise.all([
      prisma.projectLike.count({
        where: {
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate
          }
        }
      }),
      prisma.projectComment.count({
        where: {
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate
          }
        }
      }),
      prisma.projectShare.count({
        where: {
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate
          }
        }
      })
    ]);

    // 3. Calculer les croissances
    const likesGrowth = prevLikes > 0 
      ? ((totalLikes - prevLikes) / prevLikes) * 100
      : totalLikes > 0 ? 100 : 0;

    const commentsGrowth = prevComments > 0 
      ? ((totalComments - prevComments) / prevComments) * 100
      : totalComments > 0 ? 100 : 0;

    const sharesGrowth = prevShares > 0 
      ? ((totalShares - prevShares) / prevShares) * 100
      : totalShares > 0 ? 100 : 0;

    // 4. Top 10 projets les plus engageants
    const topProjects = await prisma.project.findMany({
      where: {
        datePublication: { not: null },
        createdAt: { gte: startDate }
      },
      select: {
        id: true,
        titre: true,
        description: true,
        createdAt: true,
        likesCount: true,
        commentsCount: true,
        sharesCount: true,
        auteur: {
          select: {
            id: true,
            fullName: true,
            type: true,
            avatar: true
          }
        }
      },
      orderBy: [
        { likesCount: 'desc' },
        { commentsCount: 'desc' }
      ],
      take: 10
    });

    // 5. Taux d'engagement
    const engagementRate = totalProjects > 0
      ? ((totalLikes + totalComments + totalShares) / totalProjects) * 100
      : 0;

    // 6. Taux de viralité
    const viralityRate = totalProjects > 0
      ? (totalShares / totalProjects) * 100
      : 0;

    console.log(" Données prêtes, envoi de la réponse");

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalLikes,
          totalComments,
          totalShares,
          totalProjects,
          totalInteractions: totalLikes + totalComments + totalShares,
          engagementRate: parseFloat(engagementRate.toFixed(1)),
          viralityRate: parseFloat(viralityRate.toFixed(1)),
          growth: {
            likes: parseFloat(likesGrowth.toFixed(1)),
            comments: parseFloat(commentsGrowth.toFixed(1)),
            shares: parseFloat(sharesGrowth.toFixed(1))
          }
        },
        topProjects: topProjects.map(pub => ({
          id: pub.id,
          title: pub.titre,
          content: pub.description?.substring(0, 100) + (pub.description?.length > 100 ? '...' : '') || '',
          author: {
            id: pub.auteur.id,
            fullName: pub.auteur.fullName,
            type: pub.auteur.type,
            avatar: pub.auteur.avatar
          },
          createdAt: pub.createdAt,
          engagement: {
            likes: pub.likesCount,
            comments: pub.commentsCount,
            shares: pub.sharesCount,
            total: pub.likesCount + pub.commentsCount + pub.sharesCount
          }
        })),
        period,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Erreur Stats Engagement API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des statistiques d'engagement",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}