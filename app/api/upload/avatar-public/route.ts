// app/api/upload/avatar-public/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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

    // Générer un nom unique avec timestamp
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

    // Créer le répertoire s'il n'existe pas
    await fs.mkdir(uploadDir, { recursive: true });

    // Sauvegarder le fichier
    const filepath = path.join(uploadDir, filename);
    const buffer = await file.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));

    // URL pour accéder au fichier
    const avatarUrl = `/uploads/avatars/${filename}`;

    console.log("✅ Avatar temporaire uploadé:", avatarUrl);

    return NextResponse.json({ avatarUrl }, { status: 201 });
  } catch (e) {
    console.error("POST /api/upload/avatar-public error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}