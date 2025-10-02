import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromId: auth.id },
          { toId: auth.id }
        ]
      },
      include: {
        from: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            type: true
          }
        },
        to: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            type: true
          }
        }
      },
      orderBy: {
        sentAt: 'desc'
      }
    });

    // Grouper par conversation
    const conversationsMap = new Map();

    messages.forEach(message => {
      const otherUserId = message.fromId === auth.id ? message.toId : message.fromId;
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: message.fromId === auth.id ? message.to : message.from,
          lastMessage: message,
          unreadCount: 0
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}