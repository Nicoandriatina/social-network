

// // ✅ ce fichier doit être en pur backend (lib/auth.ts)
// import { headers } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import { prisma } from './prisma';

// export async function getCurrentUser() {
//   try {
//     const headersList = await headers(); // ✅ pas besoin de typer ni de await

//     const auth = headersList.get('authorization');
//     const cookieHeader = headersList.get('cookie');

//     const token =
//       auth?.replace('Bearer ', '') ||
//       cookieHeader?.split('token=')[1]?.split(';')[0];

//     if (!token) return null;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       id: string;
//     };

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//     });

//     return user;
//   } catch (error) {
//     console.error('getCurrentUser error:', error);
//     return null;
//   }
// }

// // lib/auth/getUserFromServer.ts
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";

// export async function getUserFromServer() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;
//   if (!token) return null;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//     const u = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       include: { etablissement: true },
//     });
//     if (!u) return null;

//     // DTO safe et stable (même shape que /api/user/me)
//     return {
//       id: u.id,
//       email: u.email,
//       nom: u.fullName ?? null,
//       avatarUrl: u.avatar ?? null,
//       role: u.role,
//       typeProfil: u.type,
//       etablissement: u.etablissement
//         ? {
//             id: u.etablissement.id,
//             nom: u.etablissement.nom,
//             type: u.etablissement.type,
//             adresse: u.etablissement.adresse ?? null,
//           }
//         : null,
//       isProfileComplete: Boolean(u.fullName && u.avatar),
//       telephone: u.telephone ?? null,
//       adressePostale: u.adressePostale ?? null,
//       facebook: u.facebook ?? null,
//       twitter: u.twitter ?? null,
//       whatsapp: u.whatsapp ?? null,
//       secteur: u.secteur ?? null,
//       profession: u.profession ?? null,
//       scolariteAnnee: u.scolariteAnnee ?? [],
//     };
//   } catch {
//     return null;
//   }
// }
