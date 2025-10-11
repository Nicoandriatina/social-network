
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function areFriends(userId1: string, userId2: string): Promise<boolean> {
  const friendship = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { fromId: userId1, toId: userId2, accepted: true },
        { fromId: userId2, toId: userId1, accepted: true }
      ]
    }
  });

  return !!friendship;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // ✅ Await params avant de l'utiliser
    const { userId: otherUserId } = await params;

    // Vérifier que les utilisateurs sont amis
    const friends = await areFriends(auth.id, otherUserId);
    if (!friends) {
      return NextResponse.json(
        { error: 'Vous ne pouvez voir les messages que de vos amis' }, 
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromId: auth.id, toId: otherUserId },
          { fromId: otherUserId, toId: auth.id }
        ]
      },
      include: {
        from: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        sentAt: 'asc'
      },
      take: 50
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}