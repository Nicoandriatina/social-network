// app/api/etablissements/[id]/shared-projects/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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
      type: string;
    };

    const { id } = await params;

    console.log('📥 Récupération projets partagés par établissement ID:', id);

    // Vérifier que l'utilisateur cible existe
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        fullName: true
      }
    });

    if (!targetUser) {
      return NextResponse.json({ 
        error: "Utilisateur non trouvé" 
      }, { status: 404 });
    }

    // Récupérer les projets partagés par cet utilisateur
    const shares = await prisma.projectShare.findMany({
      where: {
        userId: id
      },
      include: {
        project: {
          include: {
            auteur: {
              select: {
                fullName: true,
                avatar: true
              }
            },
            etablissement: {
              select: {
                nom: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('🔗 Projets partagés trouvés:', shares.length);

    // Transformer les données pour le frontend
    const projects = shares.map(share => ({
      id: share.project.id,
      titre: share.project.titre,
      description: share.project.description,
      categorie: share.project.categorie,
      photos: share.project.photos,
      etablissement: share.project.etablissement ? {
        nom: share.project.etablissement.nom
      } : null,
      auteur: {
        fullName: share.project.auteur.fullName,
        avatar: share.project.auteur.avatar
      },
      likesCount: share.project.likesCount,
      commentsCount: share.project.commentsCount,
      sharesCount: share.project.sharesCount,
      sharedAt: share.createdAt.toISOString()
    }));

    return NextResponse.json({ 
      projects
    });

  } catch (error) {
    console.error("GET /api/etablissements/[id]/shared-projects error:", error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}