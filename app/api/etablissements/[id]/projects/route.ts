// app/api/etablissements/[id]/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // CORRECTION: L'ID peut être soit l'ID de l'utilisateur, soit l'ID de l'établissement
    // On cherche d'abord si c'est un utilisateur
    let etablissementId = id;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: { 
        id: true,
        type: true,
        etablissementId: true 
      }
    });

    // Si c'est un utilisateur de type ETABLISSEMENT, utiliser son etablissementId
    if (user && user.type === "ETABLISSEMENT" && user.etablissementId) {
      etablissementId = user.etablissementId;
    }

    // Vérifier que l'établissement existe
    const etablissement = await prisma.etablissement.findUnique({
      where: { id: etablissementId },
      select: { id: true, nom: true }
    });

    if (!etablissement) {
      return NextResponse.json({ 
        error: "Établissement non trouvé",
        debug: {
          userId: id,
          etablissementId,
          userFound: !!user,
          userType: user?.type
        }
      }, { status: 404 });
    }

    // Récupérer les projets de l'établissement
    const projects = await prisma.project.findMany({
      where: { etablissementId: etablissement.id },
      select: {
        id: true,
        titre: true,
        description: true,
        reference: true,
        photos: true,
        categorie: true,
        datePublication: true,
        createdAt: true,
        auteur: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            dons: true
          }
        }
      },
      orderBy: { datePublication: "desc" },
    });

    // Transformer les données pour le frontend
    const transformedProjects = projects.map(project => ({
      id: project.id,
      titre: project.titre,
      description: project.description,
      reference: project.reference,
      photos: project.photos,
      categorie: project.categorie,
      datePublication: project.datePublication?.toISOString() || project.createdAt.toISOString(),
      auteur: project.auteur,
      donCount: project._count.dons
    }));

    return NextResponse.json({ projects: transformedProjects });
  } catch (e) {
    console.error("GET /api/etablissements/[id]/projects error", e);
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: e instanceof Error ? e.message : String(e)
    }, { status: 500 });
  }
}