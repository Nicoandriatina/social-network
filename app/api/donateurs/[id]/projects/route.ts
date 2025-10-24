// app/api/donateurs/[id]/projects/route.ts
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

    console.log('📥 Récupération projets soutenus par donateur ID:', id);

    // Vérifier que l'utilisateur cible existe et est un donateur
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        fullName: true
      }
    });

    if (!targetUser || targetUser.type !== "DONATEUR") {
      return NextResponse.json({ 
        error: "Donateur non trouvé" 
      }, { status: 404 });
    }

    // Vérifier si les utilisateurs sont amis
    const areFriends = await checkFriendship(payload.userId, id);

    // Récupérer les projets soutenus via les donations
    const donations = await prisma.don.findMany({
      where: {
        donateurId: id,
        projectId: { not: null } // Seulement les dons liés à un projet
      },
      select: {
        id: true,
        montant: true,
        type: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            titre: true,
            description: true,
            categorie: true,
            etablissement: {
              select: {
                nom: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    console.log('💝 Donations avec projets trouvées:', donations.length);

    // Grouper les donations par projet
    const projectsMap = new Map<string, {
      id: string;
      titre: string;
      description: string;
      categorie: string;
      etablissement?: { nom: string };
      donationCount: number;
      totalAmount: number;
      lastDonation: string;
    }>();

    donations.forEach(don => {
      if (!don.project) return;

      const projectId = don.project.id;
      const existing = projectsMap.get(projectId);

      if (existing) {
        existing.donationCount++;
        if (don.type === 'MONETAIRE' && don.montant) {
          existing.totalAmount += don.montant;
        }
        // Garder la date du don le plus récent
        if (new Date(don.createdAt) > new Date(existing.lastDonation)) {
          existing.lastDonation = don.createdAt.toISOString();
        }
      } else {
        projectsMap.set(projectId, {
          id: don.project.id,
          titre: don.project.titre,
          description: don.project.description,
          categorie: don.project.categorie,
          etablissement: don.project.etablissement || undefined,
          donationCount: 1,
          totalAmount: don.type === 'MONETAIRE' && don.montant ? don.montant : 0,
          lastDonation: don.createdAt.toISOString()
        });
      }
    });

    // Convertir en tableau
    const projects = Array.from(projectsMap.values()).map(project => ({
      ...project,
      // Masquer le montant total si pas amis
      totalAmount: areFriends ? project.totalAmount : 0
    }));

    console.log('🎯 Projets uniques trouvés:', projects.length);

    return NextResponse.json({ 
      projects,
      areFriends
    });

  } catch (error) {
    console.error("GET /api/donateurs/[id]/projects error:", error);
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}