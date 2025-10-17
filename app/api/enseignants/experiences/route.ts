// app/api/enseignant/experiences/route.ts
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
    
    const experiences = await prisma.experience.findMany({
      where: { enseignantId: payload.userId },
      orderBy: { debut: 'desc' }
    });

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("GET experiences error:", error);
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

    const experience = await prisma.experience.create({
      data: {
        enseignantId: payload.userId,
        poste: body.poste,
        etablissement: body.etablissement,
        debut: new Date(body.debut),
        fin: body.fin ? new Date(body.fin) : null,
        enCours: body.enCours || false,
        description: body.description || ""
      }
    });

    return NextResponse.json({ experience });
  } catch (error) {
    console.error("POST experience error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const body = await req.json();

    // Vérifier que l'expérience appartient bien à l'utilisateur
    const existing = await prisma.experience.findFirst({
      where: { id: body.id, enseignantId: payload.userId }
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const experience = await prisma.experience.update({
      where: { id: body.id },
      data: {
        poste: body.poste,
        etablissement: body.etablissement,
        debut: body.debut ? new Date(body.debut) : undefined,
        fin: body.fin ? new Date(body.fin) : null,
        enCours: body.enCours,
        description: body.description
      }
    });

    return NextResponse.json({ experience });
  } catch (error) {
    console.error("PATCH experience error:", error);
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

    // Vérifier que l'expérience appartient bien à l'utilisateur
    const existing = await prisma.experience.findFirst({
      where: { id, enseignantId: payload.userId }
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.experience.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE experience error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
