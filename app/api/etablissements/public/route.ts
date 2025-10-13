import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const etablissements = await prisma.etablissement.findMany({
      select: {
        id: true,
        nom: true,
        type: true,
        niveau: true,
      },
      orderBy: {
        nom: "asc",
      },
    });

    return NextResponse.json({ etablissements });
  } catch (error) {
    console.error("GET /api/etablissements/public error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}