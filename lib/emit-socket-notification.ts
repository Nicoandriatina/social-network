// ==========================================
// lib/emit-socket-notification.ts
// Helper pour émettre une notification via Socket.IO depuis les APIs
// ==========================================

import { prisma } from './prisma';

// Type pour Socket.IO server (défini dans server.js)
declare global {
  var io: any;
}

export async function emitSocketNotification(notificationId: string) {
  try {
    // Vérifier que Socket.IO est disponible
    if (!global.io) {
      console.warn('⚠️ Socket.IO non disponible, notification créée mais non émise');
      return;
    }

    // Récupérer la notification complète
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
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
        },
        don: {
          select: {
            id: true,
            libelle: true,
            type: true
          }
        }
      }
    });

    if (!notification) {
      console.error('❌ Notification introuvable:', notificationId);
      return;
    }

    // Émettre via Socket.IO
    global.io.to(notification.userId).emit('new-notification', notification);
    console.log(`🔔 Notification Socket.IO émise pour user ${notification.userId}`);
    
    return notification;
  } catch (error) {
    console.error('❌ Erreur émission Socket.IO:', error);
  }
}
