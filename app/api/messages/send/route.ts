// app/api/messages/send/route.ts
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

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      toId, 
      content,
      type,
      fileUrl,
      fileName,
      fileSize,
      mimeType,
      publicId
    } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Le message ne peut pas être vide' }, 
        { status: 400 }
      );
    }

    // Vérifier que les utilisateurs sont amis
    const friends = await areFriends(auth.id, toId);
    if (!friends) {
      return NextResponse.json(
        { error: 'Vous ne pouvez envoyer des messages qu\'à vos amis' }, 
        { status: 403 }
      );
    }

    // Créer le message - N'inclure les champs que s'ils existent dans le schéma
    const messageData: any = {
      fromId: auth.id,
      toId,
      content: content.trim()
    };

    // Ajouter les champs optionnels seulement s'ils sont fournis et si le schéma les supporte
    if (type) messageData.type = type;
    if (fileUrl) messageData.fileUrl = fileUrl;
    if (fileName) messageData.fileName = fileName;
    if (fileSize) messageData.fileSize = fileSize;
    if (mimeType) messageData.mimeType = mimeType;
    if (publicId) messageData.publicId = publicId;

    const message = await prisma.message.create({
      data: messageData,
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

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}