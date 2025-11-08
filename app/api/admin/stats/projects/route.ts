// app/api/admin/stats/projects/route.ts
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

    // 1. Statistiques globales des projets
    const [
      totalProjects,
      publishedProjects,
      projectsWithDonations
    ] = await Promise.all([
      prisma.project.count({
        where: startDate ? { createdAt: { gte: startDate } } : undefined
      }),
      prisma.project.count({
        where: {
          datePublication: { not: null },
          ...(startDate && { createdAt: { gte: startDate } })
        }
      }),
      prisma.project.count({
        where: {
          datePublication: { not: null },
          dons: {
            some: {
              statut: "RECEPTIONNE"
            }
          }
        }
      })
    ]);

    // 2. Projets par catégorie
    const projectsByCategory = await prisma.project.groupBy({
      by: ['categorie'],
      _count: { id: true },
      where: {
        datePublication: { not: null },
        ...(startDate && { createdAt: { gte: startDate } })
      },
      orderBy: {
        _count: { id: 'desc' }
      }
    });

    // 3. Top 10 projets les plus soutenus
    const topProjects = await prisma.project.findMany({
      where: {
        datePublication: { not: null },
        dons: {
          some: {
            statut: "RECEPTIONNE"
          }
        }
      },
      select: {
        id: true,
        reference: true,
        titre: true,
        categorie: true,
        createdAt: true,
        likesCount: true,
        commentsCount: true,
        sharesCount: true,
        etablissement: {
          select: {
            nom: true,
            adresse: true
          }
        },
        dons: {
          where: {
            statut: "RECEPTIONNE"
          },
          select: {
            id: true,
            type: true,
            montant: true
          }
        },
        _count: {
          select: {
            dons: {
              where: {
                statut: "RECEPTIONNE"
              }
            }
          }
        }
      },
      orderBy: {
        dons: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // 4. Taux de succès
    const successRate = publishedProjects > 0
      ? ((projectsWithDonations / publishedProjects) * 100).toFixed(1)
      : 0;

    // 5. Projets créés par jour (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyProjects = await prisma.$queryRaw<Array<{
      date: Date;
      count: bigint;
    }>>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::bigint as count
      FROM "Project"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // 6. Projets sans activité (> 30 jours sans don)
    const thirtyDaysAgoDate = new Date();
    thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);

    const inactiveProjects = await prisma.project.findMany({
      where: {
        datePublication: { not: null },
        createdAt: { lt: thirtyDaysAgoDate },
        dons: {
          none: {}
        }
      },
      select: {
        id: true,
        reference: true,
        titre: true,
        createdAt: true,
        etablissement: {
          select: {
            nom: true
          }
        }
      },
      take: 20
    });

    // 7. Temps moyen pour obtenir le premier don
    const projectsWithFirstDonation = await prisma.project.findMany({
      where: {
        datePublication: { not: null },
        dons: {
          some: {
            statut: "RECEPTIONNE"
          }
        }
      },
      select: {
        createdAt: true,
        dons: {
          where: {
            statut: "RECEPTIONNE"
          },
          orderBy: {
            createdAt: 'asc'
          },
          take: 1,
          select: {
            createdAt: true
          }
        }
      }
    });

    const timesToFirstDonation = projectsWithFirstDonation
      .filter(p => p.dons.length > 0)
      .map(project => {
        const projectCreated = new Date(project.createdAt).getTime();
        const firstDonation = new Date(project.dons[0].createdAt).getTime();
        return (firstDonation - projectCreated) / (1000 * 60 * 60 * 24);
      });

    const avgTimeToFirstDonation = timesToFirstDonation.length > 0
      ? (timesToFirstDonation.reduce((a, b) => a + b, 0) / timesToFirstDonation.length).toFixed(1)
      : 0;

    // 8. Distribution durée des projets
    const projectsWithDuration = await prisma.project.findMany({
      where: {
        datePublication: { not: null },
        dateDebut: { not: null },
        dateFin: { not: null }
      },
      select: {
        dateDebut: true,
        dateFin: true
      }
    });

    const durations = projectsWithDuration.map(p => {
      const start = new Date(p.dateDebut!).getTime();
      const end = new Date(p.dateFin!).getTime();
      return (end - start) / (1000 * 60 * 60 * 24);
    });

    const avgDuration = durations.length > 0
      ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(0)
      : 0;

    // 9. Projets en cours vs terminés
    const nowDate = new Date();
    const [ongoingProjects, completedProjects] = await Promise.all([
      prisma.project.count({
        where: {
          datePublication: { not: null },
          dateDebut: { lte: nowDate },
          OR: [
            { dateFin: { gte: nowDate } },
            { dateFin: null }
          ]
        }
      }),
      prisma.project.count({
        where: {
          datePublication: { not: null },
          dateFin: { lt: nowDate }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalProjects,
          publishedProjects,
          projectsWithDonations,
          successRate: parseFloat(successRate),
          avgTimeToFirstDonation: parseFloat(avgTimeToFirstDonation),
          avgProjectDuration: parseFloat(avgDuration),
          ongoingProjects,
          completedProjects
        },
        projectsByCategory: projectsByCategory.map(item => ({
          category: item.categorie,
          count: item._count.id
        })),
        topProjects: topProjects.map(project => {
          const totalAmount = project.dons
            .filter(d => d.type === "MONETAIRE" && d.montant)
            .reduce((sum, d) => sum + (d.montant || 0), 0);

          return {
            id: project.id,
            reference: project.reference,
            title: project.titre,
            category: project.categorie,
            schoolName: project.etablissement.nom,
            address: project.etablissement.adresse,
            donationsCount: project._count.dons,
            totalAmount: totalAmount,
            engagement: {
              likes: project.likesCount,
              comments: project.commentsCount,
              shares: project.sharesCount
            },
            createdAt: project.createdAt
          };
        }),
        dailyProjects: dailyProjects.map(day => ({
          date: day.date.toISOString().split('T')[0],
          count: Number(day.count)
        })),
        inactiveProjects: inactiveProjects.map(project => ({
          id: project.id,
          reference: project.reference,
          title: project.titre,
          schoolName: project.etablissement.nom,
          daysInactive: Math.floor(
            (Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          )
        })),
        period,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Erreur Stats Projects API:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des statistiques de projets",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}