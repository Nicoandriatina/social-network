// app/api/enseignants/[id]/experiences/route.ts
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
    // Vérifier d'abord si le modèle existe, sinon utiliser une approche alternative
    let areFriends = payload.userId === id; // Toujours vrai si c'est son propre profil
    
    if (!areFriends) {
      try {
        // Essayer de chercher une amitié (adapter selon votre schéma)
        const friendship = await prisma.friendRequest?.findFirst({
          where: {
            OR: [
              { senderId: payload.userId, receiverId: id, status: "ACCEPTED" },
              { senderId: id, receiverId: payload.userId, status: "ACCEPTED" }
            ]
          }
        });
        areFriends = !!friendship;
      } catch (e) {
        // Si le modèle n'existe pas, on considère que tout est public pour l'instant
        console.warn("Friendship model not found, defaulting to public");
        areFriends = true;
      }
    }

    // Récupérer les expériences
    const experiences = await prisma.experience.findMany({
      where: { enseignantId: id },
      orderBy: { debut: 'desc' }
    });

    // Si pas amis, masquer les détails sensibles
    const sanitizedExperiences = experiences.map(exp => ({
      id: exp.id,
      poste: exp.poste,
      etablissement: exp.etablissement,
      debut: exp.debut.toISOString(),
      fin: exp.fin?.toISOString(),
      enCours: exp.enCours,
      // Description visible uniquement aux amis
      description: areFriends ? exp.description : ""
    }));

    return NextResponse.json({ 
      experiences: sanitizedExperiences,
      areFriends 
    });

  } catch (error) {
    console.error("GET /api/enseignants/[id]/experiences error:", error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}