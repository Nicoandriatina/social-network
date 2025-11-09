// app/api/upload/avatar-public/route.ts
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Pas de fichier" }, { status: 400 });
    }

    // Valider le type
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return NextResponse.json({ 
        error: "Type invalide (JPEG, PNG, WebP, GIF uniquement)" 
      }, { status: 400 });
    }

    // Valider la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "Fichier trop volumineux (max 5MB)" 
      }, { status: 400 });
    }

    // Upload vers Cloudinary (dossier temporaire pour les avatars non authentifiés)
    const result = await uploadToCloudinary(file, 'avatars/temp', 'image') as any;
    
    console.log('✅ Avatar temporaire uploadé sur Cloudinary:', result.secure_url);

    return NextResponse.json({ 
      avatarUrl: result.secure_url,
      publicId: result.public_id 
    }, { status: 201 });

  } catch (e) {
    console.error("POST /api/upload/avatar-public error", e);
    return NextResponse.json({ 
      error: "Erreur serveur" 
    }, { status: 500 });
  }
}