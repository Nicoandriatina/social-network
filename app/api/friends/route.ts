import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET /api/friends - Liste des amis
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const friendships = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { fromId: auth.id, accepted: true },
          { toId: auth.id, accepted: true }
        ]
      },
      include: {
        from: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            type: true,
            telephone: true,
            email: true,
            facebook: true,
            twitter: true,
            whatsapp: true
          }
        },
        to: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            type: true,
            telephone: true,
            email: true,
            facebook: true,
            twitter: true,
            whatsapp: true
          }
        }
      }
    });

    const friends = friendships.map(f => 
      f.fromId === auth.id ? f.to : f.from
    );

    return NextResponse.json({ friends });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}