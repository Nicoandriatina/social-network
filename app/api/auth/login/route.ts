// // app/api/auth/login/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => null);
//     const username = body?.username?.trim?.();
//     const password = body?.password;

//     if (!username || !password) {
//       return NextResponse.json(
//         { error: "Email/identifiant et mot de passe requis" },
//         { status: 400 }
//       );
//     }

//     // Rechercher l'utilisateur par email ou téléphone
//     const user = await prisma.user.findFirst({
//       where: {
//         OR: [
//           { email: username },
//           { telephone: username }
//         ],
//       },
//       select: {
//         id: true,
//         email: true,
//         fullName: true,
//         password: true,
//         role: true,
//         type: true,
//         isValidated: true,
//         avatar: true
//       }
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Identifiants invalides" },
//         { status: 401 }
//       );
//     }

//     // Vérifier le mot de passe
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return NextResponse.json(
//         { error: "Mot de passe incorrect" },
//         { status: 401 }
//       );
//     }

//     // Vérifier si le compte est validé (sauf pour Super Admin)
//     if (user.role !== "SUPERADMIN" && !user.isValidated) {
//       return NextResponse.json(
//         { 
//           error: "Compte en attente de validation",
//           message: "Votre compte doit être validé par un administrateur avant de pouvoir vous connecter."
//         },
//         { status: 403 }
//       );
//     }

//     // Créer le token JWT
//     const token = jwt.sign(
//       { 
//         userId: user.id,
//         role: user.role,
//         type: user.type
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     // Définir le cookie
//     const cookieStore = await cookies();
//     cookieStore.set("token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       path: "/",
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 24 * 7, // 7 jours
//     });

//     // Mettre à jour la dernière connexion (optionnel - ne pas bloquer si erreur)
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { updatedAt: new Date() }
//     }).catch(() => {
//       // Ignorer l'erreur si le champ n'existe pas
//     });

//     // Log de connexion (optionnel)
//     if (user.role === "SUPERADMIN") {
//       console.log(`✅ Super Admin connecté: ${user.email} à ${new Date().toISOString()}`);
//     }

//     // ✅ Retourner les infos utilisateur avec le rôle
//     return NextResponse.json({
//       ok: true,
//       user: {
//         id: user.id,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//         type: user.type,
//         avatar: user.avatar
//       },
//       // Indiquer la route de redirection selon le rôle
//       redirectTo: user.role === "SUPERADMIN" ? "/admin" : "/dashboard"
//     });

//   } catch (e) {
//     console.error("❌ POST /api/auth/login error:", e);
//     return NextResponse.json(
//       { error: "Erreur serveur lors de la connexion" },
//       { status: 500 }
//     );
//   }
// }
// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Fonction helper pour valider le format email
function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

// Fonction helper pour valider le format téléphone (Madagascar)
function isPhoneNumber(str: string): boolean {
  // Accepte différents formats: +261341234567, 0341234567, 034 12 345 67, etc.
  const cleaned = str.replace(/[\s\-()]/g, '');
  // Formats acceptés: +261 3X XXX XXXX, 03X XXX XXXX, 3X XXX XXXX
  return /^(\+?261|0)?3[2-8]\d{7}$/.test(cleaned);
}

// Fonction pour normaliser le numéro de téléphone
function normalizePhoneNumber(phone: string): string {
  // Enlever espaces, tirets, parenthèses
  let cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Si commence par +261, garder tel quel
  if (cleaned.startsWith('+261')) {
    return cleaned;
  }
  
  // Si commence par 0, remplacer par +261
  if (cleaned.startsWith('0')) {
    return '+261' + cleaned.substring(1);
  }
  
  // Si commence par 261, ajouter +
  if (cleaned.startsWith('261')) {
    return '+' + cleaned;
  }
  
  // Si commence directement par 3x (opérateur), ajouter +261
  if (/^3[2-8]/.test(cleaned)) {
    return '+261' + cleaned;
  }
  
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const username = body?.username?.trim?.();
    const password = body?.password;

    // Validation des champs requis
    if (!username || !password) {
      return NextResponse.json(
        { 
          error: "Email ou téléphone et mot de passe requis",
          message: "Veuillez renseigner tous les champs obligatoires."
        },
        { status: 400 }
      );
    }

    // ✅ AMÉLIORATION : Détecter le type d'identifiant
    let whereClause;
    let searchType = "generic";
    
    if (isEmail(username)) {
      // C'est un email - recherche simple
      console.log(`🔍 Recherche par email: ${username}`);
      whereClause = { email: username.toLowerCase() };
      searchType = "email";
    } else if (isPhoneNumber(username)) {
      // C'est un numéro de téléphone - normaliser et rechercher
      const normalizedPhone = normalizePhoneNumber(username);
      console.log(`🔍 Recherche par téléphone: ${username} → ${normalizedPhone}`);
      
      // Rechercher avec toutes les variantes possibles
      whereClause = {
        OR: [
          { telephone: normalizedPhone },
          { telephone: username },
          { telephone: username.replace(/[\s\-()]/g, '') }
        ]
      };
      searchType = "phone";
    } else {
      // Format non reconnu - essayer les deux
      console.log(`🔍 Recherche générique: ${username}`);
      whereClause = {
        OR: [
          { email: username.toLowerCase() },
          { telephone: username }
        ]
      };
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findFirst({
      where: whereClause,
      select: {
        id: true,
        email: true,
        telephone: true,
        fullName: true,
        password: true,
        role: true,
        type: true,
        isValidated: true,
        avatar: true,
        emailVerified: true
      }
    });

    if (!user) {
      console.log(`❌ Utilisateur non trouvé: ${username}`);
      return NextResponse.json(
        { 
          error: "Identifiants invalides",
          message: "Aucun compte ne correspond à cet email ou numéro de téléphone."
        },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log(`❌ Mot de passe incorrect pour: ${user.email}`);
      return NextResponse.json(
        { 
          error: "Mot de passe incorrect",
          message: "Le mot de passe que vous avez saisi est incorrect."
        },
        { status: 401 }
      );
    }

    // ✅ AUCUNE RESTRICTION DE VALIDATION
    // Tous les utilisateurs peuvent se connecter, qu'ils soient validés ou non
    // La validation servira uniquement pour d'autres fonctionnalités
    
    // Log si compte non validé (pour information uniquement)
    if (!user.isValidated) {
      console.log(`ℹ️ Connexion d'un compte non validé: ${user.email} (${user.type})`);
    }

    // Créer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        role: user.role,
        type: user.type
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Définir le cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    }).catch((err) => {
      console.log("⚠️ Erreur mise à jour updatedAt:", err.message);
    });

    // Log de connexion
    console.log(`✅ Connexion réussie via ${searchType}: ${user.email} (${user.role}/${user.type})`);

    // Retourner les informations utilisateur
    return NextResponse.json({
      ok: true,
      message: "Connexion réussie",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        type: user.type,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        isValidated: user.isValidated
      },
      loginMethod: searchType,
      redirectTo: user.role === "SUPERADMIN" ? "/admin" : "/dashboard/acceuil"
    });

  } catch (e) {
    console.error("❌ Erreur POST /api/auth/login:", e);
    return NextResponse.json(
      { 
        error: "Erreur serveur",
        message: "Une erreur inattendue s'est produite. Veuillez réessayer."
      },
      { status: 500 }
    );
  }
}