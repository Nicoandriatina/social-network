import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { notifyProjectLike } from "@/lib/notifications";
import { emitSocketNotification } from "@/lib/emit-socket-notification";

export const runtime = "nodejs";

// POST - Liker/Unliker un projet
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

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId: payload.userId,
          projectId: projectId
        }
      }
    });

    if (existingLike) {
      // Unliker
      await prisma.projectLike.delete({
        where: { id: existingLike.id }
      });

      const likesCount = await prisma.projectLike.count({
        where: { projectId }
      });

      return NextResponse.json({ 
        liked: false, 
        likesCount,
        message: "Like retiré" 
      });
    } else {
      // Liker
      await prisma.projectLike.create({
        data: {
          userId: payload.userId,
          projectId: projectId
        }
      });

      const likesCount = await prisma.projectLike.count({
        where: { projectId }
      });

      // 🔔 NOTIFICATION (seulement si ce n'est pas l'auteur qui like)
      if (project.auteurId !== payload.userId) {
        try {
          const notification = await notifyProjectLike({
            projectId,
            likerUserId: payload.userId,
            projectAuthorId: project.auteurId,
            projectTitle: project.titre
          });
          
          if (notification) {
            await emitSocketNotification(notification.id);
          }
        } catch (notifError) {
          console.error('Erreur notification like:', notifError);
        }
      }

      return NextResponse.json({ 
        liked: true, 
        likesCount,
        message: "Projet liké" 
      });
    }
  } catch (error) {
    console.error("POST /api/projects/[id]/like error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET - Vérifier si l'utilisateur a liké
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

    const [liked, likesCount] = await Promise.all([
      prisma.projectLike.findUnique({
        where: {
          userId_projectId: {
            userId: payload.userId,
            projectId: projectId
          }
        }
      }),
      prisma.projectLike.count({
        where: { projectId }
      })
    ]);

    return NextResponse.json({ 
      liked: !!liked, 
      likesCount 
    });
  } catch (error) {
    console.error("GET /api/projects/[id]/like error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}