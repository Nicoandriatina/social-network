// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";
// import { z } from "zod";
// import { DonationActivityLogger } from "@/lib/services/donationActivityLogger";
// import { notifyDonationReceived } from "@/lib/notifications";
// import { emitSocketNotification } from "@/lib/emit-socket-notification";

// export const runtime = "nodejs";

// // Schéma de validation pour créer un don
// const createDonationSchema = z.object({
//   libelle: z.string().min(1, "Le libellé est obligatoire"),
//   type: z.enum(["MONETAIRE", "VIVRES", "NON_VIVRES"], {
//     required_error: "Le type de don est obligatoire"
//   }),
//   montant: z.number().positive().optional(),
//   quantite: z.number().nullable().optional(),
//   photos: z.array(z.string()).optional(),
//   // Destination du don (un seul requis)
//   projectId: z.string().optional(),
//   etablissementId: z.string().optional(),
//   personnelId: z.string().optional(),
// }).refine((data) => {
//   // Au moins une destination doit être spécifiée
//   const destinations = [data.projectId, data.etablissementId, data.personnelId].filter(Boolean);
//   if (destinations.length !== 1) {
//     console.log("Destinations trouvées:", destinations, "Données reçues:", data);
//     return false;
//   }
//   return true;
// }, {
//   message: "Vous devez spécifier exactement une destination pour le don",
//   path: ["destination"]
// }).refine((data) => {
//   // Validation selon le type de don
//   if (data.type === "MONETAIRE") {
//     return data.montant && data.montant > 0;
//   } else if (data.type === "VIVRES" || data.type === "NON_VIVRES") {
//     return data.quantite && data.quantite > 0;
//   }
//   return true;
// }, {
//   message: "Le montant est obligatoire pour les dons monétaires, la quantité pour les autres types",
//   path: ["amount"]
// });

// // POST - Créer un nouveau don avec logging automatique
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

//     // Vérifier que l'utilisateur est de type DONATEUR
//     if (payload.type !== "DONATEUR") {
//       return NextResponse.json({ 
//         error: "Seuls les donateurs peuvent faire des dons" 
//       }, { status: 403 });
//     }

//     const body = await req.json();
//     console.log("Données reçues dans l'API:", body);
    
//     // Validation des données
//     const validation = createDonationSchema.safeParse(body);
//     if (!validation.success) {
//       console.log("Erreur de validation:", validation.error.flatten());
//       return NextResponse.json({ 
//         error: "Données invalides",
//         details: validation.error.flatten()
//       }, { status: 400 });
//     }

//     const data = validation.data;
//     console.log("Données validées:", data);

//     // Vérifier que la destination existe
//     if (data.projectId) {
//       const project = await prisma.project.findUnique({
//         where: { id: data.projectId }
//       });
//       if (!project) {
//         return NextResponse.json({ 
//           error: "Le projet sélectionné n'existe pas" 
//         }, { status: 404 });
//       }
//     } else if (data.etablissementId) {
//       const etablissement = await prisma.etablissement.findUnique({
//         where: { id: data.etablissementId }
//       });
//       if (!etablissement) {
//         return NextResponse.json({ 
//           error: "L'établissement sélectionné n'existe pas" 
//         }, { status: 404 });
//       }
//     } else if (data.personnelId) {
//       const personnel = await prisma.user.findUnique({
//         where: { 
//           id: data.personnelId,
//           type: "ENSEIGNANT"
//         }
//       });
//       if (!personnel) {
//         return NextResponse.json({ 
//           error: "Le personnel sélectionné n'existe pas" 
//         }, { status: 404 });
//       }
//     }

//     // Créer le don
//     const don = await prisma.don.create({
//       data: {
//         libelle: data.libelle,
//         type: data.type,
//         montant: data.montant || null,
//         quantite: data.quantite || null,
//         photos: data.photos || [],
//         statut: 'EN_ATTENTE',
//         donateurId: payload.userId,
//         projectId: data.projectId || null,
//         etablissementId: data.etablissementId || null,
//         personnelId: data.personnelId || null,
//       },
//       include: {
//         donateur: {
//           select: { id: true, fullName: true }
//         },
//         project: {
//           select: {
//             id: true,
//             titre: true,
//             auteurId: true,
//             etablissement: {
//               select: { 
//                 id: true,
//                 nom: true 
//               }
//             }
//           }
//         },
//         beneficiaireEtab: {
//           select: { 
//             id: true,
//             nom: true,
//             admin: {
//               select: { id: true },
//               take: 1
//             }
//           }
//         },
//         beneficiairePersonnel: {
//           select: { 
//             id: true,
//             fullName: true 
//           }
//         }
//       }
//     });

//     console.log("Don créé avec succès:", don);

//     // Enregistrer l'action dans l'historique
//     await DonationActivityLogger.logDonationCreated(don.id, payload.userId, {
//       libelle: data.libelle,
//       type: data.type,
//       montant: data.montant,
//       quantite: data.quantite,
//       donateurName: don.donateur.fullName,
//       destinationType: don.projectId ? 'projet' : don.etablissementId ? 'établissement' : 'personnel'
//     });

//     // 🔔 NOTIFICATION TEMPS RÉEL
//     let recipientUserId = null;
//     let projectTitle = null;
    
//     if (don.projectId && don.project) {
//       // Don vers un projet -> notifier l'auteur
//       recipientUserId = don.project.auteurId;
//       projectTitle = don.project.titre;
//     } else if (don.personnelId) {
//       // Don vers personnel
//       recipientUserId = don.personnelId;
//     } else if (don.etablissementId && don.beneficiaireEtab) {
//       // Don vers établissement -> notifier l'admin
//       recipientUserId = don.beneficiaireEtab.admin[0]?.id;
//     }

//     // Créer et émettre la notification
//     if (recipientUserId) {
//       try {
//         const notification = await notifyDonationReceived({
//           donId: don.id,
//           donorUserId: payload.userId,
//           recipientUserId,
//           donationType: don.type,
//           projectTitle
//         });
        
//         if (notification) {
//           await emitSocketNotification(notification.id);
//           console.log('✅ Notification de don créée et émise');
//         }
//       } catch (notifError) {
//         console.error('❌ Erreur notification don:', notifError);
//         // On continue même si la notification échoue
//       }
//     }

//     return NextResponse.json({ 
//       message: "Don créé avec succès",
//       donation: don 
//     }, { status: 201 });

//   } catch (error: any) {
//     console.error("POST /api/donations error:", error);
    
//     // Gestion des erreurs Prisma
//     if (error.code === 'P2002') {
//       return NextResponse.json({ 
//         error: "Un don similaire existe déjà" 
//       }, { status: 409 });
//     }
    
//     if (error.code === 'P2003') {
//       return NextResponse.json({ 
//         error: "Référence invalide vers une destination" 
//       }, { status: 400 });
//     }

//     return NextResponse.json({ 
//       error: "Erreur serveur lors de la création du don" 
//     }, { status: 500 });
//   }
// }

// // GET - Récupérer les dons de l'utilisateur connecté
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

//     const donations = await prisma.don.findMany({
//       where: { donateurId: payload.userId },
//       include: {
//         project: {
//           select: {
//             titre: true,
//             etablissement: {
//               select: { nom: true }
//             }
//           }
//         },
//         beneficiaireEtab: {
//           select: { nom: true }
//         },
//         beneficiairePersonnel: {
//           select: { fullName: true }
//         }
//       },
//       orderBy: { createdAt: 'desc' }
//     });

//     const transformedDonations = donations.map(don => ({
//       id: don.id,
//       libelle: don.libelle,
//       type: don.type,
//       montant: don.montant,
//       quantite: don.quantite,
//       statut: don.statut,
//       photos: don.photos,
//       createdAt: don.createdAt.toISOString(),
//       dateEnvoi: don.dateEnvoi?.toISOString(),
//       dateReception: don.dateReception?.toISOString(),
//       donateurId: don.donateurId,
//       projectId: don.projectId,
//       etablissementId: don.etablissementId,
//       personnelId: don.personnelId,
//       destination: {
//         type: don.projectId ? 'project' : don.etablissementId ? 'etablissement' : 'personnel',
//         name: don.project?.titre || don.beneficiaireEtab?.nom || don.beneficiairePersonnel?.fullName,
//         etablissement: don.project?.etablissement?.nom
//       }
//     }));

//     return NextResponse.json({ donations: transformedDonations });

//   } catch (error) {
//     console.error("GET /api/donations error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// app/api/donations/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { DonationActivityLogger } from "@/lib/services/donationActivityLogger";
import { notifyDonationReceived } from "@/lib/notifications";
import { emitSocketNotification } from "@/lib/emit-socket-notification";

export const runtime = "nodejs";

// Schéma pour un article (vivres/non-vivres)
const itemSchema = z.object({
  name: z.string().min(1, "Le nom de l'article est obligatoire"),
  quantity: z.number().int().positive("La quantité doit être positive")
});

// Schéma de validation pour créer un don
const createDonationSchema = z.object({
  type: z.enum(["MONETAIRE", "VIVRES", "NON_VIVRES"], {
    required_error: "Le type de don est obligatoire"
  }),
  montant: z.number().positive().optional(),
  items: z.array(itemSchema).optional(),
  photos: z.array(z.string()).optional(),
  // Destination du don (un seul requis)
  projectId: z.string().optional(),
  etablissementId: z.string().optional(),
  personnelId: z.string().optional(),
}).refine((data) => {
  // Au moins une destination doit être spécifiée
  const destinations = [data.projectId, data.etablissementId, data.personnelId].filter(Boolean);
  if (destinations.length !== 1) {
    return false;
  }
  return true;
}, {
  message: "Vous devez spécifier exactement une destination pour le don",
  path: ["destination"]
}).refine((data) => {
  // Validation selon le type de don
  if (data.type === "MONETAIRE") {
    return data.montant && data.montant > 0;
  } else if (data.type === "VIVRES" || data.type === "NON_VIVRES") {
    return data.items && data.items.length > 0;
  }
  return true;
}, {
  message: "Le montant est obligatoire pour les dons monétaires, les articles pour les autres types",
  path: ["amount"]
});

// POST - Créer un nouveau don avec support des articles multiples
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

    // Vérifier que l'utilisateur est de type DONATEUR
    if (payload.type !== "DONATEUR") {
      return NextResponse.json({ 
        error: "Seuls les donateurs peuvent faire des dons" 
      }, { status: 403 });
    }

    const body = await req.json();
    console.log("Données reçues dans l'API:", body);
    
    // Validation des données
    const validation = createDonationSchema.safeParse(body);
    if (!validation.success) {
      console.log("Erreur de validation:", validation.error.flatten());
      return NextResponse.json({ 
        error: "Données invalides",
        details: validation.error.flatten()
      }, { status: 400 });
    }

    const data = validation.data;
    console.log("Données validées:", data);

    // Vérifier que la destination existe
    if (data.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: data.projectId }
      });
      if (!project) {
        return NextResponse.json({ 
          error: "Le projet sélectionné n'existe pas" 
        }, { status: 404 });
      }
    } else if (data.etablissementId) {
      const etablissement = await prisma.etablissement.findUnique({
        where: { id: data.etablissementId }
      });
      if (!etablissement) {
        return NextResponse.json({ 
          error: "L'établissement sélectionné n'existe pas" 
        }, { status: 404 });
      }
    } else if (data.personnelId) {
      const personnel = await prisma.user.findUnique({
        where: { 
          id: data.personnelId,
          type: "ENSEIGNANT"
        }
      });
      if (!personnel) {
        return NextResponse.json({ 
          error: "Le personnel sélectionné n'existe pas" 
        }, { status: 404 });
      }
    }

    // Générer le libellé automatiquement
    let libelle = '';
    if (data.type === 'MONETAIRE') {
      const montantFormate = new Intl.NumberFormat('fr-MG').format(data.montant || 0);
      libelle = `Don de ${montantFormate} Ar`;
    } else if (data.items && data.items.length > 0) {
      const itemNames = data.items.map(item => item.name).join(', ');
      libelle = `Don de ${data.items.length} article${data.items.length > 1 ? 's' : ''}: ${itemNames}`;
    }

    // Calculer la quantité totale pour les dons non-monétaires
    const totalQuantite = data.items?.reduce((sum, item) => sum + item.quantity, 0) || null;

    // Créer le don avec les articles en metadata
    const don = await prisma.don.create({
      data: {
        libelle,
        type: data.type,
        montant: data.montant || null,
        quantite: totalQuantite,
        photos: data.photos || [],
        statut: 'EN_ATTENTE',
        donateurId: payload.userId,
        projectId: data.projectId || null,
        etablissementId: data.etablissementId || null,
        personnelId: data.personnelId || null,
      },
      include: {
        donateur: {
          select: { id: true, fullName: true }
        },
        project: {
          select: {
            id: true,
            titre: true,
            auteurId: true,
            etablissement: {
              select: { 
                id: true,
                nom: true 
              }
            }
          }
        },
        beneficiaireEtab: {
          select: { 
            id: true,
            nom: true,
            admin: {
              select: { id: true },
              take: 1
            }
          }
        },
        beneficiairePersonnel: {
          select: { 
            id: true,
            fullName: true 
          }
        }
      }
    });

    console.log("Don créé avec succès:", don);

    // Enregistrer les articles dans l'historique d'activité
    if (data.items && data.items.length > 0) {
      await DonationActivityLogger.logActivity({
        donationId: don.id,
        userId: payload.userId,
        action: 'CREATED',
        description: `Don créé avec ${data.items.length} article${data.items.length > 1 ? 's' : ''}`,
        metadata: {
          items: data.items,
          type: data.type,
          donateurName: don.donateur.fullName
        }
      });
    } else {
      await DonationActivityLogger.logDonationCreated(don.id, payload.userId, {
        libelle,
        type: data.type,
        montant: data.montant,
        quantite: totalQuantite,
        donateurName: don.donateur.fullName,
        destinationType: don.projectId ? 'projet' : don.etablissementId ? 'établissement' : 'personnel'
      });
    }

    // 🔔 NOTIFICATION TEMPS RÉEL
    let recipientUserId = null;
    let projectTitle = null;
    
    if (don.projectId && don.project) {
      recipientUserId = don.project.auteurId;
      projectTitle = don.project.titre;
    } else if (don.personnelId) {
      recipientUserId = don.personnelId;
    } else if (don.etablissementId && don.beneficiaireEtab) {
      recipientUserId = don.beneficiaireEtab.admin[0]?.id;
    }

    // Créer et émettre la notification
    if (recipientUserId) {
      try {
        const notification = await notifyDonationReceived({
          donId: don.id,
          donorUserId: payload.userId,
          recipientUserId,
          donationType: don.type,
          projectTitle
        });
        
        if (notification) {
          await emitSocketNotification(notification.id);
          console.log('✅ Notification de don créée et émise');
        }
      } catch (notifError) {
        console.error('❌ Erreur notification don:', notifError);
      }
    }

    return NextResponse.json({ 
      message: "Don créé avec succès",
      donation: {
        ...don,
        items: data.items || []
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/donations error:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: "Un don similaire existe déjà" 
      }, { status: 409 });
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: "Référence invalide vers une destination" 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: "Erreur serveur lors de la création du don" 
    }, { status: 500 });
  }
}

// GET - Récupérer les dons de l'utilisateur connecté avec les articles
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

    const donations = await prisma.don.findMany({
      where: { donateurId: payload.userId },
      include: {
        project: {
          select: {
            titre: true,
            etablissement: {
              select: { nom: true }
            }
          }
        },
        beneficiaireEtab: {
          select: { nom: true }
        },
        beneficiairePersonnel: {
          select: { fullName: true }
        },
        activityLogs: {
          where: {
            action: 'CREATED',
            metadata: {
              path: ['items'],
              not: null
            }
          },
          select: {
            metadata: true
          },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const transformedDonations = donations.map(don => {
      // Extraire les items depuis l'activity log si disponible
      const items = don.activityLogs[0]?.metadata?.items || [];

      return {
        id: don.id,
        libelle: don.libelle,
        type: don.type,
        montant: don.montant,
        quantite: don.quantite,
        items: items,
        statut: don.statut,
        photos: don.photos,
        createdAt: don.createdAt.toISOString(),
        dateEnvoi: don.dateEnvoi?.toISOString(),
        dateReception: don.dateReception?.toISOString(),
        donateurId: don.donateurId,
        projectId: don.projectId,
        etablissementId: don.etablissementId,
        personnelId: don.personnelId,
        destination: {
          type: don.projectId ? 'project' : don.etablissementId ? 'etablissement' : 'personnel',
          name: don.project?.titre || don.beneficiaireEtab?.nom || don.beneficiairePersonnel?.fullName,
          etablissement: don.project?.etablissement?.nom
        }
      };
    });

    return NextResponse.json({ donations: transformedDonations });

  } catch (error) {
    console.error("GET /api/donations error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}