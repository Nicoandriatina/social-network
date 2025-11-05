// // app/api/upload/avatar/route.ts
// import { NextResponse } from "next/server";
// import { getAuthUser } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import fs from "fs/promises";
// import path from "path";

// export async function POST(req: Request) {
//   try {
//     const auth = await getAuthUser();
//     if (!auth) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "Pas de fichier" }, { status: 400 });
//     }

//     // Valider le type
//     if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
//       return NextResponse.json({ error: "Type invalide (JPEG, PNG, WebP uniquement)" }, { status: 400 });
//     }

//     // Valider la taille (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       return NextResponse.json({ error: "Fichier trop volumineux (max 5MB)" }, { status: 400 });
//     }

//     // Générer un nom unique
//     const ext = file.name.split(".").pop() || "jpg";
//     const filename = `${auth.id}-${Date.now()}.${ext}`;
//     const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

//     // Créer le répertoire s'il n'existe pas
//     await fs.mkdir(uploadDir, { recursive: true });

//     // Sauvegarder le fichier
//     const filepath = path.join(uploadDir, filename);
//     const buffer = await file.arrayBuffer();
//     await fs.writeFile(filepath, Buffer.from(buffer));

//     // URL pour accéder au fichier
//     const avatarUrl = `/uploads/avatars/${filename}`;

//     // Mettre à jour l'utilisateur
//     await prisma.user.update({
//       where: { id: auth.id },
//       data: { avatar: avatarUrl },
//     });

//     return NextResponse.json({ avatarUrl }, { status: 201 });
//   } catch (e) {
//     console.error("POST /api/upload/avatar error", e);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
// app/api/upload/avatar/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Récupérer l'ancien avatar pour le supprimer
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { avatar: true }
    });

    // Supprimer l'ancien avatar s'il existe et qu'il est sur Cloudinary
    if (user?.avatar && user.avatar.includes('cloudinary.com')) {
      try {
        const publicId = extractPublicId(user.avatar);
        await deleteFromCloudinary(publicId, 'image');
        console.log('✅ Ancien avatar supprimé:', publicId);
      } catch (error) {
        console.error('❌ Erreur suppression ancien avatar:', error);
        // On continue même si la suppression échoue
      }
    }

    // Upload vers Cloudinary
    const result = await uploadToCloudinary(file, 'avatars', 'image') as any;
    
    console.log('✅ Upload Cloudinary réussi:', result.secure_url);

    // Mettre à jour l'utilisateur avec la nouvelle URL
    await prisma.user.update({
      where: { id: auth.id },
      data: { avatar: result.secure_url },
    });

    return NextResponse.json({ 
      avatarUrl: result.secure_url,
      publicId: result.public_id 
    }, { status: 201 });

  } catch (e) {
    console.error("POST /api/upload/avatar error", e);
    return NextResponse.json({ 
      error: "Erreur serveur" 
    }, { status: 500 });
  }
}