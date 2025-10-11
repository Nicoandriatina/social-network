
// ==========================================
// HELPER NOTIFICATIONS - lib/socket-notifications.ts
// Utilise votre Socket.IO existant
// ==========================================

import { prisma } from './prisma';
import { NotificationType } from '@prisma/client';

// Fonction pour récupérer l'instance Socket.IO depuis le serveur
// Pas besoin de l'importer, on va émettre depuis les APIs
export async function emitNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  relatedUserId?: string;
  projectId?: string;
  donId?: string;
  messageId?: string;
  friendRequestId?: string;
}) {
  try {
    // Créer la notification en base de données
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        content: data.content,
        relatedUserId: data.relatedUserId,
        projectId: data.projectId,
        donId: data.donId,
        messageId: data.messageId,
        friendRequestId: data.friendRequestId,
        read: false
      },
      include: {
        relatedUser: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            titre: true,
            reference: true
          }
        }
      }
    });

    console.log(`🔔 Notification créée pour user ${data.userId}`);
    
    // L'émission Socket.IO se fera dans le serveur.js
    // On retourne juste la notification pour que le serveur l'émette
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

// ==========================================
// FONCTIONS SPÉCIFIQUES PAR TYPE DE NOTIFICATION
// ==========================================

// Notification pour nouveau don
export async function notifyDonationReceived({
  donId,
  donorUserId,
  recipientUserId,
  donationType,
  projectTitle
}: {
  donId: string;
  donorUserId: string;
  recipientUserId: string;
  donationType: string;
  projectTitle?: string;
}) {
  const donor = await prisma.user.findUnique({
    where: { id: donorUserId },
    select: { fullName: true }
  });

  const projectText = projectTitle ? ` pour le projet "${projectTitle}"` : "";

  return emitNotification({
    userId: recipientUserId,
    type: "DONATION_RECEIVED",
    title: "Nouveau don reçu",
    content: `${donor?.fullName} a fait un don de type ${donationType}${projectText}`,
    relatedUserId: donorUserId,
    donId
  });
}

// Notification pour demande d'ami
export async function notifyFriendRequest({
  friendRequestId,
  fromUserId,
  toUserId
}: {
  friendRequestId: string;
  fromUserId: string;
  toUserId: string;
}) {
  const requester = await prisma.user.findUnique({
    where: { id: fromUserId },
    select: { fullName: true }
  });

  return emitNotification({
    userId: toUserId,
    type: "FRIEND_REQUEST",
    title: "Nouvelle demande d'ami",
    content: `${requester?.fullName} vous a envoyé une demande d'ami`,
    relatedUserId: fromUserId,
    friendRequestId
  });
}

// Notification pour acceptation d'ami
export async function notifyFriendAccept({
  friendRequestId,
  accepterUserId,
  requesterUserId
}: {
  friendRequestId: string;
  accepterUserId: string;
  requesterUserId: string;
}) {
  const accepter = await prisma.user.findUnique({
    where: { id: accepterUserId },
    select: { fullName: true }
  });

  return emitNotification({
    userId: requesterUserId,
    type: "FRIEND_ACCEPT",
    title: "Demande d'ami acceptée",
    content: `${accepter?.fullName} a accepté votre demande d'ami`,
    relatedUserId: accepterUserId,
    friendRequestId
  });
}

// Notification pour commentaire sur projet
export async function notifyProjectComment({
  projectId,
  commenterUserId,
  projectAuthorId,
  projectTitle
}: {
  projectId: string;
  commenterUserId: string;
  projectAuthorId: string;
  projectTitle: string;
}) {
  if (commenterUserId === projectAuthorId) return null;

  const commenter = await prisma.user.findUnique({
    where: { id: commenterUserId },
    select: { fullName: true }
  });

  return emitNotification({
    userId: projectAuthorId,
    type: "PROJECT_COMMENT",
    title: "Nouveau commentaire",
    content: `${commenter?.fullName} a commenté votre projet "${projectTitle}"`,
    relatedUserId: commenterUserId,
    projectId
  });
}

// Notification pour like sur projet
export async function notifyProjectLike({
  projectId,
  likerUserId,
  projectAuthorId,
  projectTitle
}: {
  projectId: string;
  likerUserId: string;
  projectAuthorId: string;
  projectTitle: string;
}) {
  if (likerUserId === projectAuthorId) return null;

  const liker = await prisma.user.findUnique({
    where: { id: likerUserId },
    select: { fullName: true }
  });

  return emitNotification({
    userId: projectAuthorId,
    type: "PROJECT_COMMENT", // Ou créez PROJECT_LIKE dans votre enum
    title: "Nouveau like",
    content: `${liker?.fullName} a aimé votre projet "${projectTitle}"`,
    relatedUserId: likerUserId,
    projectId
  });
}

// Notification pour projet publié (aux membres de l'établissement)
export async function notifyProjectPublished({
  projectId,
  projectTitle,
  etablissementId
}: {
  projectId: string;
  projectTitle: string;
  etablissementId: string;
}) {
  // Notifier les membres de l'établissement
  const members = await prisma.user.findMany({
    where: { etablissementId },
    select: { id: true }
  });

  const notifications = members.map(member => 
    emitNotification({
      userId: member.id,
      type: "PROJECT_PUBLISHED",
      title: "Nouveau projet publié",
      content: `Un nouveau projet "${projectTitle}" a été publié`,
      projectId
    })
  );

  return Promise.all(notifications);
}