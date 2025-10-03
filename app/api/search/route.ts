import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results = [];

    // 1. Rechercher des utilisateurs (amis potentiels)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: auth.id } }, // Exclure l'utilisateur actuel
          {
            OR: [
              { fullName: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        type: true,
        avatar: true,
        etablissement: {
          select: {
            nom: true
          }
        }
      },
      take: 5
    });

    users.forEach(user => {
      results.push({
        id: user.id,
        name: user.fullName,
        description: user.etablissement?.nom || user.email,
        type: 'Utilisateur',
        url: `/dashboard/profile/${user.id}`,
        avatar: user.avatar,
        colorClass: user.type === 'DONATEUR' 
          ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
          : 'bg-gradient-to-br from-indigo-500 to-purple-600'
      });
    });

    // 2. Rechercher des projets
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { titre: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { reference: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        titre: true,
        description: true,
        reference: true,
        categorie: true,
        etablissement: {
          select: {
            nom: true
          }
        }
      },
      take: 5
    });

    projects.forEach(project => {
      results.push({
        id: project.id,
        name: project.titre,
        description: `${project.etablissement.nom} • ${project.reference}`,
        type: 'Projet',
        url: `/dashboard/projects/${project.id}`,
        colorClass: 'bg-gradient-to-br from-orange-500 to-red-500'
      });
    });

    // 3. Rechercher des établissements
    const etablissements = await prisma.etablissement.findMany({
      where: {
        OR: [
          { nom: { contains: query, mode: 'insensitive' } },
          { adresse: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        nom: true,
        type: true,
        niveau: true,
        adresse: true
      },
      take: 3
    });

    etablissements.forEach(etab => {
      results.push({
        id: etab.id,
        name: etab.nom,
        description: `${etab.niveau} ${etab.type} • ${etab.adresse || 'Emplacement non spécifié'}`,
        type: 'Établissement',
        url: `/dashboard/etablissements/${etab.id}`,
        colorClass: 'bg-gradient-to-br from-blue-500 to-cyan-500'
      });
    });

    // 4. Rechercher dans les messages récents
    const messages = await prisma.message.findMany({
      where: {
        AND: [
          {
            OR: [
              { fromId: auth.id },
              { toId: auth.id }
            ]
          },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        from: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        },
        to: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        sentAt: 'desc'
      },
      take: 3
    });

    messages.forEach(msg => {
      const otherUser = msg.fromId === auth.id ? msg.to : msg.from;
      results.push({
        id: msg.id,
        name: `Message avec ${otherUser.fullName}`,
        description: msg.content.substring(0, 60) + (msg.content.length > 60 ? '...' : ''),
        type: 'Message',
        url: `/dashboard/messages?chat=${otherUser.id}`,
        avatar: otherUser.avatar,
        colorClass: 'bg-gradient-to-br from-blue-500 to-indigo-500'
      });
    });

    return NextResponse.json({ 
      results: results.slice(0, 10) // Limiter à 10 résultats max
    });
  } catch (error) {
    console.error('Erreur recherche:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}