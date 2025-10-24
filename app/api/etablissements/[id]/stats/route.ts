// app/api/etablissements/[id]/stats/route.ts
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

    console.log('📊 Récupération statistiques pour établissement ID:', id);

    // Vérifier que l'utilisateur cible existe et est un établissement
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        fullName: true,
        etablissementId: true
      }
    });

    if (!targetUser || targetUser.type !== "ETABLISSEMENT") {
      return NextResponse.json({ 
        error: "Établissement non trouvé" 
      }, { status: 404 });
    }

    // Vérifier si les utilisateurs sont amis
    const areFriends = await checkFriendship(payload.userId, id);

    // Obtenir l'ID de l'établissement
    const etablissementId = targetUser.etablissementId;

    if (!etablissementId) {
      return NextResponse.json({ 
        error: "Établissement non lié" 
      }, { status: 404 });
    }

    // Compter les projets de l'établissement
    const totalProjects = await prisma.project.count({
      where: {
        etablissementId: etablissementId
      }
    });

    // Compter les donations reçues par l'établissement
    const donations = await prisma.don.findMany({
      where: {
        etablissementId: etablissementId
      },
      select: {
        id: true,
        montant: true,
        type: true,
        donateurId: true
      }
    });

    const totalDonations = donations.length;

    // Calculer le montant total (visible uniquement aux amis)
    const totalAmount = areFriends 
      ? donations
          .filter(d => d.type === 'MONETAIRE' && d.montant)
          .reduce((sum, d) => sum + (d.montant || 0), 0)
      : 0;

    // Compter le nombre de donateurs uniques
    const uniqueDonors = new Set(donations.map(d => d.donateurId));
    const totalDonors = uniqueDonors.size;

    const stats = {
      totalProjects,
      totalDonations,
      totalAmount,
      totalDonors
    };

    console.log('📊 Statistiques calculées:', stats);

    return NextResponse.json({ 
      stats,
      areFriends
    });

  } catch (error) {
    console.error("GET /api/etablissements/[id]/stats error:", error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}