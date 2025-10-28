// app/api/user/stats/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        type: true,
        etablissementId: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let stats = {
      friends: 0,
      projects: 0,
      donations: 0
    };

    // Compter les amis (acceptés)
    const friendships = await prisma.friendRequest.count({
      where: {
        OR: [
          { fromId: user.id, accepted: true },
          { toId: user.id, accepted: true }
        ]
      }
    });
    stats.friends = friendships;

    // Statistiques selon le type d'utilisateur
    if (user.type === "DONATEUR") {
      // Nombre de dons effectués
      const donsEffectues = await prisma.don.count({
        where: { donateurId: user.id }
      });
      stats.donations = donsEffectues;

      // Nombre de projets soutenus (uniques)
      const projetsSoutenus = await prisma.don.findMany({
        where: {
          donateurId: user.id,
          projectId: { not: null }
        },
        select: { projectId: true },
        distinct: ['projectId']
      });
      stats.projects = projetsSoutenus.length;

    } else if (user.type === "ETABLISSEMENT") {
      // Nombre de projets publiés
      const projetsPublies = await prisma.project.count({
        where: { auteurId: user.id }
      });
      stats.projects = projetsPublies;

      // Nombre de dons reçus (via l'établissement)
      const donsRecus = await prisma.don.count({
        where: {
          OR: [
            { etablissementId: user.etablissementId },
            { project: { etablissementId: user.etablissementId } }
          ]
        }
      });
      stats.donations = donsRecus;

    } else if (user.type === "ENSEIGNANT") {
      // Nombre de projets créés par l'enseignant
      const projets = await prisma.project.count({
        where: { auteurId: user.id }
      });
      stats.projects = projets;

      // Nombre de dons reçus personnellement
      const donsRecus = await prisma.don.count({
        where: { personnelId: user.id }
      });
      stats.donations = donsRecus;
    }

    return NextResponse.json({ stats });

  } catch (error) {
    console.error("GET /api/user/stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}