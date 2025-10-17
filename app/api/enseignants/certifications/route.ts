// app/api/enseignant/certifications/route.ts
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
    
    const certifications = await prisma.certification.findMany({
      where: { enseignantId: payload.userId },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ certifications });
  } catch (error) {
    console.error("GET certifications error:", error);
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

    const certification = await prisma.certification.create({
      data: {
        enseignantId: payload.userId,
        titre: body.titre,
        organisme: body.organisme,
        date: new Date(body.date),
        lien: body.lien || null
      }
    });

    return NextResponse.json({ certification });
  } catch (error) {
    console.error("POST certification error:", error);
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

    const existing = await prisma.certification.findFirst({
      where: { id, enseignantId: payload.userId }
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.certification.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE certification error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
