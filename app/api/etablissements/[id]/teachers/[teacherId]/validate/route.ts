import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; teacherId: string }> }
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: etabId, teacherId } = await params;

    // ✅ Vérifier que l'utilisateur est un ETABLISSEMENT
    if (auth.type !== "ETABLISSEMENT") {
      console.log("❌ ERREUR: type n'est pas ETABLISSEMENT");
      return NextResponse.json({ error: "Accès réservé aux établissements" }, { status: 403 });
    }

    // ✅ Vérifier que l'établissement valide ses propres enseignants
    const userEtab = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { etablissementId: true }
    });

    console.log("5️⃣ User etablissementId:", userEtab?.etablissementId);

    if (!userEtab || userEtab.etablissementId !== etabId) {
      console.log("❌ ERREUR: Établissement non autorisé");
      return NextResponse.json({ error: "Vous ne pouvez valider que les enseignants de votre établissement" }, { status: 403 });
    }

    // Récupérer l'enseignant et vérifier qu'il est de l'établissement
    const enseignant = await prisma.enseignant.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });
    if (!enseignant) {
      return NextResponse.json({ error: "Enseignant non trouvé" }, { status: 404 });
    }

    if (enseignant.user.etablissementId !== etabId) {
      console.log("❌ ERREUR: L'enseignant n'appartient pas à cet établissement");
      return NextResponse.json({ error: "Cet enseignant n'appartient pas à votre établissement" }, { status: 403 });
    }

    // Valider l'enseignant
    const updated = await prisma.enseignant.update({
      where: { id: teacherId },
      data: { validated: true },
    });

    console.log("Enseignant validé avec succès");

    // Créer une notification
    const admin = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { fullName: true },
    });

    await prisma.notification.create({
      data: {
        userId: enseignant.userId,
        type: "PROJECT_PUBLISHED",
        title: "Profil validé",
        content: `${admin?.fullName || 'Votre établissement'} a validé votre profil d'enseignant`,
        relatedUserId: auth.id,
      },
    });

    console.log(" Notification créée");

    return NextResponse.json({ enseignant: updated });
  } catch (e) {
    console.error("❌ PATCH /api/etablissements/[id]/teachers/[teacherId]/validate error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}