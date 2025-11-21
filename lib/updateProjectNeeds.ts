// lib/updateProjectNeeds.ts - VERSION FINALE
import { prisma } from "@/lib/prisma";

/**
 * Met à jour les statistiques d'un besoin spécifique
 * ✅ Gestion spéciale pour le besoin MONETAIRE avec budget disponible
 */
export async function updateNeedProgress(needId: string) {
  try {
    const need = await prisma.projectNeed.findUnique({
      where: { id: needId },
      include: {
        project: {
          select: {
            id: true,
            budgetDisponible: true
          }
        },
        dons: {
          where: {
            statut: 'RECEPTIONNE'
          }
        }
      }
    });

    if (!need) {
      console.error(`❌ Besoin ${needId} non trouvé`);
      return null;
    }

    let montantRecu = 0;
    let quantiteRecue = 0;
    let pourcentage = 0;

    if (need.type === 'MONETAIRE') {
      // ✅ Calcul spécial pour MONETAIRE
      
      // 1. Somme des dons monétaires reçus
      montantRecu = need.dons.reduce((sum, don) => sum + (don.montant || 0), 0);
      
      // 2. Si c'est le besoin monétaire principal du projet
      if (need.budgetInclusDansCalcul && need.project.budgetDisponible !== null) {
        // Budget total disponible = Budget initial + Dons reçus
        const budgetTotal = need.project.budgetDisponible + montantRecu;
        
        // Pourcentage basé sur l'objectif du projet
        if (need.montantCible && need.montantCible > 0) {
          pourcentage = (budgetTotal / need.montantCible) * 100;
        }
        
        console.log(`💰 Besoin monétaire principal: Budget initial ${need.project.budgetDisponible} + Dons ${montantRecu} = ${budgetTotal} / ${need.montantCible}`);
      } else {
        // Besoin monétaire secondaire (sans budget disponible)
        if (need.montantCible && need.montantCible > 0) {
          pourcentage = (montantRecu / need.montantCible) * 100;
        }
      }
    } else {
      // MATERIEL ou VIVRES - Calcul standard
      quantiteRecue = need.dons.reduce((sum, don) => {
        if (don.items && Array.isArray(don.items)) {
          const itemsTotal = (don.items as any[]).reduce((itemSum, item) => 
            itemSum + (item.quantity || 0), 0
          );
          return sum + itemsTotal;
        }
        return sum + (don.quantite || 0);
      }, 0);
      
      if (need.quantiteCible && need.quantiteCible > 0) {
        pourcentage = (quantiteRecue / need.quantiteCible) * 100;
      }
    }

    // Déterminer le statut
    let statut: 'EN_COURS' | 'TERMINE' | 'ANNULE' = need.statut as any;
    if (pourcentage >= 100) {
      statut = 'TERMINE';
    } else if (pourcentage > 0 && need.statut !== 'ANNULE') {
      statut = 'EN_COURS';
    }

    const updatedNeed = await prisma.projectNeed.update({
      where: { id: needId },
      data: {
        montantRecu,
        quantiteRecue,
        pourcentage: Math.min(pourcentage, 100),
        statut
      }
    });

    console.log(`✅ Besoin "${need.titre}" mis à jour: ${pourcentage.toFixed(1)}% complété`);
    return updatedNeed;
    
  } catch (error) {
    console.error(`❌ Erreur mise à jour besoin ${needId}:`, error);
    throw error;
  }
}

/**
 * ✅ Calcule la progression globale du projet
 * Moyenne de tous les besoins actifs
 */
export async function calculateGlobalProgress(projectId: string): Promise<number> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        besoins: {
          where: {
            statut: {
              not: 'ANNULE'
            }
          }
        }
      }
    });

    if (!project || project.besoins.length === 0) {
      return 0;
    }

    // Moyenne de tous les pourcentages
    const totalPourcentage = project.besoins.reduce((sum, need) => {
      return sum + (need.pourcentage || 0);
    }, 0);

    const progressionGlobale = totalPourcentage / project.besoins.length;
    
    console.log(`📊 Progression globale du projet "${project.titre}": ${progressionGlobale.toFixed(1)}%`);
    
    return progressionGlobale;
    
  } catch (error) {
    console.error(`❌ Erreur calcul progression globale:`, error);
    return 0;
  }
}

/**
 * Met à jour TOUS les besoins d'un projet + la progression globale
 * ✅ À appeler après modification du projet ou réception d'un don
 */
export async function updateProjectNeeds(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        besoins: {
          where: {
            statut: {
              not: 'ANNULE'
            }
          }
        }
      }
    });

    if (!project) {
      console.error(`❌ Projet ${projectId} non trouvé`);
      return;
    }

    console.log(`🔄 Mise à jour de ${project.besoins.length} besoins pour "${project.titre}"...`);

    // 1. Mettre à jour chaque besoin
    const updates = project.besoins.map(need => updateNeedProgress(need.id));
    await Promise.all(updates);

    // 2. Calculer et enregistrer la progression globale
    const progressionGlobale = await calculateGlobalProgress(projectId);
    
    await prisma.project.update({
      where: { id: projectId },
      data: {
        progressionGlobale: Math.min(progressionGlobale, 100)
      }
    });

    console.log(`✅ Projet "${project.titre}" mis à jour - Progression globale: ${progressionGlobale.toFixed(1)}%`);
    
    return {
      success: true,
      progressionGlobale,
      besoinsCount: project.besoins.length
    };
    
  } catch (error) {
    console.error(`❌ Erreur mise à jour projet ${projectId}:`, error);
    throw error;
  }
}

/**
 * Point d'entrée principal - À appeler quand un don est reçu
 */
export async function onDonReceived(donId: string) {
  try {
    const don = await prisma.don.findUnique({
      where: { id: donId },
      include: {
        need: true,
        project: {
          select: {
            id: true,
            titre: true
          }
        }
      }
    });

    if (!don) {
      console.error(`❌ Don ${donId} non trouvé`);
      return;
    }

    console.log(`🎁 Traitement du don reçu "${don.libelle}" (${don.type})`);

    // Si le don est lié à un besoin spécifique
    if (don.needId) {
      console.log(`📊 Mise à jour du besoin spécifique...`);
      await updateNeedProgress(don.needId);
    }

    // Mettre à jour TOUS les besoins + progression globale du projet
    if (don.projectId) {
      console.log(`📈 Mise à jour globale du projet...`);
      await updateProjectNeeds(don.projectId);
    }

    console.log(`✅ Jauges mises à jour avec succès`);
    
  } catch (error) {
    console.error(`❌ Erreur mise à jour jauges:`, error);
    throw error;
  }
}

/**
 * ✅ Fonction utilitaire pour créer le besoin monétaire principal
 * À utiliser lors de la création d'un nouveau projet
 */
export async function createMainMonetaryNeed(
  projectId: string,
  coutTotalProjet: number,
  budgetDisponible: number,
  projectTitle: string
) {
  try {
    // Calculer le montant à collecter
    const montantAColleter = Math.max(0, coutTotalProjet - budgetDisponible);
    
    const need = await prisma.projectNeed.create({
      data: {
        projectId,
        type: 'MONETAIRE',
        titre: `Financement du projet - ${projectTitle}`,
        description: `Budget nécessaire pour réaliser ce projet. L'établissement dispose déjà de ${budgetDisponible.toLocaleString()} Ar. Montant à collecter: ${montantAColleter.toLocaleString()} Ar.`,
        montantCible: coutTotalProjet,
        budgetInclusDansCalcul: true, // ✅ Marquer comme besoin principal
        priorite: 1,
        statut: 'EN_COURS'
      }
    });
    
    console.log(`✅ Besoin monétaire principal créé: ${montantAColleter.toLocaleString()} Ar à collecter`);
    
    // Calculer immédiatement la progression initiale
    await updateNeedProgress(need.id);
    
    return need;
  } catch (error) {
    console.error(`❌ Erreur création besoin monétaire:`, error);
    throw error;
  }
}