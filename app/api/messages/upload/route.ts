import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Fichier trop volumineux (max 10MB)' 
      }, { status: 400 });
    }

    // Types de fichiers autorisés
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Type de fichier non autorisé' 
      }, { status: 400 });
    }

    // Déterminer le type de message et dossier
    const isImage = file.type.startsWith('image/');
    const messageType = isImage ? 'IMAGE' : 'FILE';
    const folder = isImage ? 'messages/images' : 'messages/files';
    const resourceType = isImage ? 'image' : 'raw';

    console.log('📤 Upload vers Cloudinary:', {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      messageType,
      resourceType,
      folder
    });

    // Upload vers Cloudinary en utilisant votre fonction existante
    const result = await uploadToCloudinary(file, folder, resourceType) as any;
    
    console.log('✅ Upload Cloudinary réussi:', {
      url: result.secure_url,
      publicId: result.public_id
    });

    return NextResponse.json({
      success: true,
      fileUrl: result.secure_url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      publicId: result.public_id,
      messageType
    });

  } catch (error) {
    console.error('❌ Erreur upload Cloudinary:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'upload' 
    }, { status: 500 });
  }
}