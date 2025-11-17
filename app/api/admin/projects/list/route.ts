// app/api/admin/projects/list/route.ts
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
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // published, draft, completed
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Construction des filtres
    const where: any = {};

    if (category) where.categorie = category;

    if (status === "published") {
      where.datePublication = { not: null };
    } else if (status === "draft") {
      where.datePublication = null;
    } else if (status === "completed") {
      where.dateFin = { lt: new Date() };
    }

    if (search) {
      where.OR = [
        { titre: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } }
      ];
    }

    // Récupération des projets
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          auteur: {
            select: {
              id: true,
              fullName: true,
              type: true,
              avatar: true
            }
          },
          etablissement: {
            select: {
              nom: true,
              adresse: true,
              type: true
            }
          },
          _count: {
            select: {
              dons: true,
              likes: true,
              comments: true,
              shares: true
            }
          },
          dons: {
            where: {
              statut: "RECEPTIONNE"
            },
            select: {
              type: true,
              montant: true
            }
          }
        }
      }),
      prisma.project.count({ where })
    ]);

    // Enrichir les données
    const enrichedProjects = projects.map(project => {
      const totalAmount = project.dons
        .filter(d => d.type === "MONETAIRE" && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0);

      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      const isCompleted = project.dateFin && new Date(project.dateFin) < new Date();

      return {
        id: project.id,
        reference: project.reference,
        titre: project.titre,
        description: project.description,
        categorie: project.categorie,
        createdAt: project.createdAt,
        datePublication: project.datePublication,
        dateDebut: project.dateDebut,
        dateFin: project.dateFin,
        daysSinceCreation,
        isCompleted,
        auteur: project.auteur,
        etablissement: project.etablissement,
        stats: {
          donations: project._count.dons,
          totalAmount,
          likes: project.likesCount,
          comments: project.commentsCount,
          shares: project.sharesCount,
          engagement: project.likesCount + project.commentsCount + project.sharesCount
        }
      };
    });

    // Statistiques
    const [categoryStats, statusStats] = await Promise.all([
      prisma.project.groupBy({
        by: ['categorie'],
        _count: { id: true },
        where: { datePublication: { not: null } }
      }),
      Promise.all([
        prisma.project.count({ where: { datePublication: { not: null } } }),
        prisma.project.count({ where: { datePublication: null } }),
        prisma.project.count({
          where: {
            datePublication: { not: null },
            dateFin: { lt: new Date() }
          }
        })
      ])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: enrichedProjects,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount
        },
        stats: {
          byCategory: categoryStats.map(s => ({
            category: s.categorie,
            count: s._count.id
          })),
          byStatus: {
            published: statusStats[0],
            draft: statusStats[1],
            completed: statusStats[2]
          }
        }
      }
    });

  } catch (error) {
    console.error("❌ Erreur API Projects List:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des projets"
      },
      { status: 500 }
    );
  }
}

// Actions sur les projets
export async function POST(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const body = await request.json();
    const { action, projectId, reason } = body;

    if (!action || !projectId) {
      return NextResponse.json(
        { error: "Action et projectId requis" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "unpublish":
        result = await prisma.project.update({
          where: { id: projectId },
          data: { 
            datePublication: null,
            unpublishedReason: reason || "Dépublié par l'administrateur"
          }
        });
        break;

      case "publish":
        result = await prisma.project.update({
          where: { id: projectId },
          data: { 
            datePublication: new Date(),
            unpublishedReason: null
          }
        });
        break;

      case "delete":
        // Vérifier si le projet a des dons
        const projectWithDonations = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            _count: {
              select: { dons: true }
            }
          }
        });

        if (projectWithDonations && projectWithDonations._count.dons > 0) {
          return NextResponse.json(
            { error: "Impossible de supprimer un projet avec des dons" },
            { status: 400 }
          );
        }

        result = await prisma.project.delete({
          where: { id: projectId }
        });
        break;

      default:
        return NextResponse.json(
          { error: "Action non reconnue" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Action '${action}' effectuée avec succès`,
      data: result
    });

  } catch (error) {
    console.error("❌ Erreur action projet:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'exécution de l'action" },
      { status: 500 }
    );
  }
}