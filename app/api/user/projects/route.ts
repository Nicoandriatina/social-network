// app/api/user/projects/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    // Vérifier que l'utilisateur est de type ETABLISSEMENT
    if (payload.type !== "ETABLISSEMENT") {
      return NextResponse.json({ 
        error: "Seuls les profils ÉTABLISSEMENT peuvent avoir des projets" 
      }, { status: 403 });
    }

    // Récupérer l'utilisateur avec son établissement
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        etablissement: true
      }
    });

    if (!user || !user.etablissement) {
      return NextResponse.json({ 
        error: "Aucun établissement associé à votre profil" 
      }, { status: 400 });
    }

    // Récupérer les projets de l'établissement
    const projects = await prisma.project.findMany({
      where: {
        etablissementId: user.etablissement.id
      },
      include: {
        dons: {
          select: {
            id: true,
            type: true,
            statut: true,
            createdAt: true,
            donateur: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        },
        _count: {
          select: {
            dons: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculer les statistiques
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const allDonations = projects.flatMap(p => p.dons);
    const newDonationsThisMonth = allDonations.filter(don => 
      new Date(don.createdAt) >= currentMonth
    );

    const uniqueDonors = new Set(allDonations.map(don => don.donateur.id));

    const stats = {
      totalProjects: projects.length,
      activeDonors: uniqueDonors.size,
      totalRaised: 0, // À implémenter selon votre logique de calcul
      newDonationsThisMonth: newDonationsThisMonth.length
    };

    // Transformer les projets pour le frontend
    const transformedProjects = projects.map(project => ({
      id: project.id,
      reference: project.reference,
      titre: project.titre,
      description: project.description,
      categorie: project.categorie,
      photos: project.photos,
      datePublication: project.datePublication?.toISOString() || project.createdAt.toISOString(),
      dateDebut: project.dateDebut?.toISOString(),
      dateFin: project.dateFin?.toISOString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      donCount: project._count.dons,
      totalRaised: 0, // À implémenter selon votre logique
      recentDonors: project.dons
        .slice(0, 3)
        .map(don => don.donateur.fullName)
    }));

    return NextResponse.json({ 
      projects: transformedProjects,
      stats
    });

  } catch (error) {
    console.error("GET /api/user/projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE - Supprimer un projet
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ error: "ID du projet requis" }, { status: 400 });
    }

    // Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        auteurId: payload.userId
      },
      include: {
        dons: true
      }
    });

    if (!project) {
      return NextResponse.json({ 
        error: "Projet non trouvé ou vous n'avez pas les permissions" 
      }, { status: 404 });
    }

    // Empêcher la suppression si le projet a des dons
    if (project.dons.length > 0) {
      return NextResponse.json({ 
        error: "Impossible de supprimer un projet qui a reçu des dons" 
      }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json({ message: "Projet supprimé avec succès" });

  } catch (error) {
    console.error("DELETE /api/user/projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}