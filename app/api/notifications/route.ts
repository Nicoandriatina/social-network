// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { getAuthUser } from '@/lib/auth';

// // GET - Récupérer les notifications
// export async function GET(request: NextRequest) {
//   try {
//     const auth = await getAuthUser();
    
//     if (!auth) {
//       return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
//     }

//     const notifications = await prisma.notification.findMany({
//       where: {
//         userId: auth.id
//       },
//       orderBy: {
//         createdAt: 'desc'
//       },
//       take: 20
//     });

//     const unreadCount = await prisma.notification.count({
//       where: {
//         userId: auth.id,
//         read: false
//       }
//     });

//     return NextResponse.json({ 
//       notifications,
//       unreadCount 
//     });
//   } catch (error) {
//     console.error('Erreur:', error);
//     return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
//   }
// }

// // PATCH - Marquer comme lu
// export async function PATCH(request: NextRequest) {
//   try {
//     const auth = await getAuthUser();
    
//     if (!auth) {
//       return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
//     }

//     const { notificationIds } = await request.json();

//     await prisma.notification.updateMany({
//       where: {
//         id: { in: notificationIds },
//         userId: auth.id
//       },
//       data: {
//         read: true
//       }
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Erreur:', error);
//     return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
//   }
// }

// // DELETE - Marquer toutes comme lues
// export async function DELETE(request: NextRequest) {
//   try {
//     const auth = await getAuthUser();
    
//     if (!auth) {
//       return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
//     }

//     await prisma.notification.updateMany({
//       where: {
//         userId: auth.id,
//         read: false
//       },
//       data: {
//         read: true
//       }
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Erreur:', error);
//     return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
//   }
// }

// ==========================================
// API NOTIFICATIONS - app/api/notifications/route.ts
// ==========================================

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET - Récupérer toutes les notifications de l'utilisateur
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const whereCondition: any = { userId: payload.userId };
    if (unreadOnly) {
      whereCondition.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereCondition,
      include: {
        relatedUser: {
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
            reference: true
          }
        },
        don: {
          select: {
            id: true,
            libelle: true,
            type: true
          }
        },
        message: {
          select: {
            id: true,
            content: true
          }
        },
        friendRequest: {
          select: {
            id: true,
            fromId: true,
            toId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Compter les non lues
    const unreadCount = await prisma.notification.count({
      where: {
        userId: payload.userId,
        read: false
      }
    });

    return NextResponse.json({ 
      notifications,
      unreadCount 
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Créer une notification manuelle (pour tests ou cas spéciaux)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const body = await req.json();
    const { userId, type, title, content, relatedUserId, projectId, donId } = body;

    if (!userId || !type || !title || !content) {
      return NextResponse.json({ 
        error: "Champs requis: userId, type, title, content" 
      }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        relatedUserId: relatedUserId || payload.userId,
        projectId,
        donId
      }
    });

    return NextResponse.json({ 
      notification,
      message: "Notification créée avec succès" 
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
