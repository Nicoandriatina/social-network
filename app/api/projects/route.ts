// // app/api/projects/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";
// import { z } from "zod";

// export const runtime = "nodejs";

// const needSchema = z.object({
//   type: z.enum(["MONETAIRE", "MATERIEL", "VIVRES"]),
//   titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
//   description: z.string().optional(),
//   montantCible: z.number().positive().optional().nullable().transform(val => val ?? undefined),
//   quantiteCible: z.number().int().positive().optional().nullable().transform(val => val ?? undefined),
//   unite: z.string().optional().nullable().transform(val => val ?? undefined),
//   priorite: z.number().int().min(1).max(3).default(2)
// }).refine((data) => {
//   // Validation: montantCible requis pour MONETAIRE
//   if (data.type === "MONETAIRE" && !data.montantCible) {
//     return false;
//   }
//   // Validation: quantiteCible requis pour MATERIEL et VIVRES
//   if ((data.type === "MATERIEL" || data.type === "VIVRES") && !data.quantiteCible) {
//     return false;
//   }
//   return true;
// }, {
//   message: "Les objectifs sont requis selon le type de besoin"
// });

// const createProjectSchema = z.object({
//   reference: z.string().min(1, "La référence est obligatoire"),
//   category: z.enum(["CONSTRUCTION", "REHABILITATION", "AUTRES"], {
//     required_error: "La catégorie est obligatoire"
//   }),
//   title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
//   description: z.string().min(50, "La description doit contenir au moins 50 caractères"),
//   startDate: z.string().optional(),
//   endDate: z.string().optional(),
//   budgetEstime: z.number().positive().optional(),
//   photos: z.array(z.string()).min(1, "Au moins une photo est requise"),
//   needs: z.array(needSchema).min(1, "Au moins un besoin est requis")
// }).refine((data) => {
//   if (data.startDate && data.endDate) {
//     const start = new Date(data.startDate);
//     const end = new Date(data.endDate);
//     return start < end;
//   }
//   return true;
// }, {
//   message: "La date de fin doit être postérieure à la date de début",
//   path: ["endDate"]
// });

// // GET - Récupérer les projets avec besoins
// export async function GET() {
//   try {
//     console.log('📥 GET /api/projects - Début');
    
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
    
//     if (!token) {
//       console.log('❌ Pas de token');
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
//       userId: string;
//       role: string;
//       type: string;
//     };

//     console.log('✅ Token validé pour utilisateur:', payload.userId);

//     const projects = await prisma.project.findMany({
//       include: {
//         auteur: {
//           select: {
//             id: true,
//             fullName: true,
//             avatar: true,
//             etablissement: {
//               select: {
//                 nom: true,
//                 type: true,
//                 niveau: true
//               }
//             }
//           }
//         },
//         etablissement: {
//           select: {
//             id: true,
//             nom: true,
//             type: true,
//             niveau: true,
//             adresse: true,
//             admin: {
//               select: {
//                 id: true,
//                 avatar: true,
//                 fullName: true
//               }
//             }
//           }
//         },
//         besoins: {
//           select: {
//             id: true,
//             type: true,
//             titre: true,
//             description: true,
//             montantCible: true,
//             quantiteCible: true,
//             unite: true,
//             montantRecu: true,
//             quantiteRecue: true,
//             pourcentage: true,
//             statut: true,
//             priorite: true
//           },
//           orderBy: {
//             priorite: 'asc'
//           }
//         },
//         dons: {
//           select: {
//             id: true,
//             type: true,
//             statut: true,
//             montant: true
//           }
//         },
//         likes: {
//           where: {
//             userId: payload.userId
//           },
//           select: {
//             id: true
//           }
//         },
//         _count: {
//           select: {
//             dons: true,
//             likes: true,
//             comments: true,
//             shares: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     console.log(`✅ ${projects.length} projets récupérés`);

//     const transformedProjects = projects.map(project => {
//       const etablissementAvatar = 
//         project.auteur?.avatar ||
//         (project.etablissement.admin.length > 0 ? project.etablissement.admin[0].avatar : null) ||
//         null;

//       return {
//         id: project.id,
//         reference: project.reference,
//         titre: project.titre,
//         description: project.description,
//         photos: project.photos,
//         categorie: project.categorie,
//         datePublication: project.datePublication,
//         dateDebut: project.dateDebut,
//         dateFin: project.dateFin,
//         budgetEstime: project.budgetEstime,
//         createdAt: project.createdAt,
//         updatedAt: project.updatedAt,
//         auteurId: project.auteurId,
//         etablissementId: project.etablissementId,
        
//         auteur: project.auteur,
        
//         etablissement: {
//           id: project.etablissement.id,
//           nom: project.etablissement.nom,
//           type: project.etablissement.type,
//           niveau: project.etablissement.niveau,
//           adresse: project.etablissement.adresse,
//           avatar: etablissementAvatar
//         },
        
//         besoins: project.besoins,
        
//         stats: {
//           likes: project._count.likes,
//           comments: project._count.comments,
//           shares: project._count.shares,
//           donations: project._count.dons
//         },
        
//         liked: project.likes.length > 0,
        
//         dons: project.dons
//       };
//     });

//     return NextResponse.json({ projects: transformedProjects });
//   } catch (error) {
//     console.error("❌ GET /api/projects error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // POST - Créer un nouveau projet avec besoins
// export async function POST(req: Request) {
//   try {
//     console.log('📥 POST /api/projects - Début');
    
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
    
//     if (!token) {
//       console.log('❌ Pas de token');
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
//       userId: string;
//       role: string;
//       type: string;
//     };

//     console.log('✅ Token validé:', {
//       userId: payload.userId,
//       type: payload.type,
//       role: payload.role
//     });

//     if (payload.type !== "ETABLISSEMENT") {
//       console.log('❌ Type utilisateur incorrect:', payload.type);
//       return NextResponse.json({ 
//         error: "Seuls les profils ÉTABLISSEMENT peuvent publier des projets" 
//       }, { status: 403 });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: payload.userId },
//       include: {
//         etablissement: true
//       }
//     });

//     console.log('👤 Utilisateur trouvé:', {
//       id: user?.id,
//       hasEtablissement: !!user?.etablissement,
//       etablissementId: user?.etablissement?.id
//     });

//     if (!user || !user.etablissement) {
//       console.log('❌ Pas d\'établissement associé');
//       return NextResponse.json({ 
//         error: "Aucun établissement associé à votre profil" 
//       }, { status: 400 });
//     }

//     const body = await req.json();
    
//     console.log('📥 Données reçues:', JSON.stringify(body, null, 2));
//     console.log('📊 Analyse des données:');
//     console.log('  - Photos:', body.photos?.length || 0);
//     console.log('  - Needs:', body.needs?.length || 0);
//     if (body.needs) {
//       body.needs.forEach((need, index) => {
//         console.log(`  - Need ${index + 1}:`, {
//           type: need.type,
//           titre: need.titre,
//           montantCible: need.montantCible,
//           quantiteCible: need.quantiteCible
//         });
//       });
//     }
    
//     const validation = createProjectSchema.safeParse(body);
    
//     if (!validation.success) {
//       console.error('❌ Validation échouée:', validation.error.flatten());
//       console.error('📋 Erreurs détaillées:', JSON.stringify(validation.error.format(), null, 2));
      
//       return NextResponse.json({ 
//         error: "Données invalides",
//         details: validation.error.flatten(),
//         received: body
//       }, { status: 400 });
//     }

//     console.log('✅ Validation réussie');

//     const data = validation.data;

//     const existingProject = await prisma.project.findUnique({
//       where: { reference: data.reference }
//     });

//     if (existingProject) {
//       console.log('❌ Référence déjà existante:', data.reference);
//       return NextResponse.json({ 
//         error: "Cette référence existe déjà" 
//       }, { status: 400 });
//     }

//     console.log('🔄 Création du projet en cours...');

//     // Créer le projet avec les besoins
//     const project = await prisma.project.create({
//       data: {
//         reference: data.reference,
//         titre: data.title,
//         description: data.description,
//         photos: data.photos,
//         categorie: data.category as any,
//         datePublication: new Date(),
//         dateDebut: data.startDate ? new Date(data.startDate) : null,
//         dateFin: data.endDate ? new Date(data.endDate) : null,
//         budgetEstime: data.budgetEstime,
//         auteurId: user.id,
//         etablissementId: user.etablissement.id,
//         besoins: {
//           create: data.needs.map(need => ({
//             type: need.type,
//             titre: need.titre,
//             description: need.description || '',
//             montantCible: need.montantCible,
//             quantiteCible: need.quantiteCible,
//             unite: need.unite,
//             priorite: need.priorite,
//             statut: 'EN_COURS'
//           }))
//         }
//       },
//       include: {
//         auteur: {
//           select: {
//             id: true,
//             fullName: true,
//             avatar: true
//           }
//         },
//         etablissement: {
//           select: {
//             id: true,
//             nom: true,
//             type: true,
//             niveau: true,
//             adresse: true,
//             admin: {
//               select: {
//                 avatar: true
//               }
//             }
//           }
//         },
//         besoins: true
//       }
//     });

//     console.log('✅ Projet créé avec succès:', {
//       id: project.id,
//       reference: project.reference,
//       besoinsCount: project.besoins.length
//     });

//     const transformedProject = {
//       ...project,
//       etablissement: {
//         ...project.etablissement,
//         avatar: project.etablissement.admin[0]?.avatar || null,
//         admin: undefined
//       }
//     };

//     return NextResponse.json({ 
//       message: "Projet créé avec succès",
//       project: transformedProject 
//     }, { status: 201 });

//   } catch (error) {
//     console.error("❌ POST /api/projects error:", error);
//     console.error("Stack trace:", error.stack);
//     return NextResponse.json({ 
//       error: "Server error",
//       details: error.message 
//     }, { status: 500 });
//   }
// }
// app/api/projects/route.ts - VERSION AMÉLIORÉE
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createMainMonetaryNeed } from "@/lib/updateProjectNeeds";

export const runtime = "nodejs";

const needSchema = z.object({
  type: z.enum(["MONETAIRE", "MATERIEL", "VIVRES"]),
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  montantCible: z.number().positive().optional().nullable().transform(val => val ?? undefined),
  quantiteCible: z.number().int().positive().optional().nullable().transform(val => val ?? undefined),
  unite: z.string().optional().nullable().transform(val => val ?? undefined),
  priorite: z.number().int().min(1).max(3).default(2)
}).refine((data) => {
  if (data.type === "MONETAIRE" && !data.montantCible) {
    return false;
  }
  if ((data.type === "MATERIEL" || data.type === "VIVRES") && !data.quantiteCible) {
    return false;
  }
  return true;
}, {
  message: "Les objectifs sont requis selon le type de besoin"
});

const createProjectSchema = z.object({
  reference: z.string().min(1, "La référence est obligatoire"),
  category: z.enum(["CONSTRUCTION", "REHABILITATION", "AUTRES"], {
    required_error: "La catégorie est obligatoire"
  }),
  title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
  description: z.string().min(50, "La description doit contenir au moins 50 caractères"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // ✅ NOUVEAUX CHAMPS
  coutTotalProjet: z.number().positive("Le coût total doit être positif"),
  budgetDisponible: z.number().nonnegative("Le budget disponible doit être positif ou zéro"),
  photos: z.array(z.string()).min(1, "Au moins une photo est requise"),
  needs: z.array(needSchema).min(1, "Au moins un besoin est requis")
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
  // ✅ NOUVELLE VALIDATION: Budget disponible <= Coût total
  return data.budgetDisponible <= data.coutTotalProjet;
}, {
  message: "Le budget disponible ne peut pas dépasser le coût total du projet",
  path: ["budgetDisponible"]
});

// GET - Récupérer les projets (inchangé)
export async function GET() {
  try {
    console.log('🔥 GET /api/projects - Début');
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      console.log('❌ Pas de token');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    const projects = await prisma.project.findMany({
      include: {
        auteur: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            etablissement: {
              select: {
                nom: true,
                type: true,
                niveau: true
              }
            }
          }
        },
        etablissement: {
          select: {
            id: true,
            nom: true,
            type: true,
            niveau: true,
            adresse: true,
            admin: {
              select: {
                id: true,
                avatar: true,
                fullName: true
              }
            }
          }
        },
        besoins: {
          select: {
            id: true,
            type: true,
            titre: true,
            description: true,
            montantCible: true,
            quantiteCible: true,
            unite: true,
            montantRecu: true,
            quantiteRecue: true,
            pourcentage: true,
            statut: true,
            priorite: true,
            budgetInclusDansCalcul: true // ✅ NOUVEAU
          },
          orderBy: {
            priorite: 'asc'
          }
        },
        dons: {
          select: {
            id: true,
            type: true,
            statut: true,
            montant: true
          }
        },
        likes: {
          where: {
            userId: payload.userId
          },
          select: {
            id: true
          }
        },
        _count: {
          select: {
            dons: true,
            likes: true,
            comments: true,
            shares: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const transformedProjects = projects.map(project => {
      const etablissementAvatar = 
        project.auteur?.avatar ||
        (project.etablissement.admin.length > 0 ? project.etablissement.admin[0].avatar : null) ||
        null;

      return {
        id: project.id,
        reference: project.reference,
        titre: project.titre,
        description: project.description,
        photos: project.photos,
        categorie: project.categorie,
        datePublication: project.datePublication,
        dateDebut: project.dateDebut,
        dateFin: project.dateFin,
        budgetDisponible: project.budgetDisponible, // ✅ NOUVEAU
        progressionGlobale: project.progressionGlobale, // ✅ NOUVEAU
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        auteurId: project.auteurId,
        etablissementId: project.etablissementId,
        
        auteur: project.auteur,
        
        etablissement: {
          id: project.etablissement.id,
          nom: project.etablissement.nom,
          type: project.etablissement.type,
          niveau: project.etablissement.niveau,
          adresse: project.etablissement.adresse,
          avatar: etablissementAvatar
        },
        
        besoins: project.besoins,
        
        stats: {
          likes: project._count.likes,
          comments: project._count.comments,
          shares: project._count.shares,
          donations: project._count.dons
        },
        
        liked: project.likes.length > 0,
        
        dons: project.dons
      };
    });

    return NextResponse.json({ projects: transformedProjects });
  } catch (error) {
    console.error("❌ GET /api/projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Créer un nouveau projet
export async function POST(req: Request) {
  try {
    console.log('🔥 POST /api/projects - Début');
    
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
        error: "Seuls les profils ÉTABLISSEMENT peuvent publier des projets" 
      }, { status: 403 });
    }

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

    const body = await req.json();
    const validation = createProjectSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('❌ Validation échouée:', validation.error.flatten());
      return NextResponse.json({ 
        error: "Données invalides",
        details: validation.error.flatten()
      }, { status: 400 });
    }

    const data = validation.data;

    const existingProject = await prisma.project.findUnique({
      where: { reference: data.reference }
    });

    if (existingProject) {
      return NextResponse.json({ 
        error: "Cette référence existe déjà" 
      }, { status: 400 });
    }

    console.log('📄 Création du projet avec budget...');
    console.log(`💰 Coût total: ${data.coutTotalProjet} Ar`);
    console.log(`💵 Budget disponible: ${data.budgetDisponible} Ar`);
    console.log(`📊 À collecter: ${data.coutTotalProjet - data.budgetDisponible} Ar`);

    // ✅ Créer le projet avec le nouveau système de budget
    const project = await prisma.project.create({
      data: {
        reference: data.reference,
        titre: data.title,
        description: data.description,
        photos: data.photos,
        categorie: data.category as any,
        datePublication: new Date(),
        dateDebut: data.startDate ? new Date(data.startDate) : null,
        dateFin: data.endDate ? new Date(data.endDate) : null,
        budgetDisponible: data.budgetDisponible, // ✅ NOUVEAU
        progressionGlobale: 0, // ✅ NOUVEAU - sera calculé automatiquement
        auteurId: user.id,
        etablissementId: user.etablissement.id,
        besoins: {
          create: data.needs.map((need, index) => ({
            type: need.type,
            titre: need.titre,
            description: need.description || '',
            montantCible: need.montantCible,
            quantiteCible: need.quantiteCible,
            unite: need.unite,
            priorite: need.priorite,
            statut: 'EN_COURS',
            // ✅ NOUVEAU: Marquer le premier besoin MONETAIRE comme principal
            budgetInclusDansCalcul: need.type === 'MONETAIRE' && index === 0
          }))
        }
      },
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
            niveau: true,
            adresse: true,
            admin: {
              select: {
                avatar: true
              }
            }
          }
        },
        besoins: true
      }
    });

    // ✅ NOUVEAU: Mettre à jour immédiatement la progression (pour prendre en compte le budget initial)
    const { updateProjectNeeds } = await import("@/lib/updateProjectNeeds");
    await updateProjectNeeds(project.id);

    console.log(`✅ Projet créé avec succès:`, {
      id: project.id,
      reference: project.reference,
      budgetDisponible: project.budgetDisponible,
      besoinsCount: project.besoins.length
    });

    const transformedProject = {
      ...project,
      etablissement: {
        ...project.etablissement,
        avatar: project.etablissement.admin[0]?.avatar || null,
        admin: undefined
      }
    };

    return NextResponse.json({ 
      message: "Projet créé avec succès",
      project: transformedProject 
    }, { status: 201 });

  } catch (error) {
    console.error("❌ POST /api/projects error:", error);
    return NextResponse.json({ 
      error: "Server error",
      details: error.message 
    }, { status: 500 });
  }
}