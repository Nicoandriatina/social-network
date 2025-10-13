import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const donations = await prisma.don.findMany({
      where: { etablissementId: params.id },
      select: {
        id: true,
        libelle: true,
        type: true,
        quantite: true,
        montant: true,
        statut: true,
        dateEnvoi: true,
        dateReception: true,
      },
      orderBy: { dateEnvoi: "desc" },
    });

    return NextResponse.json({ donations });
  } catch (e) {
    console.error("GET /api/etablissement/[id]/donations error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}