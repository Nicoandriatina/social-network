// app/api/etablissements/[id]/teachers/validated/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser();
    
    console.log("========== DEBUG GET VALIDATED TEACHERS ==========");
    console.log("1️⃣ Auth user existe?", !!auth);
    
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: etabId } = await params;
    
    console.log("2️⃣ Etab ID from params:", etabId);
    console.log("3️⃣ Auth type:", auth.type);

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

    console.log("4️⃣ User etablissementId depuis DB:", userEtab?.etablissementId);

    if (!userEtab || userEtab.etablissementId !== etabId) {
      console.log("❌ ERREUR: Établissement non autorisé");
      return NextResponse.json({ 
        error: "Vous ne pouvez accéder qu'aux enseignants de votre établissement" 
      }, { status: 403 });
    }

    // Récupérer les enseignants validés
    const validatedTeachers = await prisma.enseignant.findMany({
      where: {
        validated: true, // ✅ Uniquement les validés
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

    console.log("✅ Nombre d'enseignants validés:", validatedTeachers.length);

    return NextResponse.json({ teachers: validatedTeachers });
  } catch (e) {
    console.error("❌ GET /api/etablissements/[id]/teachers/validated error", e);
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: e instanceof Error ? e.message : "Unknown error"
    }, { status: 500 });
  }
}