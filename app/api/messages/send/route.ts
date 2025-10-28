// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { getAuthUser } from '@/lib/auth';

// async function areFriends(userId1: string, userId2: string): Promise<boolean> {
//   const friendship = await prisma.friendRequest.findFirst({
//     where: {
//       OR: [
//         { fromId: userId1, toId: userId2, accepted: true },
//         { fromId: userId2, toId: userId1, accepted: true }
//       ]
//     }
//   });

//   return !!friendship;
// }

// export async function POST(request: NextRequest) {
//   try {
//     // ✅ getAuthUser() gère déjà les cookies et la vérification du token
//     const auth = await getAuthUser();
    
//     if (!auth) {
//       return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
//     }

//     const { toId, content } = await request.json();

//     if (!content || content.trim() === '') {
//       return NextResponse.json(
//         { error: 'Le message ne peut pas être vide' }, 
//         { status: 400 }
//       );
//     }

//     // ✅ Utiliser auth.id au lieu de userId
//     const friends = await areFriends(auth.id, toId);
//     if (!friends) {
//       return NextResponse.json(
//         { error: 'Vous ne pouvez envoyer des messages qu\'à vos amis' }, 
//         { status: 403 }
//       );
//     }

//     const message = await prisma.message.create({
//       data: {
//         fromId: auth.id,  // ✅ auth.id
//         toId,
//         content: content.trim()
//       },
//       include: {
//         from: {
//           select: {
//             id: true,
//             fullName: true,
//             avatar: true
//           }
//         }
//       }
//     });

//     return NextResponse.json({ message }, { status: 201 });
//   } catch (error) {
//     console.error('Erreur:', error);
//     return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
//   }
// }
// app/api/messages/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function areFriends(userId1: string, userId2: string): Promise<boolean> {
  const friendship = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { fromId: userId1, toId: userId2, accepted: true },
        { fromId: userId2, toId: userId1, accepted: true }
      ]
    }
  });

  return !!friendship;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { toId, content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Le message ne peut pas être vide' }, 
        { status: 400 }
      );
    }

    // Vérifier que les utilisateurs sont amis
    const friends = await areFriends(auth.id, toId);
    if (!friends) {
      return NextResponse.json(
        { error: 'Vous ne pouvez envoyer des messages qu\'à vos amis' }, 
        { status: 403 }
      );
    }

    // ✅ Créer le message avec l'avatar de l'expéditeur
    const message = await prisma.message.create({
      data: {
        fromId: auth.id,
        toId,
        content: content.trim()
      },
      include: {
        from: {
          select: {
            id: true,
            fullName: true,
            avatar: true,  // ✅ IMPORTANT : Inclure l'avatar
            type: true
          }
        }
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}