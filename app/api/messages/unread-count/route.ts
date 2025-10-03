import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const count = await prisma.message.count({
      where: {
        toId: auth.id,
        read: false
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Erreur comptage messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}