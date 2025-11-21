import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Récupérer les commentaires d'un projet (VERSION SIMPLIFIÉE)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    // Récupérer les commentaires
    const comments = await prisma.projectComment.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // ✅ Calculer les likes pour chaque commentaire
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        // Compter les likes
        const likesCount = await prisma.commentLike.count({
          where: { commentId: comment.id }
        });

        // Vérifier si l'utilisateur a liké
        const userLike = await prisma.commentLike.findUnique({
          where: {
            userId_commentId: {
              userId: payload.userId,
              commentId: comment.id
            }
          }
        });

        
        return {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          user: comment.user,
          likesCount,
          liked: !!userLike
        };
      })
    );

    return NextResponse.json({ comments: commentsWithLikes });
  } catch (error) {
    console.error("GET /api/projects/[id]/comments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Ajouter un commentaire
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    
    const body = await req.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ 
        error: "Le commentaire ne peut pas être vide" 
      }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ 
        error: "Le commentaire ne peut pas dépasser 1000 caractères" 
      }, { status: 400 });
    }

    // Vérifier si le projet existe
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        titre: true,
        auteurId: true
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    // Créer le commentaire
    const comment = await prisma.projectComment.create({
      data: {
        content: content.trim(),
        userId: payload.userId,
        projectId: projectId
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            type: true
          }
        }
      }
    });

    // Ajouter les champs calculés
    const commentWithStats = {
      ...comment,
      likesCount: 0,
      liked: false
    };

     // 🔔 NOTIFICATION TEMPS RÉEL
    if (project.auteurId !== payload.userId) {
      try {
        const { notifyProjectComment } = await import('@/lib/notifications');
        const { emitSocketNotification } = await import('@/lib/emit-socket-notification');
        
        const notification = await notifyProjectComment({
          projectId: projectId,
          commenterUserId: payload.userId,
          projectAuthorId: project.auteurId,
          projectTitle: project.titre
        });
            if (notification) {
          await emitSocketNotification(notification.id);
        }
      } catch (err) {
        console.error('Erreur notification commentaire:', err);
      }
    }
  

    return NextResponse.json({ 
      comment: commentWithStats,
      message: "Commentaire ajouté avec succès" 
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects/[id]/comments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}