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
      avatar,
      etablissementId,
      adressePostale,
      secteur,
      profession,
      facebook,
      twitter,
      whatsapp,
      etablissement,
      enseignant,
      donateur,
      scolarityHistory, // ✅ Nouveau champ pour l'historique
    } = body;

    console.log('📋 Création utilisateur avec:', {
      email,
      type,
      etablissementId,
      scolarityHistory,
    });

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
    let userRole: 'SIMPLE' | 'ADMIN' | 'SUPERADMIN' = 'SIMPLE';
    if (type === 'ETABLISSEMENT') {
      userRole = 'ADMIN';
    }

    console.log('✅ Rôle déterminé:', userRole);

    // 4. Préparer les données de création
    const userData: any = {
      email,
      password: hashedPassword,
      fullName,
      telephone,
      type,
      country,
      avatar: avatar || null,
      adressePostale,
      secteur,
      profession,
      facebook,
      twitter,
      whatsapp,
      role: userRole,
      isValidated: type === 'ETABLISSEMENT',
      emailVerified: false,
    };

    // 5. ✅ ÉTABLISSEMENT
    if (type === 'ETABLISSEMENT' && etablissement) {
      userData.etablissement = {
        create: {
          nom: etablissement.nom,
          type: etablissement.type,
          niveau: etablissement.niveau,
          adresse: etablissement.adresse || '',
          anneeCreation: etablissement.anneeCreation,
          nbEleves: etablissement.nbEleves,
        }
      };
    }

    // 6. ✅ ENSEIGNANT
    if (type === 'ENSEIGNANT') {
      if (etablissementId) {
        // Vérifier que l'établissement existe
        const etabExists = await prisma.etablissement.findUnique({
          where: { id: etablissementId }
        });

        if (!etabExists) {
          return NextResponse.json({ error: 'Établissement non trouvé' }, { status: 404 });
        }

        userData.etablissementId = etablissementId;
        console.log('✅ Enseignant lié à l\'établissement:', etablissementId);
      }

      // Créer le profil enseignant
      userData.enseignant = {
        create: {
          position: enseignant?.position || '',
          experience: enseignant?.experience || '',
          degree: enseignant?.degree || '',
          validated: false,
        }
      };

      // ✅ Créer l'historique de scolarité si un établissement est sélectionné
      if (etablissementId && scolarityHistory) {
        const years: number[] = [];
        const startYear = scolarityHistory.startYear;
        const endYear = scolarityHistory.endYear || new Date().getFullYear();
        
        // Générer la liste des années
        for (let year = startYear; year <= endYear; year++) {
          years.push(year);
        }

        userData.scolariteAnnee = years;
        
        console.log('✅ Années de scolarité créées:', years);
      }
    }

    // 7. ✅ DONATEUR
    if (type === 'DONATEUR' && donateur) {
      userData.donateur = {
        create: {
          donorType: donateur.donorType,
          sector: donateur.sector
        }
      };
    }

    // 8. Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: userData,
      include: {
        etablissement: true,
        enseignant: true,
        donateur: true,
      }
    });

    console.log('✅ Utilisateur créé:', {
      id: newUser.id,
      email: newUser.email,
      type: newUser.type,
      role: newUser.role,
      etablissementId: newUser.etablissementId,
      scolariteAnnee: newUser.scolariteAnnee,
    });

    // 9. Si établissement créé, mettre à jour la relation admin
    if (type === 'ETABLISSEMENT' && newUser.etablissementId) {
      await prisma.etablissement.update({
        where: { id: newUser.etablissementId },
        data: {
          admin: {
            connect: { id: newUser.id }
          }
        }
      });
      
      console.log('✅ Établissement lié à l\'admin');
    }

    // 10. ✅ Créer l'entrée ScolarityHistory si applicable
    if (type === 'ENSEIGNANT' && etablissementId && scolarityHistory) {
      try {
        await prisma.scolarityHistory.create({
          data: {
            userId: newUser.id,
            etablissementId: etablissementId,
            years: newUser.scolariteAnnee,
          }
        });
        console.log('✅ ScolarityHistory créé');
      } catch (historyError) {
        console.error('⚠️ Erreur création ScolarityHistory:', historyError);
        // Non bloquant, on continue
      }
    }

    return NextResponse.json({ 
      message: 'Utilisateur créé avec succès.', 
      userId: newUser.id,
      hasAvatar: !!newUser.avatar,
      needsValidation: type === 'ENSEIGNANT' && !!etablissementId,
      scolarityYears: newUser.scolariteAnnee?.length || 0,
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}