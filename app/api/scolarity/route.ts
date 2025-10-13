// app/api/scholarity/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { etablissementId, years } = body;

    if (!etablissementId || !years || !Array.isArray(years)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const etab = await prisma.etablissement.findUnique({
      where: { id: etablissementId },
    });

    if (!etab) {
      return NextResponse.json({ error: "Établissement non trouvé" }, { status: 404 });
    }

    const scholarity = await prisma.scolarityHistory.upsert({
      where: {
        userId_etablissementId: { userId: auth.id, etablissementId },
      },
      update: { years },
      create: { userId: auth.id, etablissementId, years },
    });

    return NextResponse.json({ scholarity }, { status: 201 });
  } catch (e) {
    console.error("POST /api/scholarity error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const histories = await prisma.scolarityHistory.findMany({
      where: { userId: auth.id },
      include: {
        etablissement: {
          select: {
            id: true,
            nom: true,
            type: true,
            niveau: true,
          },
        },
      },
    });

    return NextResponse.json({ histories });
  } catch (e) {
    console.error("GET /api/scholarity error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}