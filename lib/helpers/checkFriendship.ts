// lib/helpers/checkFriendship.ts
import { prisma } from "@/lib/prisma";

/**
 * Vérifie si deux utilisateurs sont amis
 * @param userId1 - ID du premier utilisateur
 * @param userId2 - ID du deuxième utilisateur
 * @returns true si amis, false sinon
 */
export async function checkFriendship(userId1: string, userId2: string): Promise<boolean> {
  // Si c'est le même utilisateur, toujours vrai
  if (userId1 === userId2) {
    return true;
  }

  try {
    // Chercher dans FriendRequest avec fromId/toId et accepted=true
    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { fromId: userId1, toId: userId2, accepted: true },
          { fromId: userId2, toId: userId1, accepted: true }
        ]
      }
    });

    return !!friendRequest;

  } catch (error) {
    console.error('Erreur lors de la vérification de l\'amitié:', error);
    // En cas d'erreur, on considère que ce n'est PAS ami (plus sécurisé)
    return false;
  }
}

/**
 * Récupère les informations du statut d'amitié entre deux utilisateurs
 */
export async function getFriendshipStatus(userId1: string, userId2: string): Promise<{
  areFriends: boolean;
  hasPendingRequest: boolean;
  requestSentBy?: string;
}> {
  if (userId1 === userId2) {
    return { areFriends: true, hasPendingRequest: false };
  }

  try {
    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { fromId: userId1, toId: userId2 },
          { fromId: userId2, toId: userId1 }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!friendRequest) {
      return { areFriends: false, hasPendingRequest: false };
    }

    return {
      areFriends: friendRequest.accepted,
      hasPendingRequest: !friendRequest.accepted,
      requestSentBy: friendRequest.fromId
    };

  } catch (error) {
    console.error('Erreur lors de la récupération du statut d\'amitié:', error);
    return { areFriends: false, hasPendingRequest: false };
  }
}