// app/api/admin/users/route.ts
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
    const type = searchParams.get("type"); // ETABLISSEMENT, ENSEIGNANT, DONATEUR
    const status = searchParams.get("status"); // active, suspended, inactive
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Construction des filtres
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status === "suspended") {
      where.isSuspended = true;
    } else if (status === "active") {
      where.isSuspended = false;
      where.isValidated = true;
    } else if (status === "inactive") {
      where.isValidated = false;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { etablissement: { nom: { contains: search, mode: "insensitive" } } }
      ];
    }

    // Récupération des utilisateurs
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          etablissement: {
            select: {
              nom: true,
              adresse: true,
              type: true
            }
          },
          enseignant: {
            select: {
              school: true,
              position: true,
              validated: true
            }
          },
          _count: {
            select: {
              projects: true,
              donsFaits: true,
              donsRecus: true,
              projectLikes: true,
              projectComments: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    // Calculer l'inactivité (dernière connexion si disponible)
    const enrichedUsers = users.map(user => {
      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      const activityScore = 
        user._count.projects * 5 +
        user._count.donsFaits * 3 +
        user._count.projectComments * 2 +
        user._count.projectLikes;

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        type: user.type,
        role: user.role,
        avatar: user.avatar,
        country: user.country,
        isValidated: user.isValidated,
        isSuspended: user.isSuspended,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        daysSinceCreation,
        activityScore,
        etablissement: user.etablissement,
        enseignant: user.enseignant,
        stats: {
          projects: user._count.projects,
          donationsMade: user._count.donsFaits,
          donationsReceived: user._count.donsRecus,
          likes: user._count.projectLikes,
          comments: user._count.projectComments
        }
      };
    });

    // Statistiques globales pour le contexte
    const stats = await prisma.user.groupBy({
      by: ['type'],
      _count: { id: true },
      where: { isSuspended: false }
    });

    return NextResponse.json({
      success: true,
      data: {
        users: enrichedUsers,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount
        },
        stats: stats.map(s => ({
          type: s.type,
          count: s._count.id
        }))
      }
    });

  } catch (error) {
    console.error("❌ Erreur API Users List:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des utilisateurs"
      },
      { status: 500 }
    );
  }
}

// Actions sur les utilisateurs (POST)
export async function POST(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const body = await request.json();
    const { action, userId, reason } = body;

    if (!action || !userId) {
      return NextResponse.json(
        { error: "Action et userId requis" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "suspend":
        result = await prisma.user.update({
          where: { id: userId },
          data: { 
            isSuspended: true,
            suspendedAt: new Date(),
            suspensionReason: reason || "Suspendu par l'administrateur"
          }
        });
        break;

      case "activate":
        result = await prisma.user.update({
          where: { id: userId },
          data: { 
            isSuspended: false,
            isValidated: true,
            suspendedAt: null,
            suspensionReason: null
          }
        });
        break;

      case "delete":
        // Vérifier si l'utilisateur a des activités
        const userActivity = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            _count: {
              select: {
                projects: true,
                donsFaits: true,
                donsRecus: true
              }
            }
          }
        });

        if (userActivity && (
          userActivity._count.projects > 0 ||
          userActivity._count.donsFaits > 0 ||
          userActivity._count.donsRecus > 0
        )) {
          return NextResponse.json(
            { error: "Impossible de supprimer un utilisateur avec des activités" },
            { status: 400 }
          );
        }

        result = await prisma.user.delete({
          where: { id: userId }
        });
        break;

      case "validate":
        result = await prisma.user.update({
          where: { id: userId },
          data: { isValidated: true }
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
    console.error("❌ Erreur action utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'exécution de l'action" },
      { status: 500 }
    );
  }
}