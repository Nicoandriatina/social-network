//app/api/projects/[id]/share/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// POST - Partager un projet
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
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    // Enregistrer le partage
    await prisma.projectShare.create({
      data: {
        userId: payload.userId,
        projectId: projectId
      }
    });

    // Compter les partages
    const sharesCount = await prisma.projectShare.count({
      where: { projectId }
    });

    // Créer une notification pour l'auteur du projet
    if (project.auteurId !== payload.userId) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { fullName: true }
      });

      await prisma.notification.create({
        data: {
          userId: project.auteurId,
          type: "PROJECT_COMMENT", // ou créer PROJECT_SHARED
          title: "Votre projet a été partagé",
          content: `${user?.fullName} a partagé votre projet "${project.titre}"`,
          relatedUserId: payload.userId,
          projectId: projectId
        }
      });
    }

    return NextResponse.json({ 
      sharesCount,
      message: "Projet partagé avec succès" 
    });
  } catch (error) {
    console.error("POST /api/projects/[id]/share error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET - Obtenir le nombre de partages
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

    jwt.verify(token, process.env.JWT_SECRET!);

    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    const sharesCount = await prisma.projectShare.count({
      where: { projectId }
    });

    return NextResponse.json({ sharesCount });
  } catch (error) {
    console.error("GET /api/projects/[id]/share error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}