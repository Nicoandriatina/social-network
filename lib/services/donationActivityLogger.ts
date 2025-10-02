// lib/services/donationActivityLogger.ts
import { prisma } from "@/lib/prisma";

interface LogActivityParams {
  donationId: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
}

export class DonationActivityLogger {
  static async logActivity({
    donationId,
    userId,
    action,
    description,
    metadata = {}
  }: LogActivityParams) {
    try {
      await prisma.donationActivityLog.create({
        data: {
          donationId,
          userId,
          action,
          description,
          metadata
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'activité:', error);
      // Ne pas faire échouer l'opération principale si le log échoue
    }
  }

  // Méthodes spécialisées pour les actions courantes
  static async logDonationCreated(donationId: string, userId: string, donationData: any) {
    const description = `Don "${donationData.libelle}" créé par ${donationData.donateurName}`;
    await this.logActivity({
      donationId,
      userId,
      action: 'CREATED',
      description,
      metadata: {
        type: donationData.type,
        montant: donationData.montant,
        quantite: donationData.quantite,
        destinationType: donationData.destinationType
      }
    });
  }

  static async logStatusUpdate(
    donationId: string, 
    userId: string, 
    oldStatus: string, 
    newStatus: string,
    userFullName: string
  ) {
    const statusLabels = {
      'EN_ATTENTE': 'en attente',
      'ENVOYE': 'envoyé',
      'RECEPTIONNE': 'reçu'
    };

    const description = `Statut mis à jour de "${statusLabels[oldStatus]}" vers "${statusLabels[newStatus]}" par ${userFullName}`;
    
    await this.logActivity({
      donationId,
      userId,
      action: 'STATUS_UPDATED',
      description,
      metadata: {
        oldStatus,
        newStatus,
        updatedBy: userFullName,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async logCommentAdded(
    donationId: string, 
    userId: string, 
    comment: string,
    userFullName: string
  ) {
    const description = `Commentaire ajouté par ${userFullName}`;
    
    await this.logActivity({
      donationId,
      userId,
      action: 'COMMENT_ADDED',
      description,
      metadata: {
        comment: comment.substring(0, 100) + (comment.length > 100 ? '...' : ''),
        commentLength: comment.length,
        addedBy: userFullName
      }
    });
  }

  static async logPhotoAdded(
    donationId: string, 
    userId: string, 
    photoCount: number,
    userFullName: string
  ) {
    const description = `${photoCount} photo${photoCount > 1 ? 's' : ''} ajoutée${photoCount > 1 ? 's' : ''} par ${userFullName}`;
    
    await this.logActivity({
      donationId,
      userId,
      action: 'PHOTO_ADDED',
      description,
      metadata: {
        photoCount,
        addedBy: userFullName
      }
    });
  }

  static async logDonationEdited(
    donationId: string, 
    userId: string, 
    changes: Record<string, any>,
    userFullName: string
  ) {
    const changedFields = Object.keys(changes);
    const description = `Don modifié par ${userFullName} (${changedFields.join(', ')})`;
    
    await this.logActivity({
      donationId,
      userId,
      action: 'EDITED',
      description,
      metadata: {
        changes,
        changedFields,
        editedBy: userFullName
      }
    });
  }

  static async logSystemAction(
    donationId: string, 
    action: string, 
    description: string, 
    metadata: Record<string, any> = {}
  ) {
    // Utiliser un ID système pour les actions automatiques
    const systemUserId = 'system'; // ou créer un utilisateur système dédié
    
    await this.logActivity({
      donationId,
      userId: systemUserId,
      action: `SYSTEM_${action}`,
      description: `[Système] ${description}`,
      metadata: {
        ...metadata,
        automatic: true,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Méthode pour récupérer l'historique d'un don spécifique
  static async getDonationHistory(donationId: string, limit = 50, offset = 0) {
    const activities = await prisma.donationActivityLog.findMany({
      where: { donationId },
      include: {
        user: {
          select: {
            fullName: true,
            type: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const totalCount = await prisma.donationActivityLog.count({
      where: { donationId }
    });

    return {
      activities,
      totalCount,
      hasMore: offset + limit < totalCount
    };
  }

  // Statistiques d'activité
  static async getActivityStats(userId?: string, donationId?: string) {
    let whereCondition: any = {};
    
    if (userId) {
      whereCondition.userId = userId;
    }
    
    if (donationId) {
      whereCondition.donationId = donationId;
    }

    const stats = await prisma.donationActivityLog.groupBy({
      by: ['action'],
      where: whereCondition,
      _count: {
        action: true
      },
      orderBy: {
        _count: {
          action: 'desc'
        }
      }
    });

    const totalActivities = await prisma.donationActivityLog.count({
      where: whereCondition
    });

    // Activités récentes (dernières 24h)
    const recentActivities = await prisma.donationActivityLog.count({
      where: {
        ...whereCondition,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    return {
      actionBreakdown: stats.map(stat => ({
        action: stat.action,
        count: stat._count.action
      })),
      totalActivities,
      recentActivities
    };
  }
}

// Hook pour utiliser le logger côté client
export const useDonationActivityLogger = () => {
  const logActivity = async (params: Omit<LogActivityParams, 'userId'>) => {
    try {
      const response = await fetch('/api/donations/activity-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement de l\'activité');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur logging activité:', error);
      throw error;
    }
  };

  return { logActivity };
};