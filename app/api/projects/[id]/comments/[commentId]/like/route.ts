// app/api/projects/[projectId]/comments/[commentId]/like/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// POST - Liker/Unliker un commentaire
export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string; commentId: string }> }
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
    const { commentId } = resolvedParams;

    // Vérifier si le commentaire existe
    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return NextResponse.json({ error: "Commentaire non trouvé" }, { status: 404 });
    }

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: payload.userId,
          commentId: commentId
        }
      }
    });

    if (existingLike) {
      // Unliker
      await prisma.commentLike.delete({
        where: { id: existingLike.id }
      });

      const likesCount = await prisma.commentLike.count({
        where: { commentId }
      });

      return NextResponse.json({ 
        liked: false, 
        likesCount,
        message: "Like retiré" 
      });
    } else {
      // Liker
      await prisma.commentLike.create({
        data: {
          userId: payload.userId,
          commentId: commentId
        }
      });

      const likesCount = await prisma.commentLike.count({
        where: { commentId }
      });

      return NextResponse.json({ 
        liked: true, 
        likesCount,
        message: "Commentaire liké" 
      });
    }
  } catch (error) {
    console.error("POST /api/projects/[projectId]/comments/[commentId]/like error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET - Vérifier si l'utilisateur a liké et obtenir le nombre de likes
export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string; commentId: string }> }
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
    const { commentId } = resolvedParams;

    const [liked, likesCount] = await Promise.all([
      prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId: payload.userId,
            commentId: commentId
          }
        }
      }),
      prisma.commentLike.count({
        where: { commentId }
      })
    ]);

    return NextResponse.json({ 
      liked: !!liked, 
      likesCount 
    });
  } catch (error) {
    console.error("GET /api/projects/[projectId]/comments/[commentId]/like error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}