// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const username = body?.username?.trim?.();
    const password = body?.password;

    if (!username || !password) {
      return NextResponse.json({ error: "Email/identifiant et mot de passe requis" }, { status: 400 });
    }

    // username peut être un email ou un identifiant; ajuste selon ton modèle
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
           {  telephone: username  }
          ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    // Compatibilité : certains schémas ont "typeProfil" au lieu de "type"
    const type = (user as any).type ?? (user as any).typeProfil;

    const token = jwt.sign(
      { userId: user.id, role: user.role, type },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies(); // Next 15: dynamic API => await
    cookieStore.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    // ✅ TOUJOURS JSON (jamais redirect)
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/auth/login error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
