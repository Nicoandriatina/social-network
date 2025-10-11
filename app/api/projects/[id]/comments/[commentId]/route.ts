// app/api/projects/[projectId]/comments/[commentId]/route.ts
// ==========================================

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// PUT - Modifier un commentaire
export async function PUT(
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

    // Vérifier que le commentaire appartient à l'utilisateur
    const existingComment = await prisma.projectComment.findFirst({
      where: {
        id: commentId,
        userId: payload.userId
      }
    });

    if (!existingComment) {
      return NextResponse.json({ 
        error: "Commentaire non trouvé ou vous n'avez pas les permissions" 
      }, { status: 403 });
    }

    // Mettre à jour le commentaire
    const updatedComment = await prisma.projectComment.update({
      where: { id: commentId },
      data: {
        content: content.trim()
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

    return NextResponse.json({ 
      comment: updatedComment,
      message: "Commentaire modifié avec succès" 
    });
  } catch (error) {
    console.error("PUT /api/projects/[projectId]/comments/[commentId] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE - Supprimer un commentaire
export async function DELETE(
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
      role: string;
    };

    const resolvedParams = await params;
    const { commentId, projectId } = resolvedParams;

    // Vérifier que le commentaire existe
    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
      include: {
        project: {
          select: {
            auteurId: true
          }
        }
      }
    });

    if (!comment) {
      return NextResponse.json({ 
        error: "Commentaire non trouvé" 
      }, { status: 404 });
    }

    // Vérifier les permissions : propriétaire du commentaire, auteur du projet, ou admin
    const isOwner = comment.userId === payload.userId;
    const isProjectAuthor = comment.project.auteurId === payload.userId;
    const isAdmin = payload.role === "ADMIN" || payload.role === "SUPERADMIN";

    if (!isOwner && !isProjectAuthor && !isAdmin) {
      return NextResponse.json({ 
        error: "Vous n'avez pas les permissions pour supprimer ce commentaire" 
      }, { status: 403 });
    }

    // Supprimer le commentaire
    await prisma.projectComment.delete({
      where: { id: commentId }
    });

    return NextResponse.json({ 
      message: "Commentaire supprimé avec succès" 
    });
  } catch (error) {
    console.error("DELETE /api/projects/[projectId]/comments/[commentId] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}