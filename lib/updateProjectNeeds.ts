// lib/updateProjectNeeds.ts
import { prisma } from "@/lib/prisma";

/**
 * Met à jour les statistiques d'un besoin spécifique
 * Calcule le montant/quantité reçu et le pourcentage
 */
export async function updateNeedProgress(needId: string) {
  try {
    const need = await prisma.projectNeed.findUnique({
      where: { id: needId },
      include: {
        dons: {
          where: {
            statut: 'RECEPTIONNE' // Seulement les dons reçus
          }
        }
      }
    });

    if (!need) {
      throw new Error(`Besoin ${needId} non trouvé`);
    }

    let montantRecu = 0;
    let quantiteRecue = 0;
    let pourcentage = 0;

    // Calculer selon le type
    if (need.type === 'MONETAIRE') {
      montantRecu = need.dons.reduce((sum, don) => sum + (don.montant || 0), 0);
      if (need.montantCible && need.montantCible > 0) {
        pourcentage = (montantRecu / need.montantCible) * 100;
      }
    } else {
      // MATERIEL ou VIVRES
      quantiteRecue = need.dons.reduce((sum, don) => sum + (don.quantite || 0), 0);
      if (need.quantiteCible && need.quantiteCible > 0) {
        pourcentage = (quantiteRecue / need.quantiteCible) * 100;
      }
    }

    // Déterminer le statut
    let statut = need.statut;
    if (pourcentage >= 100) {
      statut = 'TERMINE';
    } else if (pourcentage > 0) {
      statut = 'EN_COURS';
    }

    // Mettre à jour le besoin
    const updatedNeed = await prisma.projectNeed.update({
      where: { id: needId },
      data: {
        montantRecu,
        quantiteRecue,
        pourcentage: Math.min(pourcentage, 100), // Cap à 100%
        statut
      }
    });

    return updatedNeed;
  } catch (error) {
    console.error(`Erreur mise à jour besoin ${needId}:`, error);
    throw error;
  }
}

/**
 * Met à jour tous les besoins d'un projet
 */
export async function updateProjectNeeds(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        besoins: true
      }
    });

    if (!project) {
      throw new Error(`Projet ${projectId} non trouvé`);
    }

    // Mettre à jour chaque besoin
    const updates = project.besoins.map(need => updateNeedProgress(need.id));
    await Promise.all(updates);

    console.log(`✅ Tous les besoins du projet ${projectId} ont été mis à jour`);
  } catch (error) {
    console.error(`Erreur mise à jour projet ${projectId}:`, error);
    throw error;
  }
}

/**
 * Hook à appeler lors de la réception d'un don
 * À intégrer dans votre API de création/modification de dons
 */
export async function onDonReceived(donId: string) {
  try {
    const don = await prisma.don.findUnique({
      where: { id: donId },
      include: {
        need: true,
        project: true
      }
    });

    if (!don) {
      throw new Error(`Don ${donId} non trouvé`);
    }

    // Si le don est lié à un besoin spécifique
    if (don.needId) {
      await updateNeedProgress(don.needId);
    }

    // Mettre à jour tous les besoins du projet
    if (don.projectId) {
      await updateProjectNeeds(don.projectId);
    }

    console.log(`✅ Besoins mis à jour suite au don ${donId}`);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour après don:`, error);
    throw error;
  }
}

// app/api/dons/route.ts - Exemple d'intégration
export async function POST_DON(req: Request) {
  try {
    // ... votre logique de création de don ...

    const don = await prisma.don.create({
      data: {
        // ... vos données
        needId: needId, // ID du besoin concerné
        projectId: projectId,
        donateurId: userId,
        statut: 'EN_ATTENTE'
      }
    });

    // ✅ Créer une notification
    await prisma.notification.create({
      data: {
        userId: project.auteurId, // Notifier l'auteur du projet
        type: 'DONATION_RECEIVED',
        title: 'Nouveau don reçu',
        content: `${donateur.fullName} a fait un don pour votre projet "${project.titre}"`,
        relatedUserId: userId,
        donId: don.id,
        projectId: projectId
      }
    });

    return NextResponse.json({ 
      message: "Don créé avec succès",
      don 
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/dons error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// app/api/dons/[id]/status/route.ts - Mettre à jour le statut d'un don
export async function PATCH_DON_STATUS(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const { statut } = body;

    // Mettre à jour le don
    const don = await prisma.don.update({
      where: { id: resolvedParams.id },
      data: {
        statut,
        dateReception: statut === 'RECEPTIONNE' ? new Date() : null
      }
    });

    // ✅ Si le don est marqué comme RECEPTIONNE, mettre à jour les jauges
    if (statut === 'RECEPTIONNE') {
      await onDonReceived(don.id);
    }

    return NextResponse.json({ 
      message: "Statut mis à jour",
      don 
    });

  } catch (error) {
    console.error("PATCH /api/dons/[id]/status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}