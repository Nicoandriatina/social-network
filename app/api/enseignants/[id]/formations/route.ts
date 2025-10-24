// app/api/enseignants/[id]/formations/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { checkFriendship } from "@/lib/helpers/checkFriendship";

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
      type: string;
    };

    const { id } = await params;

    // Vérifier que l'utilisateur cible existe et est un enseignant
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        type: true
      }
    });

    if (!targetUser || targetUser.type !== "ENSEIGNANT") {
      return NextResponse.json({ 
        error: "Enseignant non trouvé" 
      }, { status: 404 });
    }

    // Vérifier si les utilisateurs sont amis
    const areFriends = await checkFriendship(payload.userId, id);

    // Récupérer les formations
    const formations = await prisma.formation.findMany({
      where: { enseignantId: id },
      orderBy: { annee: 'desc' }
    });

    // Si pas amis, masquer les descriptions
    const sanitizedFormations = formations.map(form => ({
      id: form.id,
      diplome: form.diplome,
      etablissement: form.etablissement,
      annee: form.annee,
      // Description visible uniquement aux amis
      description: areFriends ? form.description : null
    }));

    return NextResponse.json({ 
      formations: sanitizedFormations,
      areFriends 
    });

  } catch (error) {
    console.error("GET /api/enseignants/[id]/formations error:", error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}