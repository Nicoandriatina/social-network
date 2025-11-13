// // app/api/donations/destinations/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

// // GET - Récupérer toutes les destinations possibles pour les dons
// export async function GET() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
    
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Vérifier le token JWT
//     const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
//       userId: string;
//       role: string;
//       type: string;
//     };

//     // ✅ 1. Récupérer les projets AVEC avatars
//     const projects = await prisma.project.findMany({
//       select: {
//         id: true,
//         titre: true,
//         reference: true,
//         auteur: {
//           select: {
//             id: true,
//             fullName: true,
//             avatar: true  // ✅ Avatar de l'auteur
//           }
//         },
//         etablissement: {
//           select: {
//             id: true,
//             nom: true,
//             admin: {
//               select: {
//                 avatar: true  // ✅ Avatar de l'admin de l'établissement
//               },
//               take: 1
//             }
//           }
//         }
//       },
//       orderBy: { titre: 'asc' }
//     });

//     // ✅ 2. Récupérer les établissements AVEC avatars
//     const etablissements = await prisma.etablissement.findMany({
//       select: {
//         id: true,
//         nom: true,
//         type: true,
//         niveau: true,
//         admin: {
//           select: {
//             avatar: true  // ✅ Avatar de l'admin
//           },
//           take: 1
//         }
//       },
//       orderBy: { nom: 'asc' }
//     });

//     // ✅ 3. Récupérer les personnels/enseignants AVEC avatars
//     const personnels = await prisma.user.findMany({
//       where: {
//         type: "ENSEIGNANT"
//       },
//       select: {
//         id: true,
//         fullName: true,
//         avatar: true,  // ✅ Avatar du personnel
//         profession: true,
//         etablissement: {
//           select: {
//             id: true,
//             nom: true
//           }
//         }
//       },
//       orderBy: { fullName: 'asc' }
//     });

//     // ✅ Transformer les données pour le frontend AVEC avatars
//     const transformedData = {
//       projects: projects.map(project => ({
//         id: project.id,
//         label: `${project.titre} - ${project.etablissement?.nom || 'Établissement'}`,
//         titre: project.titre,
//         reference: project.reference,
//         etablissementNom: project.etablissement?.nom,
//         // ✅ Priorité : avatar de l'auteur > avatar de l'admin de l'établissement
//         avatar: project.auteur?.avatar || 
//                 project.etablissement?.admin?.[0]?.avatar || 
//                 null
//       })),
      
//       etablissements: etablissements.map(etab => ({
//         id: etab.id,
//         label: `${etab.nom}${etab.niveau ? ` (${etab.niveau})` : ''}`,
//         nom: etab.nom,
//         type: etab.type,
//         niveau: etab.niveau,
//         // ✅ Avatar de l'admin de l'établissement
//         avatar: etab.admin?.[0]?.avatar || null
//       })),
      
//       personnels: personnels.map(personnel => ({
//         id: personnel.id,
//         label: `${personnel.fullName}${personnel.etablissement ? ` - ${personnel.etablissement.nom}` : ''}`,
//         fullName: personnel.fullName,
//         profession: personnel.profession,
//         etablissementNom: personnel.etablissement?.nom,
//         // ✅ Avatar du personnel
//         avatar: personnel.avatar || null
//       }))
//     };
//     return NextResponse.json(transformedData);

//   } catch (error) {
//     console.error("❌ GET /api/donations/destinations error:", error);
    
//     if (error.name === 'JsonWebTokenError') {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
    
//     return NextResponse.json({ 
//       error: "Server error",
//       details: error.message 
//     }, { status: 500 });
//   }
// }

// app/api/donations/destinations/route.ts
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

    jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    // ✅ 1. Récupérer les projets AVEC leurs besoins ET avatars
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        titre: true,
        reference: true,
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
            admin: {
              select: {
                avatar: true
              },
              take: 1
            }
          }
        },
        // ✅ NOUVEAU : Inclure les besoins du projet
        besoins: {
          where: {
            statut: 'EN_COURS' // Seulement les besoins actifs
          },
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
            priorite: true
          },
          orderBy: {
            priorite: 'asc'
          }
        }
      },
      orderBy: { titre: 'asc' }
    });

    // ✅ 2. Récupérer les établissements AVEC avatars
    const etablissements = await prisma.etablissement.findMany({
      select: {
        id: true,
        nom: true,
        type: true,
        niveau: true,
        admin: {
          select: {
            avatar: true
          },
          take: 1
        }
      },
      orderBy: { nom: 'asc' }
    });

    // ✅ 3. Récupérer les personnels/enseignants AVEC avatars
    const personnels = await prisma.user.findMany({
      where: {
        type: "ENSEIGNANT"
      },
      select: {
        id: true,
        fullName: true,
        avatar: true,
        profession: true,
        etablissement: {
          select: {
            id: true,
            nom: true
          }
        }
      },
      orderBy: { fullName: 'asc' }
    });

    // ✅ Transformer les données pour le frontend AVEC besoins et avatars
    const transformedData = {
      projects: projects.map(project => ({
        id: project.id,
        label: `${project.titre} - ${project.etablissement?.nom || 'Établissement'}`,
        titre: project.titre,
        reference: project.reference,
        etablissementNom: project.etablissement?.nom,
        avatar: project.auteur?.avatar || 
                project.etablissement?.admin?.[0]?.avatar || 
                null,
        // ✅ NOUVEAU : Besoins du projet
        besoins: project.besoins,
        hasNeeds: project.besoins.length > 0
      })),
      
      etablissements: etablissements.map(etab => ({
        id: etab.id,
        label: `${etab.nom}${etab.niveau ? ` (${etab.niveau})` : ''}`,
        nom: etab.nom,
        type: etab.type,
        niveau: etab.niveau,
        avatar: etab.admin?.[0]?.avatar || null
      })),
      
      personnels: personnels.map(personnel => ({
        id: personnel.id,
        label: `${personnel.fullName}${personnel.etablissement ? ` - ${personnel.etablissement.nom}` : ''}`,
        fullName: personnel.fullName,
        profession: personnel.profession,
        etablissementNom: personnel.etablissement?.nom,
        avatar: personnel.avatar || null
      }))
    };
    
    return NextResponse.json(transformedData);

  } catch (error) {
    console.error("❌ GET /api/donations/destinations error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Server error",
      details: error.message 
    }, { status: 500 });
  }
}