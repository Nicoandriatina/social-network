import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer les IDs des amis existants et demandes en cours //
    const existingConnections = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { fromId: auth.id },
          { toId: auth.id }
        ]
      },
      select: {
        fromId: true,
        toId: true
      }
    });

    const excludedIds = new Set([
      auth.id,
      ...existingConnections.map(c => c.fromId),
      ...existingConnections.map(c => c.toId)
    ]);

    // 🔍 DEBUG : Compter tous les utilisateurs
    const totalUsers = await prisma.user.count();
    const validatedUsers = await prisma.user.count({
      where: { isValidated: true }
    });

    // Suggérer des utilisateurs (max 20)
    // ⚠️ Retirer temporairement le filtre isValidated pour tester
    const suggestions = await prisma.user.findMany({
      where: {
        id: {
          notIn: Array.from(excludedIds)
        }
        // isValidated: true  // <-- Commenté temporairement
      },
      select: {
        id: true,
        fullName: true,
        avatar: true,
        type: true,
        isValidated: true  // Pour voir qui est validé
      },
      take: 20
    });

    // 🔍 Retourner les infos de debug
    return NextResponse.json({ 
      users: suggestions,
      debug: {
        currentUserId: auth.id,
        totalUsers,
        validatedUsers,
        excludedCount: excludedIds.size,
        suggestionsFound: suggestions.length
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}