// app/api/enseignants/[id]/donations/route.ts
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

    console.log('📥 Récupération donations pour enseignant ID:', id);

    // Vérifier que l'utilisateur cible existe et est un enseignant
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        fullName: true
      }
    });

    console.log('👤 Enseignant trouvé:', targetUser);

    if (!targetUser || targetUser.type !== "ENSEIGNANT") {
      return NextResponse.json({ 
        error: "Enseignant non trouvé" 
      }, { status: 404 });
    }

    // Vérifier si les utilisateurs sont amis
    const areFriends = await checkFriendship(payload.userId, id);

    // Récupérer les donations reçues par l'enseignant
    const donations = await prisma.don.findMany({
      where: {
        personnelId: id
      },
      select: {
        id: true,
        libelle: true,
        type: true,
        quantite: true,
        montant: true,
        statut: true,
        dateEnvoi: true,
        dateReception: true,
        createdAt: true,
        donateur: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    console.log('💝 Donations trouvées:', donations.length);

    // Transformer les données pour le frontend
    const transformedDonations = donations.map(don => ({
      id: don.id,
      libelle: don.libelle,
      type: don.type,
      quantite: don.quantite,
      montant: don.montant,
      statut: don.statut,
      dateEnvoi: don.dateEnvoi?.toISOString(),
      dateReception: don.dateReception?.toISOString(),
      createdAt: don.createdAt.toISOString(),
      // Infos du donateur visibles uniquement aux amis
      donateur: areFriends ? don.donateur : {
        id: don.donateur.id,
        fullName: "Donateur anonyme",
        avatar: null
      }
    }));

    return NextResponse.json({ 
      donations: transformedDonations,
      areFriends,
      count: donations.length
    });

  } catch (error) {
    console.error("GET /api/enseignants/[id]/donations error:", error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}