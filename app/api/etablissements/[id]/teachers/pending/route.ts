
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
//       orderBy: {
//         user: {
//           createdAt: "desc"
//         }
//       },
//     });

//     console.log("✅ Nombre d'enseignants en attente:", pendingTeachers.length);

//     return NextResponse.json({ teachers: pendingTeachers });
//   } catch (e) {
//     console.error("❌ GET /api/etablissements/[id]/teachers/pending error", e);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }

// app/api/etablissements/[id]/teachers/pending/route.ts
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

    // Vérifier que l'utilisateur est un ETABLISSEMENT
    if (auth.type !== "ETABLISSEMENT") {
      console.log("❌ ERREUR: type n'est pas ETABLISSEMENT");
      return NextResponse.json({ error: "Accès réservé aux établissements" }, { status: 403 });
    }

    // Vérifier que l'établissement accède à ses propres données
    const userEtab = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { etablissementId: true }
    });

    console.log("5️⃣ User etablissementId depuis DB:", userEtab?.etablissementId);

    if (!userEtab || userEtab.etablissementId !== etabId) {
      console.log("❌ ERREUR: Établissement non autorisé");
      return NextResponse.json({ 
        error: "Vous ne pouvez accéder qu'aux enseignants de votre établissement" 
      }, { status: 403 });
    }

    // Récupérer les enseignants non validés avec leurs années
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
            scolariteAnnee: true, // ✅ Inclure les années
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc"
        }
      },
    });

    // ✅ Enrichir les données avec les informations de période
    const enrichedTeachers = pendingTeachers.map(teacher => {
      const years = teacher.user.scolariteAnnee || [];
      const startYear = years.length > 0 ? Math.min(...years) : undefined;
      const endYear = years.length > 0 ? Math.max(...years) : undefined;
      const currentYear = new Date().getFullYear();
      const isCurrentTeacher = endYear === currentYear;

      return {
        ...teacher,
        startYear,
        endYear: isCurrentTeacher ? undefined : endYear,
        isCurrentTeacher,
        yearsCount: years.length,
      };
    });

    console.log("✅ Nombre d'enseignants en attente:", enrichedTeachers.length);
    console.log("📊 Détails premiers enseignants:", enrichedTeachers.slice(0, 2));

    return NextResponse.json({ teachers: enrichedTeachers });
  } catch (e) {
    console.error("❌ GET /api/etablissements/[id]/teachers/pending error", e);
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: e instanceof Error ? e.message : "Unknown error"
    }, { status: 500 });
  }
}