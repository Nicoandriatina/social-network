// app/api/donations/stats/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Récupérer les statistiques des dons pour un établissement
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

    let whereCondition: any = {};
    
    if (payload.type === "ETABLISSEMENT") {
      // Statistiques pour un établissement
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
      // Statistiques pour un enseignant
      whereCondition.personnelId = payload.userId;
    } else if (payload.type === "DONATEUR") {
      // Statistiques pour un donateur
      whereCondition.donateurId = payload.userId;
    }

    // Récupérer tous les dons concernés
    const donations = await prisma.don.findMany({
      where: whereCondition,
      include: {
        donateur: {
          select: { id: true }
        }
      }
    });

    // Calculer les statistiques
    const stats = {
      // Totaux généraux
      totalDonations: donations.length,
      totalMonetaire: donations
        .filter(d => d.type === 'MONETAIRE' && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0),
      
      // Par statut
      enAttente: donations.filter(d => d.statut === 'EN_ATTENTE').length,
      envoyes: donations.filter(d => d.statut === 'ENVOYE').length,
      recus: donations.filter(d => d.statut === 'RECEPTIONNE').length,
      
      // Montants par statut
      montantEnAttente: donations
        .filter(d => d.statut === 'EN_ATTENTE' && d.type === 'MONETAIRE' && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0),
      montantEnvoye: donations
        .filter(d => d.statut === 'ENVOYE' && d.type === 'MONETAIRE' && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0),
      montantRecu: donations
        .filter(d => d.statut === 'RECEPTIONNE' && d.type === 'MONETAIRE' && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0),
      
      // Par type
      donationsMonetaires: donations.filter(d => d.type === 'MONETAIRE').length,
      donationsVivres: donations.filter(d => d.type === 'VIVRES').length,
      donationsMateriels: donations.filter(d => d.type === 'NON_VIVRES').length,
      
      // Donateurs uniques (pour les établissements/enseignants)
      donateurUniques: new Set(donations.map(d => d.donateurId)).size,
      
      // Ce mois
      thisMonth: donations.filter(d => {
        const now = new Date();
        const donationDate = new Date(d.createdAt);
        return donationDate.getMonth() === now.getMonth() && 
               donationDate.getFullYear() === now.getFullYear();
      }).length,
      
      montantThisMonth: donations
        .filter(d => {
          const now = new Date();
          const donationDate = new Date(d.createdAt);
          return donationDate.getMonth() === now.getMonth() && 
                 donationDate.getFullYear() === now.getFullYear() &&
                 d.type === 'MONETAIRE' && d.montant;
        })
        .reduce((sum, d) => sum + (d.montant || 0), 0)
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error("GET /api/donations/stats error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}