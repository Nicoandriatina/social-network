// app/api/enseignant/formations/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const formations = await prisma.formation.findMany({
      where: { enseignantId: payload.userId },
      orderBy: { annee: 'desc' }
    });

    return NextResponse.json({ formations });
  } catch (error) {
    console.error("GET formations error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const body = await req.json();

    const formation = await prisma.formation.create({
      data: {
        enseignantId: payload.userId,
        diplome: body.diplome,
        etablissement: body.etablissement,
        annee: body.annee,
        description: body.description || null
      }
    });

    return NextResponse.json({ formation });
  } catch (error) {
    console.error("POST formation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const existing = await prisma.formation.findFirst({
      where: { id, enseignantId: payload.userId }
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.formation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE formation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}