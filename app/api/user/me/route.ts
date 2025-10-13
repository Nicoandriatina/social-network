// app/api/user/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { UpdateForType } from "@/lib/validation/userUpdate";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ⬅️ le token contient { userId, role, type }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role?: string;
      type?: string;
      iat?: number;
      exp?: number;
    };

    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        etablissement: true,
        enseignant: true,
        donateur: true,
      },
    });

    if (!dbUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const user = {
      id: dbUser.id,
      nom: (dbUser as any).fullName ?? (dbUser as any).name ?? "",
      email: dbUser.email,
      role: (dbUser as any).role,           // SIMPLE | ADMIN | SUPERADMIN
      typeProfil: (dbUser as any).type ?? (dbUser as any).typeProfil, // ETABLISSEMENT | ENSEIGNANT | DONATEUR
      avatar: (dbUser as any).avatar ?? null,
      telephone: (dbUser as any).telephone ?? (dbUser as any).phone ?? null,
      facebook: (dbUser as any).facebook ?? null,
      twitter: (dbUser as any).twitter ?? null,
      whatsapp: (dbUser as any).whatsapp ?? null,

      etablissement: (dbUser as any).etablissement
        ? {
            id: (dbUser as any).etablissement.id,
            nom: (dbUser as any).etablissement.nom ?? (dbUser as any).etablissement.name ?? "",
            type: (dbUser as any).etablissement.type ?? (dbUser as any).etablissement.kind ?? "",
            adresse: (dbUser as any).etablissement.adresse ?? (dbUser as any).etablissement.address ?? "",
            niveau: (dbUser as any).etablissement.niveau ?? (dbUser as any).etablissement.level ?? null,
            // isPublic: (dbUser as any).etablissement.isPublic ?? null,
          }
        : null,

      enseignant: (dbUser as any).enseignant
        ? {
            id: (dbUser as any).enseignant.id,
            matiere: (dbUser as any).enseignant.matiere ?? null,
            valideParEtab: (dbUser as any).enseignant.isValidated ?? false,
          }
        : null,

      donateur: (dbUser as any).donateur
        ? {
            id: (dbUser as any).donateur.id,
            organisation: (dbUser as any).donateur.organisation ?? null,
          }
        : null,
    };

    return NextResponse.json({ user });
  } catch (e) {
    console.error("GET /api/user/me error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string; role: "SIMPLE"|"ADMIN"|"SUPERADMIN"; type: "ETABLISSEMENT"|"ENSEIGNANT"|"DONATEUR";
    };

    const body = await req.json().catch(() => ({}));
    
    // Log des données azo
    console.log('Requête PATCH /api/user/me avec les données suivantes:', body);


    // 1) Valider selon type
    const Schema = UpdateForType[payload.type];
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      // Log de l'erreur de validation
      console.log('Erreur de validation:', parsed.error.flatten());
      return NextResponse.json({ error: "Validation error", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    // Log des données validées
    console.log('Données validées:', data);

    // 2) Construire l'update Prisma (whitelist & structure)
    const userUpdate: any = {};
    if (data.fullName !== undefined) userUpdate.fullName = data.fullName;
    if (data.avatar !== undefined) userUpdate.avatar = data.avatar;
    if (data.telephone !== undefined) userUpdate.telephone = data.telephone;
    if (data.address !== undefined) userUpdate.adressePostale = data.address;
    if (data.facebook !== undefined) userUpdate.facebook = data.facebook;
    if (data.twitter !== undefined) userUpdate.twitter = data.twitter;
    if (data.whatsapp !== undefined) userUpdate.whatsapp = data.whatsapp;
    if (data.profession !== undefined) userUpdate.profession = data.profession;

    const nested: any = {};

    
    if (payload.type === "ETABLISSEMENT" && data.etablissement) {
      nested.etablissement = {
        upsert: {
          create: {
            nom: data.etablissement.nom,
            type: data.etablissement.type,
            niveau: data.etablissement.niveau,
            adresse: data.etablissement.adresse,
          },
          update: {
            ...(data.etablissement.nom !== undefined ? { nom: data.etablissement.nom } : {}),
            ...(data.etablissement.type !== undefined ? { type: data.etablissement.type } : {}),
            ...(data.etablissement.niveau !== undefined ? { niveau: data.etablissement.niveau } : {}),
            ...(data.etablissement.adresse !== undefined ? { adresse: data.etablissement.adresse } : {}),
          },
        },
      };
    }

    if (payload.type === "ENSEIGNANT" && data.enseignant) {
      nested.enseignant = {
        upsert: {
          create: {
            matiere: data.enseignant.matiere,
            experience: data.enseignant.experience,
            degree: data.enseignant.degree,
          },
          update: {
            ...(data.enseignant.matiere !== undefined ? { matiere: data.enseignant.matiere } : {}),
            ...(data.enseignant.experience !== undefined ? { experience: data.enseignant.experience } : {}),
            ...(data.enseignant.degree !== undefined ? { degree: data.enseignant.degree } : {}),
          },
        },
      };
    }

    if (payload.type === "DONATEUR" && data.donateur) {
      nested.donateur = {
        upsert: {
          create: {
            organisation: data.donateur.organisation,
            secteur: data.donateur.secteur,
          },
          update: {
            ...(data.donateur.organisation !== undefined ? { organisation: data.donateur.organisation } : {}),
            ...(data.donateur.secteur !== undefined ? { secteur: data.donateur.secteur } : {}),
          },
        },
      };
    }
      // Log des données à envoyer à Prisma
    console.log('Données à mettre à jour dans Prisma:', userUpdate, nested);

    const dbUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { ...userUpdate, ...nested },
      include: { etablissement: true, enseignant: true, donateur: true },
    });

    
    // Log du résultat de la mise à jour
    console.log('Utilisateur mis à jour:', dbUser);
    
    const user = mapUserForFront(dbUser);
    return NextResponse.json({ user });
  } catch (e) {
    console.error("PATCH /api/user/me error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// -------- helper mapping (cohérent avec ton GET actuel) ----------
function mapUserForFront(dbUser: any) {
  return {
    id: dbUser.id,
    nom: dbUser.fullName ?? dbUser.name ?? "",
    email: dbUser.email,
    role: dbUser.role,
    typeProfil: dbUser.type,
    avatar: dbUser.avatar ?? null,
    telephone: dbUser.telephone ?? dbUser.phone ?? null,
    facebook: dbUser.facebook ?? null,
    twitter: dbUser.twitter ?? null,
    whatsapp: dbUser.whatsapp ?? null,
    profession: dbUser.profession ?? null,
    isPublic: dbUser.isPublic ?? false,
    
    etablissement: dbUser.etablissement
      ? {
          id: dbUser.etablissement.id,
          nom: dbUser.etablissement.nom ?? dbUser.etablissement.name ?? "",
          type: dbUser.etablissement.type ?? "",
          adresse: dbUser.etablissement.adresse ?? "",
          niveau: dbUser.etablissement.niveau ?? null,
          isPublic: dbUser.etablissement.isPublic ?? false,
        }
      : null,
    
    enseignant: dbUser.enseignant
      ? {
          id: dbUser.enseignant.id,
          school: dbUser.enseignant.school ?? null,
          position: dbUser.enseignant.position ?? null,
          experience: dbUser.enseignant.experience ?? null,
          degree: dbUser.enseignant.degree ?? null,
          validated: dbUser.enseignant.validated ?? false,
        }
      : null,
    
    donateur: dbUser.donateur
      ? {
          id: dbUser.donateur.id,
          donorType: dbUser.donateur.donorType ?? null,
          sector: dbUser.donateur.sector ?? null,
        }
      : null,
  };
}