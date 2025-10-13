import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projects = await prisma.project.findMany({
      where: { etablissementId: params.id },
      select: {
        id: true,
        titre: true,
        description: true,
        reference: true,
        photos: true,
        categorie: true,
        datePublication: true,
      },
      orderBy: { datePublication: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (e) {
    console.error("GET /api/etablissement/[id]/projects error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}