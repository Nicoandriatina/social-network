// File: app/api/auth/signup/route.ts

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
      adressePostale,
      secteur,
      profession,
      facebook,
      twitter,
      whatsapp,
      // Etablissement fields
      etablissement,
      // Enseignant fields
      enseignant,
      // Donateur fields
      donateur
    } = body;

    // 1. Check existing email or phone
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

    // 3. Create User
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        telephone,
        type,
        adressePostale,
        secteur,
        profession,
        facebook,
        twitter,
        whatsapp,
        role: 'SIMPLE',
        isValidated: false,
        emailVerified: false,
        etablissement: etablissement ? {
          create: {
            nom: etablissement.nom,
            type: etablissement.type,
            niveau: etablissement.niveau,
            adresse: etablissement.adresse,
            // anneeCreation: etablissement.anneeCreation,
            // nbEleves: etablissement.nbEleves,
          }
        } : undefined,
        enseignant: enseignant ? {
          create: {
            school: enseignant.school,
            position: enseignant.position,
            experience: enseignant.experience,
            degree: enseignant.degree
          }
        } : undefined,
        donateur: donateur ? {
          create: {
            donorType: donateur.donorType,
            sector: donateur.sector
          }
        } : undefined,
      }
    });

    return NextResponse.json({ message: 'Utilisateur créé avec succès.', userId: newUser.id }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
