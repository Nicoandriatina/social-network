
// // // app/api/projects/route.ts
// // import { NextResponse } from "next/server";
// // import { cookies } from "next/headers";
// // import jwt from "jsonwebtoken";
// // import { prisma } from "@/lib/prisma";
// // import { z } from "zod";

// // export const runtime = "nodejs";

// // const createProjectSchema = z.object({
// //   reference: z.string().min(1, "La référence est obligatoire"),
// //   category: z.enum(["CONSTRUCTION", "REHABILITATION", "AUTRES"], {
// //     required_error: "La catégorie est obligatoire"
// //   }),
// //   title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
// //   description: z.string().min(50, "La description doit contenir au moins 50 caractères"),
// //   startDate: z.string().optional(),
// //   endDate: z.string().optional(),
// //   budget: z.string().optional(),
// //   photos: z.array(z.string()).min(1, "Au moins une photo est requise"),
// // }).refine((data) => {
// //   if (data.startDate && data.endDate) {
// //     const start = new Date(data.startDate);
// //     const end = new Date(data.endDate);
// //     return start < end;
// //   }
// //   return true;
// // }, {
// //   message: "La date de fin doit être postérieure à la date de début",
// //   path: ["endDate"]
// // });

// // // GET - Récupérer les projets
// // export async function GET() {
// //   try {
// //     const cookieStore = await cookies();
// //     const token = cookieStore.get("token")?.value;
    
// //     if (!token) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }

// //     const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
// //       userId: string;
// //       role: string;
// //       type: string;
// //     };

// //     // Récupérer les projets avec leurs relations + AVATAR de l'établissement
// //     const projects = await prisma.project.findMany({
// //       include: {
// //         auteur: {
// //           select: {
// //             id: true,
// //             fullName: true,
// //             avatar: true, // ✅ Avatar de l'auteur
// //             etablissement: {
// //               select: {
// //                 nom: true,
// //                 type: true,
// //                 niveau: true
// //               }
// //             }
// //           }
// //         },
// //         etablissement: {
// //           select: {
// //             nom: true,
// //             type: true,
// //             niveau: true,
// //             adresse: true,
// //             // ✅ AJOUTER L'AVATAR DE L'ÉTABLISSEMENT
// //             admin: {
// //               select: {
// //                 avatar: true
// //               },
// //               take: 1
// //             }
// //           }
// //         },
// //         dons: {
// //           select: {
// //             id: true,
// //             type: true,
// //             statut: true
// //           }
// //         },
// //         _count: {
// //           select: {
// //             dons: true
// //           }
// //         }
// //       },
// //       orderBy: {
// //         createdAt: 'desc'
// //       }
// //     });

// //     // Transformer pour ajouter l'avatar de l'établissement
// //     const transformedProjects = projects.map(project => ({
// //       ...project,
// //       etablissement: {
// //         ...project.etablissement,
// //         // Utiliser l'avatar de l'admin de l'établissement
// //         avatar: project.etablissement.admin[0]?.avatar || null,
// //         admin: undefined // Retirer admin de la réponse
// //       }
// //     }));

// //     return NextResponse.json({ projects: transformedProjects });
// //   } catch (error) {
// //     console.error("GET /api/projects error:", error);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }

// // // POST - Créer un nouveau projet
// // export async function POST(req: Request) {
// //   try {
// //     const cookieStore = await cookies();
// //     const token = cookieStore.get("token")?.value;
    
// //     if (!token) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }

// //     const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
// //       userId: string;
// //       role: string;
// //       type: string;
// //     };

// //     if (payload.type !== "ETABLISSEMENT") {
// //       return NextResponse.json({ 
// //         error: "Seuls les profils ÉTABLISSEMENT peuvent publier des projets" 
// //       }, { status: 403 });
// //     }

// //     const user = await prisma.user.findUnique({
// //       where: { id: payload.userId },
// //       include: {
// //         etablissement: true
// //       }
// //     });

// //     if (!user || !user.etablissement) {
// //       return NextResponse.json({ 
// //         error: "Aucun établissement associé à votre profil" 
// //       }, { status: 400 });
// //     }

// //     const body = await req.json();
    
// //     const validation = createProjectSchema.safeParse(body);
// //     if (!validation.success) {
// //       return NextResponse.json({ 
// //         error: "Données invalides",
// //         details: validation.error.flatten()
// //       }, { status: 400 });
// //     }

// //     const data = validation.data;

// //     const existingProject = await prisma.project.findUnique({
// //       where: { reference: data.reference }
// //     });

// //     if (existingProject) {
// //       return NextResponse.json({ 
// //         error: "Cette référence existe déjà" 
// //       }, { status: 400 });
// //     }

// //     const project = await prisma.project.create({
// //       data: {
// //         reference: data.reference,
// //         titre: data.title,
// //         description: data.description,
// //         photos: data.photos,
// //         categorie: data.category as any,
// //         datePublication: new Date(),
// //         dateDebut: data.startDate ? new Date(data.startDate) : null,
// //         dateFin: data.endDate ? new Date(data.endDate) : null,
// //         auteurId: user.id,
// //         etablissementId: user.etablissement.id
// //       },
// //       include: {
// //         auteur: {
// //           select: {
// //             fullName: true,
// //             avatar: true
// //           }
// //         },
// //         etablissement: {
// //           select: {
// //             nom: true,
// //             type: true,
// //             niveau: true
// //           }
// //         }
// //       }
// //     });

// //     return NextResponse.json({ 
// //       message: "Projet créé avec succès",
// //       project 
// //     }, { status: 201 });

// //   } catch (error) {
// //     console.error("POST /api/projects error:", error);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }
// // app/api/projects/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";
// import { z } from "zod";

// export const runtime = "nodejs";

// const createProjectSchema = z.object({
//   reference: z.string().min(1, "La référence est obligatoire"),
//   category: z.enum(["CONSTRUCTION", "REHABILITATION", "AUTRES"], {
//     required_error: "La catégorie est obligatoire"
//   }),
//   title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
//   description: z.string().min(50, "La description doit contenir au moins 50 caractères"),
//   startDate: z.string().optional(),
//   endDate: z.string().optional(),
//   budget: z.string().optional(),
//   photos: z.array(z.string()).min(1, "Au moins une photo est requise"),
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

// // GET - Récupérer les projets avec avatars
// export async function GET() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
    
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
//       userId: string;
//       role: string;
//       type: string;
//     };

//     // ✅ CORRECTION : Récupérer les projets avec l'avatar de l'admin de l'établissement
//     const projects = await prisma.project.findMany({
//       include: {
//         auteur: {
//           select: {
//             id: true,
//             fullName: true,
//             avatar: true, // ✅ Avatar de l'auteur
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
//             // ✅ CORRECTION : Utiliser la bonne relation
//             admin: {
//               select: {
//                 id: true,
//                 avatar: true,
//                 fullName: true
//               }
//             }
//           }
//         },
//         dons: {
//           select: {
//             id: true,
//             type: true,
//             statut: true
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

//     // ✅ Transformer pour ajouter l'avatar de manière cohérente
//     const transformedProjects = projects.map(project => {
//       // Récupérer le premier admin de l'établissement comme avatar principal
//       const etablissementAvatar = project.etablissement.admin.length > 0 
//         ? project.etablissement.admin[0].avatar 
//         : null;

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
//         createdAt: project.createdAt,
//         updatedAt: project.updatedAt,
//         auteurId: project.auteurId,
//         etablissementId: project.etablissementId,
        
//         // Données de l'auteur
//         auteur: project.auteur,
        
//         // Données de l'établissement avec avatar
//         etablissement: {
//           id: project.etablissement.id,
//           nom: project.etablissement.nom,
//           type: project.etablissement.type,
//           niveau: project.etablissement.niveau,
//           adresse: project.etablissement.adresse,
//           avatar: etablissementAvatar // ✅ Avatar ajouté ici
//         },
        
//         // Statistiques
//         stats: {
//           likes: project._count.likes,
//           comments: project._count.comments,
//           shares: project._count.shares,
//           donations: project._count.dons
//         },
        
//         // Est-ce que l'utilisateur actuel a liké ?
//         liked: project.likes.length > 0,
        
//         dons: project.dons
//       };
//     });

//     console.log('✅ Projets avec avatars:', transformedProjects[0]?.etablissement);

//     return NextResponse.json({ projects: transformedProjects });
//   } catch (error) {
//     console.error("GET /api/projects error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // POST - Créer un nouveau projet
// export async function POST(req: Request) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
    
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
//       userId: string;
//       role: string;
//       type: string;
//     };

//     if (payload.type !== "ETABLISSEMENT") {
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

//     if (!user || !user.etablissement) {
//       return NextResponse.json({ 
//         error: "Aucun établissement associé à votre profil" 
//       }, { status: 400 });
//     }

//     const body = await req.json();
    
//     const validation = createProjectSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json({ 
//         error: "Données invalides",
//         details: validation.error.flatten()
//       }, { status: 400 });
//     }

//     const data = validation.data;

//     const existingProject = await prisma.project.findUnique({
//       where: { reference: data.reference }
//     });

//     if (existingProject) {
//       return NextResponse.json({ 
//         error: "Cette référence existe déjà" 
//       }, { status: 400 });
//     }

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
//         auteurId: user.id,
//         etablissementId: user.etablissement.id
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
//         }
//       }
//     });

//     // Transformer pour inclure l'avatar
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
//     console.error("POST /api/projects error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const createProjectSchema = z.object({
  reference: z.string().min(1, "La référence est obligatoire"),
  category: z.enum(["CONSTRUCTION", "REHABILITATION", "AUTRES"], {
    required_error: "La catégorie est obligatoire"
  }),
  title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
  description: z.string().min(50, "La description doit contenir au moins 50 caractères"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().optional(),
  photos: z.array(z.string()).min(1, "Au moins une photo est requise"),
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
});

// GET - Récupérer les projets avec avatars
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

    // ✅ CORRECTION : Récupérer les projets avec l'avatar de l'admin de l'établissement
    const projects = await prisma.project.findMany({
      include: {
        auteur: {
          select: {
            id: true,
            fullName: true,
            avatar: true, // ✅ Avatar de l'auteur
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
            // ✅ CORRECTION : Utiliser la bonne relation
            admin: {
              select: {
                id: true,
                avatar: true,
                fullName: true
              }
            }
          }
        },
        dons: {
          select: {
            id: true,
            type: true,
            statut: true
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

    // ✅ Transformer pour ajouter l'avatar de manière cohérente
    const transformedProjects = projects.map(project => {
      // 🔍 DEBUG : Afficher ce que contient admin
      console.log('🔍 Debug établissement:', {
        nom: project.etablissement.nom,
        'admin array': project.etablissement.admin,
        'admin length': project.etablissement.admin?.length,
        'premier admin': project.etablissement.admin?.[0],
        'avatar premier admin': project.etablissement.admin?.[0]?.avatar
      });

      // ✅ PRIORITÉ DES AVATARS :
      // 1. Avatar de l'auteur (celui qui a publié le projet)
      // 2. Avatar du premier admin de l'établissement
      // 3. null (affichera les initiales)
      const etablissementAvatar = 
        project.auteur?.avatar ||
        (project.etablissement.admin.length > 0 ? project.etablissement.admin[0].avatar : null) ||
        null;

      console.log('✅ Avatar final choisi pour', project.etablissement.nom, ':', etablissementAvatar);

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
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        auteurId: project.auteurId,
        etablissementId: project.etablissementId,
        
        // Données de l'auteur
        auteur: project.auteur,
        
        // Données de l'établissement avec avatar
        etablissement: {
          id: project.etablissement.id,
          nom: project.etablissement.nom,
          type: project.etablissement.type,
          niveau: project.etablissement.niveau,
          adresse: project.etablissement.adresse,
          avatar: etablissementAvatar // ✅ Avatar ajouté ici
        },
        
        // Statistiques
        stats: {
          likes: project._count.likes,
          comments: project._count.comments,
          shares: project._count.shares,
          donations: project._count.dons
        },
        
        // Est-ce que l'utilisateur actuel a liké ?
        liked: project.likes.length > 0,
        
        dons: project.dons
      };
    });

    console.log('✅ Projets avec avatars:', transformedProjects[0]?.etablissement);

    return NextResponse.json({ projects: transformedProjects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Créer un nouveau projet
export async function POST(req: Request) {
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
        auteurId: user.id,
        etablissementId: user.etablissement.id
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
        }
      }
    });

    // Transformer pour inclure l'avatar
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
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}