// // // import { NextResponse } from "next/server";
// // // import { getAuthUser } from "@/lib/auth";
// // // import { prisma } from "@/lib/prisma";

// // // export async function GET(
// // //   req: Request,
// // //   { params }: { params: Promise<{ id: string }> }
// // // ) {
// // //   try {
// // //     const auth = await getAuthUser();
// // //     if (!auth) {
// // //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// // //     }

// // //     const { id: etabId } = await params;

// // //     // 🔍 DEBUG - Afficher les valeurs dans le terminal
// // //     console.log("========== DEBUG GET PENDING TEACHERS ==========");
// // //     console.log("Auth user:", JSON.stringify(auth, null, 2));
// // //     console.log("Etab ID from params:", etabId);
// // //     console.log("Auth typeProfil:", auth.typeProfil);
// // //     console.log("Auth etablissementId:", auth.etablissementId);
// // //     console.log("===============================================");

// // //     // ✅ Vérifier que l'utilisateur est un ETABLISSEMENT et que c'est son propre établissement
// // //     if (auth.typeProfil !== "ETABLISSEMENT") {
// // //       console.log("❌ ERREUR: typeProfil n'est pas ETABLISSEMENT, c'est:", auth.typeProfil);
// // //       return NextResponse.json({ error: "Accès réservé aux établissements" }, { status: 403 });
// // //     }

// // //     if (auth.etablissementId !== etabId) {
// // //       return NextResponse.json({ error: "Vous ne pouvez accéder qu'aux enseignants de votre établissement" }, { status: 403 });
// // //     }

// // //     // Récupérer les enseignants non validés
// // //     const pendingTeachers = await prisma.enseignant.findMany({
// // //       where: {
// // //         validated: false,
// // //         user: {
// // //           etablissementId: etabId,
// // //         },
// // //       },
// // //       include: {
// // //         user: {
// // //           select: {
// // //             id: true,
// // //             fullName: true,
// // //             email: true,
// // //             telephone: true,
// // //             avatar: true,
// // //             createdAt: true,
// // //           },
// // //         },
// // //       },
// // //       orderBy: { createdAt: "desc" },
// // //     });

// // //     return NextResponse.json({ teachers: pendingTeachers });
// // //   } catch (e) {
// // //     console.error("GET /api/etablissements/[id]/teachers/pending error", e);
// // //     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
// // //   }
// // // }

// // import { NextResponse } from "next/server";
// // import { getAuthUser } from "@/lib/auth";
// // import { prisma } from "@/lib/prisma";

// // export async function PATCH(
// //   req: Request,
// //   { params }: { params: Promise<{ id: string; teacherId: string }> }
// // ) {
// //   try {
// //     const auth = await getAuthUser();
// //     if (!auth) {
// //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //     }

// //     const { id: etabId, teacherId } = await params;

// //     // ✅ Vérifier que l'utilisateur est un ETABLISSEMENT (utiliser "type" au lieu de "typeProfil")
// //     if (auth.type !== "ETABLISSEMENT") {
// //       return NextResponse.json({ error: "Accès réservé aux établissements" }, { status: 403 });
// //     }

// //     // ✅ Vérifier que l'établissement accède bien à ses propres données
// //     const userEtab = await prisma.user.findUnique({
// //       where: { id: auth.id },
// //       select: { etablissementId: true }
// //     });

// //     if (!userEtab || userEtab.etablissementId !== etabId) {
// //       return NextResponse.json({ error: "Vous ne pouvez valider que les enseignants de votre établissement" }, { status: 403 });
// //     }

// //     // Récupérer l'enseignant et vérifier qu'il est de l'établissement
// //     const enseignant = await prisma.enseignant.findUnique({
// //       where: { id: teacherId },
// //       include: { user: true },
// //     });

// //     if (!enseignant || enseignant.user.etablissementId !== etabId) {
// //       return NextResponse.json({ error: "Enseignant non trouvé" }, { status: 404 });
// //     }

// //     // Valider l'enseignant
// //     const updated = await prisma.enseignant.update({
// //       where: { id: teacherId },
// //       data: { validated: true },
// //     });

// //     // Créer une notification
// //     const admin = await prisma.user.findUnique({
// //       where: { id: auth.id },
// //       select: { fullName: true },
// //     });

// //     await prisma.notification.create({
// //       data: {
// //         userId: enseignant.userId,
// //         type: "PROJECT_PUBLISHED",
// //         title: "Profil validé",
// //         content: `${admin?.fullName} a validé votre profil d'enseignant`,
// //         relatedUserId: auth.id,
// //       },
// //     });

// //     return NextResponse.json({ enseignant: updated });
// //   } catch (e) {
// //     console.error("PATCH /api/etablissements/[id]/teachers/[teacherId]/validate error", e);
// //     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
// //   }
// // }
// import { NextResponse } from "next/server";
// import { getAuthUser } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const auth = await getAuthUser();
    
//     console.log("========== DEBUG GET PENDING TEACHERS ==========");
//     console.log("1️⃣ Auth user existe?", !!auth);
    
//     if (!auth) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id: etabId } = await params;
    
//     console.log("2️⃣ Auth user:", JSON.stringify(auth, null, 2));
//     console.log("3️⃣ Etab ID from params:", etabId);
//     console.log("4️⃣ Auth type:", auth.type);
//     console.log("===============================================");

//     // ✅ Vérifier que l'utilisateur est un ETABLISSEMENT (utiliser "type" au lieu de "typeProfil")
//     if (auth.type !== "ETABLISSEMENT") {
//       console.log("❌ ERREUR: type n'est pas ETABLISSEMENT, c'est:", auth.type);
//       return NextResponse.json({ error: "Accès réservé aux établissements" }, { status: 403 });
//     }

//     // ✅ Vérifier que l'établissement accède bien à ses propres données
//     const userEtab = await prisma.user.findUnique({
//       where: { id: auth.id },
//       select: { etablissementId: true }
//     });

//     console.log("5️⃣ User etablissementId depuis DB:", userEtab?.etablissementId);

//     if (!userEtab || userEtab.etablissementId !== etabId) {
//       console.log("❌ ERREUR: Établissement non autorisé");
//       return NextResponse.json({ error: "Vous ne pouvez accéder qu'aux enseignants de votre établissement" }, { status: 403 });
//     }

//     // Récupérer les enseignants non validés
//     const pendingTeachers = await prisma.enseignant.findMany({
//       where: {
//         validated: false,
//         user: {
//           etablissementId: etabId,
//         },
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             fullName: true,
//             email: true,
//             telephone: true,
//             avatar: true,
//             createdAt: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     console.log("✅ Nombre d'enseignants en attente:", pendingTeachers.length);

//     return NextResponse.json({ teachers: pendingTeachers });
//   } catch (e) {
//     console.error("❌ GET /api/etablissements/[id]/teachers/pending error", e);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser();
    
    console.log("========== DEBUG GET PENDING TEACHERS ==========");
    console.log("1️⃣ Auth user existe?", !!auth);
    
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: etabId } = await params;
    
    console.log("2️⃣ Auth user:", JSON.stringify(auth, null, 2));
    console.log("3️⃣ Etab ID from params:", etabId);
    console.log("4️⃣ Auth type:", auth.type);
    console.log("===============================================");

    // ✅ Vérifier que l'utilisateur est un ETABLISSEMENT (utiliser "type" au lieu de "typeProfil")
    if (auth.type !== "ETABLISSEMENT") {
      console.log("❌ ERREUR: type n'est pas ETABLISSEMENT, c'est:", auth.type);
      return NextResponse.json({ error: "Accès réservé aux établissements" }, { status: 403 });
    }

    // ✅ Vérifier que l'établissement accède bien à ses propres données
    const userEtab = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { etablissementId: true }
    });

    console.log("5️⃣ User etablissementId depuis DB:", userEtab?.etablissementId);

    if (!userEtab || userEtab.etablissementId !== etabId) {
      console.log("❌ ERREUR: Établissement non autorisé");
      return NextResponse.json({ error: "Vous ne pouvez accéder qu'aux enseignants de votre établissement" }, { status: 403 });
    }

    // Récupérer les enseignants non validés
    const pendingTeachers = await prisma.enseignant.findMany({
      where: {
        validated: false,
        user: {
          etablissementId: etabId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            telephone: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc"
        }
      },
    });

    console.log("✅ Nombre d'enseignants en attente:", pendingTeachers.length);

    return NextResponse.json({ teachers: pendingTeachers });
  } catch (e) {
    console.error("❌ GET /api/etablissements/[id]/teachers/pending error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}