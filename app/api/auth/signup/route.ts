// // // // // File: app/api/auth/signup/route.ts

// // // // import { PrismaClient } from '@prisma/client';
// // // // import { hash } from 'bcryptjs';
// // // // import { NextResponse } from 'next/server';

// // // // const prisma = new PrismaClient();

// // // // export async function POST(req: Request) {
// // // //   try {
// // // //     const body = await req.json();
// // // //     const {
// // // //       email,
// // // //       password,
// // // //       fullName,
// // // //       telephone,
// // // //       type,
// // // //       adressePostale,
// // // //       secteur,
// // // //       profession,
// // // //       facebook,
// // // //       twitter,
// // // //       whatsapp,
// // // //       // Etablissement fields
// // // //       etablissement,
// // // //       // Enseignant fields
// // // //       enseignant,
// // // //       // Donateur fields
// // // //       donateur
// // // //     } = body;

// // // //     // 1. Check existing email or phone
// // // //     const existing = await prisma.user.findFirst({
// // // //       where: {
// // // //         OR: [
// // // //           { email },
// // // //           { telephone: telephone ?? undefined }
// // // //         ]
// // // //       }
// // // //     });

// // // //     if (existing) {
// // // //       return NextResponse.json({ error: 'Email ou téléphone déjà utilisé.' }, { status: 409 });
// // // //     }

// // // //     // 2. Hash password
// // // //     const hashedPassword = await hash(password, 10);

// // // //     // 3. Create User
// // // //     const newUser = await prisma.user.create({
// // // //       data: {
// // // //         email,
// // // //         password: hashedPassword,
// // // //         fullName,
// // // //         telephone,
// // // //         type,
// // // //         adressePostale,
// // // //         secteur,
// // // //         profession,
// // // //         facebook,
// // // //         twitter,
// // // //         whatsapp,
// // // //         role: 'SIMPLE',
// // // //         isValidated: false,
// // // //         emailVerified: false,
// // // //         etablissement: etablissement ? {
// // // //           create: {
// // // //             nom: etablissement.nom,
// // // //             type: etablissement.type,
// // // //             niveau: etablissement.niveau,
// // // //             adresse: etablissement.adresse,
// // // //             // anneeCreation: etablissement.anneeCreation,
// // // //             // nbEleves: etablissement.nbEleves,
// // // //           }
// // // //         } : undefined,
// // // //         enseignant: enseignant ? {
// // // //           create: {
// // // //             school: enseignant.school,
// // // //             position: enseignant.position,
// // // //             experience: enseignant.experience,
// // // //             degree: enseignant.degree
// // // //           }
// // // //         } : undefined,
// // // //         donateur: donateur ? {
// // // //           create: {
// // // //             donorType: donateur.donorType,
// // // //             sector: donateur.sector
// // // //           }
// // // //         } : undefined,
// // // //       }
// // // //     });

// // // //     return NextResponse.json({ message: 'Utilisateur créé avec succès.', userId: newUser.id }, { status: 201 });
// // // //   } catch (error) {
// // // //     console.error('Signup error:', error);
// // // //     return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
// // // //   }
// // // // }

// // // // File: app/api/auth/signup/route.ts

// // // import { PrismaClient } from '@prisma/client';
// // // import { hash } from 'bcryptjs';
// // // import { NextResponse } from 'next/server';

// // // const prisma = new PrismaClient();

// // // export async function POST(req: Request) {
// // //   try {
// // //     const body = await req.json();
// // //     const {
// // //       email,
// // //       password,
// // //       fullName,
// // //       telephone,
// // //       type,
// // //       country,  // ✅ AJOUTER
// // //       adressePostale,
// // //       secteur,
// // //       profession,
// // //       facebook,
// // //       twitter,
// // //       whatsapp,
// // //       // Etablissement fields
// // //       etablissement,
// // //       // Enseignant fields
// // //       enseignant,
// // //       // Donateur fields
// // //       donateur
// // //     } = body;

// // //     // 1. Check existing email or phone
// // //     const existing = await prisma.user.findFirst({
// // //       where: {
// // //         OR: [
// // //           { email },
// // //           { telephone: telephone ?? undefined }
// // //         ]
// // //       }
// // //     });

// // //     if (existing) {
// // //       return NextResponse.json({ error: 'Email ou téléphone déjà utilisé.' }, { status: 409 });
// // //     }

// // //     // 2. Hash password
// // //     const hashedPassword = await hash(password, 10);

// // //     // 3. Create User
// // //     const newUser = await prisma.user.create({
// // //       data: {
// // //         email,
// // //         password: hashedPassword,
// // //         fullName,
// // //         telephone,
// // //         type,
// // //         country,  // ✅ AJOUTER
// // //         adressePostale,
// // //         secteur,
// // //         profession,
// // //         facebook,
// // //         twitter,
// // //         whatsapp,
// // //         role: 'SIMPLE',
// // //         isValidated: false,
// // //         emailVerified: false,
// // //         // ✅ ETABLISSEMENT
// // //         etablissement: etablissement ? {
// // //           create: {
// // //             nom: etablissement.nom,
// // //             type: etablissement.type,
// // //             niveau: etablissement.niveau,
// // //             adresse: etablissement.adresse,
// // //             anneeCreation: etablissement.anneeCreation,
// // //             nbEleves: etablissement.nbEleves,
// // //           }
// // //         } : undefined,
// // //         // ✅ ENSEIGNANT - AVEC VALIDATION PAR DÉFAUT FALSE
// // //         enseignant: enseignant ? {
// // //           create: {
// // //             school: enseignant.school,
// // //             position: enseignant.position,
// // //             experience: enseignant.experience,
// // //             degree: enseignant.degree,
// // //             validated: false,  // ✅ AJOUTER - Enseignants non validés par défaut
// // //           }
// // //         } : undefined,
// // //         // ✅ DONATEUR
// // //         donateur: donateur ? {
// // //           create: {
// // //             donorType: donateur.donorType,
// // //             sector: donateur.sector
// // //           }
// // //         } : undefined,
// // //       }
// // //     });

// // //     return NextResponse.json({ 
// // //       message: 'Utilisateur créé avec succès.', 
// // //       userId: newUser.id 
// // //     }, { status: 201 });
    
// // //   } catch (error) {
// // //     console.error('Signup error:', error);
// // //     return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
// // //   }
// // // }

// // import { PrismaClient } from '@prisma/client';
// // import { hash } from 'bcryptjs';
// // import { NextResponse } from 'next/server';

// // const prisma = new PrismaClient();

// // export async function POST(req: Request) {
// //   try {
// //     const body = await req.json();
// //     const {
// //       email,
// //       password,
// //       fullName,
// //       telephone,
// //       type,
// //       country,
// //       adressePostale,
// //       secteur,
// //       profession,
// //       facebook,
// //       twitter,
// //       whatsapp,
// //       etablissement,
// //       enseignant,
// //       donateur
// //     } = body;

// //     // 1. Check existing email or phone
// //     const existing = await prisma.user.findFirst({
// //       where: {
// //         OR: [
// //           { email },
// //           { telephone: telephone ?? undefined }
// //         ]
// //       }
// //     });

// //     if (existing) {
// //       return NextResponse.json({ error: 'Email ou téléphone déjà utilisé.' }, { status: 409 });
// //     }

// //     // 2. Hash password
// //     const hashedPassword = await hash(password, 10);

// //     // 3. Déterminer le rôle selon le type
// //     let userRole = 'SIMPLE';
// //     if (type === 'ETABLISSEMENT') {
// //       userRole = 'ADMIN'; // ✅ Établissements = ADMIN par défaut
// //     }
// //     // Enseignants et donateurs restent SIMPLE

// //     // 4. Create User
// //     const newUser = await prisma.user.create({
// //       data: {
// //         email,
// //         password: hashedPassword,
// //         fullName,
// //         telephone,
// //         type,
// //         country,
// //         adressePostale,
// //         secteur,
// //         profession,
// //         facebook,
// //         twitter,
// //         whatsapp,
// //         role: userRole, // ✅ Utiliser le rôle déterminé
// //         isValidated: false,
// //         emailVerified: false,
// //         // ✅ ÉTABLISSEMENT
// //         etablissement: etablissement ? {
// //           create: {
// //             nom: etablissement.nom,
// //             type: etablissement.type,
// //             niveau: etablissement.niveau,
// //             adresse: etablissement.adresse,
// //             anneeCreation: etablissement.anneeCreation,
// //             nbEleves: etablissement.nbEleves,
// //           }
// //         } : undefined,
// //         // ✅ ENSEIGNANT - Non validé par défaut, rôle SIMPLE
// //         enseignant: enseignant ? {
// //           create: {
// //             school: enseignant.school,
// //             position: enseignant.position,
// //             experience: enseignant.experience,
// //             degree: enseignant.degree,
// //             validated: false, // ✅ En attente de validation
// //           }
// //         } : undefined,
// //         // ✅ DONATEUR
// //         donateur: donateur ? {
// //           create: {
// //             donorType: donateur.donorType,
// //             sector: donateur.sector
// //           }
// //         } : undefined,
// //       }
// //     });

// //     // 5. Si établissement créé, lier l'utilisateur comme admin
// //     if (type === 'ETABLISSEMENT' && newUser.etablissement) {
// //       await prisma.etablissement.update({
// //         where: { id: newUser.etablissement.id },
// //         data: {
// //           admin: {
// //             connect: [{ id: newUser.id }]
// //           }
// //         }
// //       });
// //     }

// //     return NextResponse.json({ 
// //       message: 'Utilisateur créé avec succès.', 
// //       userId: newUser.id 
// //     }, { status: 201 });
    
// //   } catch (error) {
// //     console.error('Signup error:', error);
// //     return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
// //   }
// // }
// import { PrismaClient } from '@prisma/client';
// import { hash } from 'bcryptjs';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const {
//       email,
//       password,
//       fullName,
//       telephone,
//       type,
//       country,
//       etablissementId, // ✅ ID de l'établissement pour les enseignants
//       adressePostale,
//       secteur,
//       profession,
//       facebook,
//       twitter,
//       whatsapp,
//       etablissement,
//       enseignant,
//       donateur
//     } = body;

//     // 1. Check existing email or phone
//     const existing = await prisma.user.findFirst({
//       where: {
//         OR: [
//           { email },
//           { telephone: telephone ?? undefined }
//         ]
//       }
//     });

//     if (existing) {
//       return NextResponse.json({ error: 'Email ou téléphone déjà utilisé.' }, { status: 409 });
//     }

//     // 2. Hash password
//     const hashedPassword = await hash(password, 10);

//     // 3. Déterminer le rôle selon le type
//     let userRole = 'SIMPLE';
//     if (type === 'ETABLISSEMENT') {
//       userRole = 'ADMIN';
//     }

//     // 4. Create User
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         fullName,
//         telephone,
//         type,
//         country,
//         // ✅ Lier à l'établissement si enseignant
//         etablissementId: type === 'ENSEIGNANT' ? etablissementId : undefined,
//         adressePostale,
//         secteur,
//         profession,
//         facebook,
//         twitter,
//         whatsapp,
//         role: userRole,
//         isValidated: false,
//         emailVerified: false,
//         // ✅ ÉTABLISSEMENT
//         etablissement: etablissement ? {
//           create: {
//             nom: etablissement.nom,
//             type: etablissement.type,
//             niveau: etablissement.niveau,
//             adresse: etablissement.adresse,
//             anneeCreation: etablissement.anneeCreation,
//             nbEleves: etablissement.nbEleves,
//           }
//         } : undefined,
//         // ✅ ENSEIGNANT - Non validé par défaut
//         enseignant: enseignant ? {
//           create: {
//             position: enseignant.position,
//             experience: enseignant.experience,
//             degree: enseignant.degree,
//             validated: false,
//           }
//         } : undefined,
//         // ✅ DONATEUR
//         donateur: donateur ? {
//           create: {
//             donorType: donateur.donorType,
//             sector: donateur.sector
//           }
//         } : undefined,
//       }
//     });

//     // 5. Si établissement créé, lier l'utilisateur comme admin
//     if (type === 'ETABLISSEMENT' && newUser.etablissement) {
//       await prisma.etablissement.update({
//         where: { id: newUser.etablissement.id },
//         data: {
//           admin: {
//             connect: [{ id: newUser.id }]
//           }
//         }
//       });
//     }

//     return NextResponse.json({ 
//       message: 'Utilisateur créé avec succès.', 
//       userId: newUser.id 
//     }, { status: 201 });
    
//   } catch (error) {
//     console.error('Signup error:', error);
//     return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
//   }
// }
// app/api/auth/signup/route.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      fullName,
      telephone,
      type,
      country,
      avatar, // ✅ URL de l'avatar depuis l'upload
      etablissementId,
      adressePostale,
      secteur,
      profession,
      facebook,
      twitter,
      whatsapp,
      etablissement,
      enseignant,
      donateur
    } = body;

    // 1. Vérifier email/téléphone existant
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { telephone: telephone ?? undefined }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Email ou téléphone déjà utilisé.' }, { status: 409 });
    }

    // 2. Hash password
    const hashedPassword = await hash(password, 10);

    // 3. Déterminer le rôle selon le type
    let userRole = 'SIMPLE';
    if (type === 'ETABLISSEMENT') {
      userRole = 'ADMIN';
    }

    console.log('📋 Création utilisateur avec:', {
      email,
      type,
      hasAvatar: !!avatar,
      avatarUrl: avatar
    });

    // 4. Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        telephone,
        type,
        country,
        avatar: avatar || null, // ✅ Stocker l'URL de l'avatar
        adressePostale,
        secteur,
        profession,
        facebook,
        twitter,
        whatsapp,
        role: userRole,
        isValidated: false,
        emailVerified: false,
        // ✅ ÉTABLISSEMENT
        etablissement: etablissement ? {
          create: {
            nom: etablissement.nom,
            type: etablissement.type,
            niveau: etablissement.niveau,
            adresse: etablissement.adresse,
            anneeCreation: etablissement.anneeCreation,
            nbEleves: etablissement.nbEleves,
          }
        } : undefined,
        // ✅ ENSEIGNANT
        enseignant: enseignant ? {
          create: {
            position: enseignant.position,
            experience: enseignant.experience,
            degree: enseignant.degree,
            validated: false,
          }
        } : undefined,
        // ✅ DONATEUR
        donateur: donateur ? {
          create: {
            donorType: donateur.donorType,
            sector: donateur.sector
          }
        } : undefined,
      }
    });

    // 5. Si établissement créé, lier l'utilisateur comme admin
    if (type === 'ETABLISSEMENT' && newUser.etablissement) {
      await prisma.etablissement.update({
        where: { id: newUser.etablissement.id },
        data: {
          admin: {
            connect: [{ id: newUser.id }]
          }
        }
      });
    }

    console.log('✅ Utilisateur créé:', {
      id: newUser.id,
      email: newUser.email,
      type: newUser.type,
      avatar: newUser.avatar
    });

    return NextResponse.json({ 
      message: 'Utilisateur créé avec succès.', 
      userId: newUser.id,
      hasAvatar: !!newUser.avatar
    }, { status: 201 });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}