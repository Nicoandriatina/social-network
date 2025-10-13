// app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const currentUser = await getAuthUser();

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        etablissement: true,
        enseignant: true,
        donateur: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Vérifier si amis
    let isFriend = false;
    let friendRequestPending = false;

    if (currentUser && currentUser.id !== id) {
      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { fromId: currentUser.id, toId: id, accepted: true },
            { fromId: id, toId: currentUser.id, accepted: true },
          ],
        },
      });

      if (friendRequest) {
        isFriend = true;
      }

      const pending = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { fromId: currentUser.id, toId: id, accepted: false },
            { fromId: id, toId: currentUser.id, accepted: false },
          ],
        },
      });

      if (pending) {
        friendRequestPending = true;
      }
    }

    const maskContactInfo = (value: string | null | undefined): string | null => {
      if (!value) return null;
      return "XXXX";
    };

    const showFullInfo = currentUser?.id === id || isFriend;

    const user = {
      id: targetUser.id,
      nom: targetUser.fullName ?? "",
      email: showFullInfo ? targetUser.email : maskContactInfo(targetUser.email),
      role: targetUser.role,
      typeProfil: targetUser.type,
      avatar: targetUser.avatar ?? null,
      telephone: showFullInfo ? targetUser.telephone : maskContactInfo(targetUser.telephone),
      facebook: showFullInfo ? targetUser.facebook : null,
      twitter: showFullInfo ? targetUser.twitter : null,
      whatsapp: showFullInfo ? targetUser.whatsapp : maskContactInfo(targetUser.whatsapp),
      adressePostale: showFullInfo ? targetUser.adressePostale : null,
      secteur: targetUser.secteur ?? null,
      profession: targetUser.profession ?? null,
      isFriend,
      friendRequestPending,
      isOwnProfile: currentUser?.id === id,

      etablissement: targetUser.etablissement
        ? {
            id: targetUser.etablissement.id,
            nom: targetUser.etablissement.nom ?? "",
            type: targetUser.etablissement.type ?? "",
            adresse: showFullInfo ? targetUser.etablissement.adresse : null,
            niveau: targetUser.etablissement.niveau ?? null,
          }
        : null,

      enseignant: targetUser.enseignant
        ? {
            id: targetUser.enseignant.id,
            school: targetUser.enseignant.school ?? null,
            position: targetUser.enseignant.position ?? null,
            experience: showFullInfo ? targetUser.enseignant.experience : null,
            degree: showFullInfo ? targetUser.enseignant.degree : null,
            validated: targetUser.enseignant.validated ?? false,
          }
        : null,

      donateur: targetUser.donateur
        ? {
            id: targetUser.donateur.id,
            donorType: targetUser.donateur.donorType ?? null,
            sector: targetUser.donateur.sector ?? null,
          }
        : null,
    };

    return NextResponse.json({ user });
  } catch (e) {
    console.error("GET /api/user/[id] error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}