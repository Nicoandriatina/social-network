// app/api/enseignant/cv/upload/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const formData = await req.formData();
    const file = formData.get("cv") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Vérifier le type de fichier
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sauvegarder le fichier
    const filename = `cv_${payload.userId}_${Date.now()}.${file.name.split('.').pop()}`;
    const path = join(process.cwd(), "public", "uploads", "cvs", filename);
    await writeFile(path, buffer);

    // TODO: Implémenter l'analyse du CV avec une API d'IA
    // Pour l'instant, on retourne juste le chemin du fichier
    
    return NextResponse.json({ 
      success: true,
      filename,
      message: "CV uploadé avec succès. L'analyse est en cours..."
    });
  } catch (error) {
    console.error("CV upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}