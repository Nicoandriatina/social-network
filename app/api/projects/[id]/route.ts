// app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { updateProjectNeeds } from "@/lib/updateProjectNeeds";

export const runtime = "nodejs";

// ✅ GET - Récupérer un projet spécifique (inchangé)
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
        besoins: {
          include: {
            _count: {
              select: {
                dons: true
              }
            }
          },
          orderBy: {
            priorite: 'asc'
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
            },
            need: {
              select: {
                id: true,
                titre: true,
                type: true
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

    const totalRaised = project.dons
      .filter(don => don.statut === 'RECEPTIONNE' && don.montant)
      .reduce((sum, don) => sum + (don.montant || 0), 0);

    const uniqueDonors = new Set(project.dons.map(don => don.donateur.id)).size;

    const transformedProject = {
      id: project.id,
      reference: project.reference,
      titre: project.titre,
      description: project.description,
      categorie: project.categorie,
      photos: project.photos,
      budgetDisponible: project.budgetDisponible,
      datePublication: project.datePublication?.toISOString() || project.createdAt.toISOString(),
      dateDebut: project.dateDebut?.toISOString(),
      dateFin: project.dateFin?.toISOString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      auteur: project.auteur,
      etablissement: project.etablissement,
      besoins: project.besoins.map(need => ({
        id: need.id,
        type: need.type,
        titre: need.titre,
        description: need.description,
        montantCible: need.montantCible,
        quantiteCible: need.quantiteCible,
        unite: need.unite,
        montantRecu: need.montantRecu,
        quantiteRecue: need.quantiteRecue,
        pourcentage: need.pourcentage,
        statut: need.statut,
        priorite: need.priorite,
        budgetInclusDansCalcul: need.budgetInclusDansCalcul,
        donCount: need._count.dons,
        createdAt: need.createdAt.toISOString()
      })),
      dons: project.dons.map(don => ({
        id: don.id,
        libelle: don.libelle,
        type: don.type,
        quantite: don.quantite,
        montant: don.montant,
        statut: don.statut,
        dateEnvoi: don.dateEnvoi?.toISOString(),
        dateReception: don.dateReception?.toISOString(),
        createdAt: don.createdAt.toISOString(),
        donateur: don.donateur,
        need: don.need
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

// ✅ PUT - Modifier un projet avec gestion du budget
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

    if (payload.type !== "ETABLISSEMENT") {
      return NextResponse.json({ 
        error: "Seuls les profils ÉTABLISSEMENT peuvent modifier des projets" 
      }, { status: 403 });
    }

    const resolvedParams = await params;

    // ✅ Schéma de validation
    const needSchema = z.object({
      id: z.string().optional(),
      type: z.enum(["MONETAIRE", "MATERIEL", "VIVRES"]),
      titre: z.string().min(3),
      description: z.string().optional(),
      montantCible: z.number().positive().optional().nullable(),
      quantiteCible: z.number().int().positive().optional().nullable(),
      unite: z.string().optional().nullable(),
      priorite: z.number().int().min(1).max(3).default(2)
    });

    const updateProjectSchema = z.object({
      title: z.string().min(10, "Le titre doit contenir au moins 10 caractères").optional(),
      description: z.string().min(50, "La description doit contenir au moins 50 caractères").optional(),
      category: z.enum(["CONSTRUCTION", "REHABILITATION", "AUTRES"]).optional(),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional(),
      coutTotalProjet: z.number().positive().optional(),
      budgetDisponible: z.number().nonnegative().optional(),
      photos: z.array(z.string()).optional(),
      needs: z.array(needSchema).optional()
    }).refine((data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return start < end;
      }
      return true;
    }, {
      message: "La date de fin doit être postérieure à la date de début",
      path: ["endDate"]
    }).refine((data) => {
      if (data.coutTotalProjet && data.budgetDisponible) {
        return data.budgetDisponible <= data.coutTotalProjet;
      }
      return true;
    }, {
      message: "Le budget disponible ne peut pas dépasser le coût total",
      path: ["budgetDisponible"]
    });

    const body = await req.json();
    console.log('📥 Données reçues pour la mise à jour:', JSON.stringify(body, null, 2));

    const validation = updateProjectSchema.safeParse(body);

    if (!validation.success) {
      console.error('❌ Validation échouée:', validation.error.flatten());
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
        auteurId: payload.userId
      },
      include: {
        besoins: true
      }
    });

    if (!existingProject) {
      return NextResponse.json({ 
        error: "Projet non trouvé ou vous n'avez pas les permissions pour le modifier" 
      }, { status: 403 });
    }

    // ✅ Préparer les données de mise à jour du projet
    const updateData: any = {};
    if (data.title) updateData.titre = data.title;
    if (data.description) updateData.description = data.description;
    if (data.category) updateData.categorie = data.category;
    if (data.startDate !== undefined) updateData.dateDebut = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updateData.dateFin = data.endDate ? new Date(data.endDate) : null;
    if (data.photos) updateData.photos = data.photos;
    if (data.budgetDisponible !== undefined) updateData.budgetDisponible = data.budgetDisponible;

    console.log('📝 Données de mise à jour du projet préparées:', updateData);

    // ✅ CORRECTION: Utilisation de prisma.projectNeed au lieu de prisma.need
    
    // 1. Gestion du besoin monétaire principal
    if (data.coutTotalProjet !== undefined && data.budgetDisponible !== undefined) {
      const montantACollecter = data.coutTotalProjet - data.budgetDisponible;
      
      console.log('💰 Calcul du budget:');
      console.log('  - Coût total:', data.coutTotalProjet);
      console.log('  - Budget disponible:', data.budgetDisponible);
      console.log('  - À collecter:', montantACollecter);

      // Trouver le besoin principal existant
      const mainNeed = existingProject.besoins.find(n => n.budgetInclusDansCalcul);

      if (mainNeed) {
        // ✅ CORRIGÉ: prisma.projectNeed au lieu de prisma.need
        await prisma.projectNeed.update({
          where: { id: mainNeed.id },
          data: {
            montantCible: data.coutTotalProjet,
            titre: `Financement du projet - ${data.title || existingProject.titre}`,
            description: `Budget nécessaire pour réaliser ce projet. L'établissement dispose déjà de ${data.budgetDisponible.toLocaleString()} Ar.`
          }
        });
        console.log('✅ Besoin principal mis à jour:', mainNeed.id);
      } else {
        // ✅ CORRIGÉ: prisma.projectNeed au lieu de prisma.need
        await prisma.projectNeed.create({
          data: {
            projectId: resolvedParams.id,
            type: 'MONETAIRE',
            titre: `Financement du projet - ${data.title || existingProject.titre}`,
            description: `Budget nécessaire pour réaliser ce projet. L'établissement dispose déjà de ${data.budgetDisponible.toLocaleString()} Ar.`,
            montantCible: data.coutTotalProjet,
            priorite: 1,
            statut: 'EN_COURS',
            budgetInclusDansCalcul: true
          }
        });
        console.log('✅ Besoin principal créé');
      }
    }

    // 2. Gestion des besoins additionnels
    if (data.needs !== undefined) {
      // Supprimer les anciens besoins additionnels (pas le principal)
      // ✅ CORRIGÉ: prisma.projectNeed au lieu de prisma.need
      await prisma.projectNeed.deleteMany({
        where: {
          projectId: resolvedParams.id,
          budgetInclusDansCalcul: false
        }
      });
      console.log('🗑️ Anciens besoins additionnels supprimés');

      // Créer les nouveaux besoins additionnels
      if (data.needs.length > 0) {
        // ✅ CORRIGÉ: prisma.projectNeed au lieu de prisma.need
        await prisma.projectNeed.createMany({
          data: data.needs.map(need => ({
            projectId: resolvedParams.id,
            type: need.type,
            titre: need.titre,
            description: need.description || '',
            montantCible: need.montantCible,
            quantiteCible: need.quantiteCible,
            unite: need.unite,
            priorite: need.priorite,
            statut: 'EN_COURS',
            budgetInclusDansCalcul: false
          }))
        });
        console.log('✅ Besoins additionnels créés:', data.needs.length);
      }
    }

    // 3. Mettre à jour le projet
    const updatedProject = await prisma.project.update({
      where: { id: resolvedParams.id },
      data: updateData,
      include: {
        auteur: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        },
        etablissement: {
          select: {
            id: true,
            nom: true,
            type: true,
            niveau: true
          }
        },
        besoins: true
      }
    });

    console.log('✅ Projet mis à jour avec succès:', updatedProject.id);

    // 4. ✅ Recalculer la progression du projet
    try {
      await updateProjectNeeds(resolvedParams.id);
      console.log('✅ Progression du projet recalculée');
    } catch (updateError) {
      console.error('⚠️ Erreur lors du recalcul de la progression:', updateError);
      // On continue même si le recalcul échoue
    }

    return NextResponse.json({ 
      message: "Projet modifié avec succès",
      project: updatedProject 
    });

  } catch (error) {
    console.error("❌ PUT /api/projects/[id] error:", error);
    return NextResponse.json({ 
      error: "Server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}