// app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

// GET - Récupérer un projet spécifique
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
      role: string;
      type: string;
    };

    // CORRECTION: Attendre params avant de l'utiliser
    const resolvedParams = await params;
    
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "ID du projet manquant" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        auteur: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            email: true
          }
        },
        etablissement: {
          select: {
            id: true,
            nom: true,
            type: true,
            niveau: true,
            adresse: true
          }
        },
        dons: {
          include: {
            donateur: {
              select: {
                id: true,
                fullName: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            dons: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    // Calculer les statistiques
    const totalRaised = project.dons
      .filter(don => don.statut === 'RECEPTIONNE')
      .reduce((sum, don) => sum + 0, 0); // À adapter selon votre logique de calcul

    const uniqueDonors = new Set(project.dons.map(don => don.donateur.id)).size;

    const transformedProject = {
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
      auteur: project.auteur,
      etablissement: project.etablissement,
      dons: project.dons.map(don => ({
        id: don.id,
        libelle: don.libelle,
        type: don.type,
        quantite: don.quantite,
        statut: don.statut,
        dateEnvoi: don.dateEnvoi?.toISOString(),
        dateReception: don.dateReception?.toISOString(),
        createdAt: don.createdAt.toISOString(),
        donateur: don.donateur
      })),
      stats: {
        donCount: project._count.dons,
        totalRaised,
        uniqueDonors
      }
    };

    return NextResponse.json({ project: transformedProject });

  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT - Modifier un projet
export async function PUT(
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
      role: string;
      type: string;
    };

    // Vérifier que l'utilisateur est de type ETABLISSEMENT
    if (payload.type !== "ETABLISSEMENT") {
      return NextResponse.json({ 
        error: "Seuls les profils ÉTABLISSEMENT peuvent modifier des projets" 
      }, { status: 403 });
    }

    // CORRECTION: Attendre params avant de l'utiliser
    const resolvedParams = await params;

    // Schéma de validation pour la modification
    const updateProjectSchema = z.object({
      title: z.string().min(10, "Le titre doit contenir au moins 10 caractères").optional(),
      description: z.string().min(50, "La description doit contenir au moins 50 caractères").optional(),
      category: z.enum(["CONSTRUCTION", "REHABILITATION", "AUTRES"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      photos: z.array(z.string()).optional(),
    }).refine((data) => {
      // Validation des dates si les deux sont fournies
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return start < end;
      }
      return true;
    }, {
      message: "La date de fin doit être postérieure à la date de début",
      path: ["endDate"]
    });

    const body = await req.json();
    const validation = updateProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
        error: "Données invalides",
        details: validation.error.flatten()
      }, { status: 400 });
    }

    const data = validation.data;

    // Vérifier que le projet existe et appartient à l'utilisateur connecté
    const existingProject = await prisma.project.findFirst({
      where: {
        id: resolvedParams.id,
        auteurId: payload.userId // VÉRIFICATION : seul l'auteur peut modifier
      }
    });

    if (!existingProject) {
      return NextResponse.json({ 
        error: "Projet non trouvé ou vous n'avez pas les permissions pour le modifier" 
      }, { status: 403 }); // 403 Forbidden au lieu de 404
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (data.title) updateData.titre = data.title;
    if (data.description) updateData.description = data.description;
    if (data.category) updateData.categorie = data.category;
    if (data.startDate !== undefined) updateData.dateDebut = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updateData.dateFin = data.endDate ? new Date(data.endDate) : null;
    if (data.photos) updateData.photos = data.photos;

    // Mettre à jour le projet
    const updatedProject = await prisma.project.update({
      where: { id: resolvedParams.id },
      data: updateData,
      include: {
        auteur: {
          select: {
            fullName: true,
            avatar: true
          }
        },
        etablissement: {
          select: {
            nom: true,
            type: true,
            niveau: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Projet modifié avec succès",
      project: updatedProject 
    });

  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}