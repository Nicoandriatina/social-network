
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