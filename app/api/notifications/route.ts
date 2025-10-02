import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET - Récupérer les notifications
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: auth.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: auth.id,
        read: false
      }
    });

    return NextResponse.json({ 
      notifications,
      unreadCount 
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH - Marquer comme lu
export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { notificationIds } = await request.json();

    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: auth.id
      },
      data: {
        read: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Marquer toutes comme lues
export async function DELETE(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        userId: auth.id,
        read: false
      },
      data: {
        read: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}