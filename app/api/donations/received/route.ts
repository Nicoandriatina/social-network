// app/api/donations/received/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Récupérer les dons reçus selon le profil utilisateur
export async function GET(req: Request) {
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

    // Récupérer les dons selon le type d'utilisateur
    let whereCondition: any = {};

    if (payload.type === "ETABLISSEMENT") {
      // Dons reçus par l'établissement ou ses projets
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { etablissement: true }
      });

      if (user?.etablissement) {
        whereCondition.OR = [
          { etablissementId: user.etablissement.id },
          { project: { etablissementId: user.etablissement.id } }
        ];
      }
    } else if (payload.type === "ENSEIGNANT") {
      // Dons reçus personnellement par l'enseignant
      whereCondition.personnelId = payload.userId;
    } else {
      // Si ce n'est pas un type qui peut recevoir des dons, retourner une liste vide
      return NextResponse.json({ donations: [] });
    }

    const donations = await prisma.don.findMany({
      where: whereCondition,
      include: {
        donateur: {
          select: { 
            id: true,
            fullName: true, 
            avatar: true 
          }
        },
        project: {
          select: {
            id: true,
            titre: true,
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
            nom: true 
          }
        },
        beneficiairePersonnel: {
          select: { 
            id: true,
            fullName: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculer les statistiques
    const stats = {
      total: donations.length,
      pending: donations.filter(d => d.statut === 'EN_ATTENTE').length,
      sent: donations.filter(d => d.statut === 'ENVOYE').length,
      received: donations.filter(d => d.statut === 'RECEPTIONNE').length
    };

    return NextResponse.json({ 
      donations,
      stats,
      userType: payload.type
    });

  } catch (error) {
    console.error("GET /api/donations/received error:", error);
    
    // Gérer l'erreur JWT spécifiquement
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}