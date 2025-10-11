
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { notifyFriendRequest } from '@/lib/notifications';
import { emitSocketNotification } from '@/lib/emit-socket-notification';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { toUserId } = await request.json();

    if (auth.id === toUserId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas vous ajouter vous-même' }, 
        { status: 400 }
      );
    }

    // Vérifier si une demande existe déjà
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { fromId: auth.id, toId: toUserId },
          { fromId: toUserId, toId: auth.id }
        ]
      }
    });

    if (existingRequest) {
      if (existingRequest.accepted) {
        return NextResponse.json(
          { error: 'Vous êtes déjà amis' }, 
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Une demande est déjà en cours' }, 
        { status: 400 }
      );
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        fromId: auth.id,
        toId: toUserId
      },
      include: {
        from: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            type: true
          }
        }
      }
    });

    // 🔔 NOTIFICATION TEMPS RÉEL
    try {
      const notification = await notifyFriendRequest({
        friendRequestId: friendRequest.id,
        fromUserId: auth.id,
        toUserId: toUserId
      });

      if (notification) {
        await emitSocketNotification(notification.id);
      }
    } catch (notifError) {
      console.error('Erreur notification:', notifError);
      // On continue même si la notification échoue
    }

    return NextResponse.json({ 
      message: 'Demande envoyée',
      friendRequest 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}