import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// PUT /api/friends/[requestId] - Accepter
export async function PUT(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { requestId } = params;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!friendRequest) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
    }

    if (friendRequest.toId !== auth.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { accepted: true },
      include: {
        from: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Demande acceptée',
      friend: updatedRequest.from 
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE /api/friends/[requestId] - Refuser
export async function DELETE(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { requestId } = params;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!friendRequest) {
      return NextResponse.json({ error: 'Demande non trouvée' }, { status: 404 });
    }

    if (friendRequest.toId !== auth.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await prisma.friendRequest.delete({
      where: { id: requestId }
    });

    return NextResponse.json({ message: 'Demande refusée' });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}