import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { messageId } = await params;

    // Récupérer le message pour vérifier les permissions et les fichiers
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        fromId: true,
        publicId: true,
        mimeType: true,
        type: true
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    }

    // Vérifier que c'est l'expéditeur qui supprime
    if (message.fromId !== auth.id) {
      return NextResponse.json({ 
        error: 'Vous ne pouvez supprimer que vos propres messages' 
      }, { status: 403 });
    }

    // Si le message contient un fichier Cloudinary, le supprimer
    if (message.publicId) {
      try {
        // Déterminer le type de ressource
        const resourceType = message.mimeType?.startsWith('image/') ? 'image' : 'raw';
        
        await deleteFromCloudinary(message.publicId, resourceType);
        console.log('✅ Fichier Cloudinary supprimé:', message.publicId);
      } catch (error) {
        console.error('❌ Erreur suppression Cloudinary:', error);
        // On continue même si la suppression du fichier échoue
      }
    }

    // Supprimer le message de la base de données
    await prisma.message.delete({
      where: { id: messageId }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Message supprimé avec succès' 
    });

  } catch (error) {
    console.error('Erreur suppression message:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}