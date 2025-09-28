// app/api/etablissements/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Récupérer la liste des établissements pour les dons
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Vérifier le token JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    // Récupérer tous les établissements actifs
    const etablissements = await prisma.etablissement.findMany({
      select: {
        id: true,
        nom: true,
        type: true,
        niveau: true,
        adressePostale: true,
        description: true,
        logo: true,
        admin: {
          select: {
            id: true,
            fullName: true
          }
        },
        // Optionnel : compter les projets et dons reçus
        _count: {
          select: {
            projects: true,
            donsRecus: true
          }
        }
      },
      // Ordonner par nom
      orderBy: { nom: 'asc' }
    });

    // Transformer les données pour l'affichage
    const transformedEtablissements = etablissements.map(etab => ({
      id: etab.id,
      nom: etab.nom,
      type: etab.type,
      niveau: etab.niveau,
      adressePostale: etab.adressePostale,
      description: etab.description,
      logo: etab.logo,
      adminNames: etab.admin.map(a => a.fullName).join(', '),
      projectCount: etab._count.projects,
      donationCount: etab._count.donsRecus,
      displayName: `${etab.nom} ${etab.niveau ? `(${etab.niveau})` : ''}`
    }));

    return NextResponse.json({ 
      etablissements: transformedEtablissements,
      total: etablissements.length 
    });

  } catch (error) {
    console.error("GET /api/etablissements error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}