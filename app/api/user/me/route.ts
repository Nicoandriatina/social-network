
// // app/api/user/me/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

// export async function GET() {
//   try {
//     const cookieStore = await cookies(); // Next 15: await requis
//     const token = cookieStore.get("token")?.value;
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//     if (!payload?.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

//     const dbUser = await prisma.user.findUnique({
//       where: { id: payload.id },
//       include: {
//         etablissement: true,   // si relation
//         enseignant: true,      // si relation
//         donateur: true,        // si relation
//       },
//     });

//     if (!dbUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

//     // ---- MAPPING VERS UN FORMAT STABLE POUR LE FRONT ----
//     const user = {
//       id: dbUser.id,
//       nom: dbUser.fullName ?? dbUser.name ?? "",          // <= ton composant lit `nom`
//       email: dbUser.email,
//       role: dbUser.role,                                  // ex: SIMPLE / ADMIN / SUPERADMIN
//       typeProfil: dbUser.type,                            // ex: ETABLISSEMENT / ENSEIGNANT / DONATEUR
//       avatar: dbUser.avatar ?? null,
//       telephone: dbUser.telephone ?? dbUser.phone ?? null,

//       // Optionnel: réseaux
//       facebook: dbUser.facebook ?? null,
//       twitter: dbUser.twitter ?? null,
//       whatsapp: dbUser.whatsapp ?? null,

//       // Sous-objets éventuels, avec clés front stables
//       etablissement: dbUser.etablissement
//         ? {
//             id: dbUser.etablissement.id,
//             nom: dbUser.etablissement.nom ?? dbUser.etablissement.name ?? "",
//             type: dbUser.etablissement.type ?? dbUser.etablissement.kind ?? "",
//             adresse: dbUser.etablissement.adresse ?? dbUser.etablissement.address ?? "",
//             niveau: dbUser.etablissement.niveau ?? dbUser.etablissement.level ?? null,
//             isPublic: dbUser.etablissement.isPublic ?? null,
//           }
//         : null,

//       enseignant: dbUser.enseignant
//         ? {
//             id: dbUser.enseignant.id,
//             matiere: dbUser.enseignant.matiere ?? null,
//             valideParEtab: dbUser.enseignant.isValidated ?? false,
//           }
//         : null,

//       donateur: dbUser.donateur
//         ? {
//             id: dbUser.donateur.id,
//             organisation: dbUser.donateur.organisation ?? null,
//           }
//         : null,
//     };

//     return NextResponse.json({ user });
//   } catch (e) {
//     console.error("GET /api/user/me error", e);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// app/api/user/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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
            isPublic: (dbUser as any).etablissement.isPublic ?? null,
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
