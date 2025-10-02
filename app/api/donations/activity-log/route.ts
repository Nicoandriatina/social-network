// app/api/donations/activity-log/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Récupérer l'historique des actions sur les dons
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

    const { searchParams } = new URL(req.url);
    const donationId = searchParams.get('donationId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereCondition: any = {};

    // Si un donationId spécifique est demandé
    if (donationId) {
      whereCondition.donationId = donationId;
    } else {
      // Sinon, récupérer selon le type d'utilisateur
      if (payload.type === "ETABLISSEMENT") {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          include: { etablissement: true }
        });

        if (user?.etablissement) {
          // Actions sur les dons reçus par l'établissement
          whereCondition.donation = {
            OR: [
              { etablissementId: user.etablissement.id },
              { project: { etablissementId: user.etablissement.id } }
            ]
          };
        }
      } else if (payload.type === "ENSEIGNANT") {
        whereCondition.donation = {
          personnelId: payload.userId
        };
      } else if (payload.type === "DONATEUR") {
        whereCondition.donation = {
          donateurId: payload.userId
        };
      }
    }

    const activities = await prisma.donationActivityLog.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            type: true,
            avatar: true
          }
        },
        donation: {
          select: {
            id: true,
            libelle: true,
            type: true,
            montant: true,
            statut: true,
            donateur: {
              select: {
                fullName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    const totalCount = await prisma.donationActivityLog.count({
      where: whereCondition
    });

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      description: activity.description,
      metadata: activity.metadata,
      createdAt: activity.createdAt.toISOString(),
      user: {
        id: activity.user.id,
        fullName: activity.user.fullName,
        type: activity.user.type,
        avatar: activity.user.avatar
      },
      donation: {
        id: activity.donation.id,
        libelle: activity.donation.libelle,
        type: activity.donation.type,
        montant: activity.donation.montant,
        statut: activity.donation.statut,
        donateurName: activity.donation.donateur.fullName
      }
    }));

    return NextResponse.json({
      activities: formattedActivities,
      totalCount,
      hasMore: offset + limit < totalCount
    });

  } catch (error) {
    console.error("GET /api/donations/activity-log error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Créer une nouvelle entrée d'activité
export async function POST(req: Request) {
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

    const body = await req.json();
    const { donationId, action, description, metadata = {} } = body;

    if (!donationId || !action || !description) {
      return NextResponse.json({ 
        error: "donationId, action et description sont obligatoires" 
      }, { status: 400 });
    }

    // Vérifier que la donation existe et que l'utilisateur a les droits
    const donation = await prisma.don.findUnique({
      where: { id: donationId },
      include: {
        project: {
          select: {
            etablissementId: true
          }
        },
        beneficiaireEtab: {
          select: {
            admin: {
              select: { id: true }
            }
          }
        }
      }
    });

    if (!donation) {
      return NextResponse.json({ error: "Don non trouvé" }, { status: 404 });
    }

    // Vérifier les permissions
    let hasPermission = false;
    if (donation.donateurId === payload.userId) {
      hasPermission = true;
    } else if (donation.personnelId === payload.userId) {
      hasPermission = true;
    } else if (donation.project && payload.type === "ETABLISSEMENT") {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { etablissement: true }
      });
      hasPermission = user?.etablissement?.id === donation.project.etablissementId;
    }

    if (!hasPermission) {
      return NextResponse.json({ 
        error: "Vous n'avez pas les permissions pour cette action" 
      }, { status: 403 });
    }

    const activity = await prisma.donationActivityLog.create({
      data: {
        donationId,
        userId: payload.userId,
        action,
        description,
        metadata
      },
      include: {
        user: {
          select: {
            fullName: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Activité enregistrée avec succès",
      activity
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/donations/activity-log error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}