// app/api/admin/moderation/route.ts
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/middleware/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Note: Cette API suppose l'existence d'un modèle Report dans votre schéma Prisma
// Si vous n'avez pas encore de système de signalement, vous devrez d'abord créer le modèle

export async function GET(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // user, project, comment
    const status = searchParams.get("status"); // pending, reviewed, resolved
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    // Pour l'instant, retournons une structure de données simulée
    // car le modèle Report n'existe probablement pas encore

    // Utilisateurs suspendus récemment
    const suspendedUsers = await prisma.user.findMany({
      where: {
        isSuspended: true,
        suspendedAt: { not: null }
      },
      take: 10,
      orderBy: { suspendedAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        type: true,
        suspendedAt: true,
        suspensionReason: true,
        _count: {
          select: {
            projects: true,
            donsFaits: true
          }
        }
      }
    });

    // Projets dépubliés
    const unpublishedProjects = await prisma.project.findMany({
      where: {
        datePublication: null,
        unpublishedReason: { not: null }
      },
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        auteur: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    });

    // Commentaires récents (pour modération proactive)
    const recentComments = await prisma.projectComment.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            titre: true
          }
        }
      }
    });

    // Statistiques de modération
    const [
      totalSuspendedUsers,
      totalUnpublishedProjects,
      usersValidationPending
    ] = await Promise.all([
      prisma.user.count({ where: { isSuspended: true } }),
      prisma.project.count({
        where: {
          datePublication: null,
          unpublishedReason: { not: null }
        }
      }),
      prisma.user.count({ where: { isValidated: false } })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        suspendedUsers: suspendedUsers.map(u => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          type: u.type,
          suspendedAt: u.suspendedAt,
          reason: u.suspensionReason,
          activityCount: u._count.projects + u._count.donsFaits
        })),
        unpublishedProjects: unpublishedProjects.map(p => ({
          id: p.id,
          reference: p.reference,
          title: p.titre,
          author: p.auteur.fullName,
          reason: p.unpublishedReason,
          updatedAt: p.updatedAt
        })),
        recentComments: recentComments.map(c => ({
          id: c.id,
          content: c.content,
          author: c.user,
          project: c.project,
          createdAt: c.createdAt
        })),
        stats: {
          suspendedUsers: totalSuspendedUsers,
          unpublishedProjects: totalUnpublishedProjects,
          pendingValidations: usersValidationPending,
          totalActions: totalSuspendedUsers + totalUnpublishedProjects
        }
      }
    });

  } catch (error) {
    console.error("❌ Erreur API Moderation:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération des données de modération"
      },
      { status: 500 }
    );
  }
}

// Actions de modération
export async function POST(request: Request) {
  const authCheck = await requireSuperAdmin();
  if (authCheck instanceof NextResponse) return authCheck;

  try {
    const body = await request.json();
    const { action, targetType, targetId, reason } = body;

    if (!action || !targetType || !targetId) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    let result;

    switch (targetType) {
      case "comment":
        if (action === "delete") {
          result = await prisma.projectComment.delete({
            where: { id: targetId }
          });
        }
        break;

      case "project":
        if (action === "unpublish") {
          result = await prisma.project.update({
            where: { id: targetId },
            data: {
              datePublication: null,
              unpublishedReason: reason || "Contenu inapproprié"
            }
          });
        }
        break;

      case "user":
        if (action === "suspend") {
          result = await prisma.user.update({
            where: { id: targetId },
            data: {
              isSuspended: true,
              suspendedAt: new Date(),
              suspensionReason: reason || "Violation des conditions d'utilisation"
            }
          });
        } else if (action === "unsuspend") {
          result = await prisma.user.update({
            where: { id: targetId },
            data: {
              isSuspended: false,
              suspendedAt: null,
              suspensionReason: null
            }
          });
        }
        break;

      default:
        return NextResponse.json(
          { error: "Type de cible non reconnu" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Action '${action}' effectuée avec succès`,
      data: result
    });

  } catch (error) {
    console.error("❌ Erreur action modération:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'exécution de l'action" },
      { status: 500 }
    );
  }
}