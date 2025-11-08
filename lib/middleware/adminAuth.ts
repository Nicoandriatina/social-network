// lib/middleware/adminAuth.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface JWTPayload {
  userId: string;
  role: string;
  type: string;
}

export async function requireSuperAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Non authentifié" },
          { status: 401 }
        ),
      };
    }

    // Vérifier le token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    if (!payload.userId) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Token invalide" },
          { status: 401 }
        ),
      };
    }

    // Vérifier que l'utilisateur est bien SUPERADMIN
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, fullName: true, email: true },
    });

    if (!user || user.role !== "SUPERADMIN") {
      // 🔥 Logger la tentative d'accès non autorisée
      console.warn(
        `🚨 Tentative d'accès admin non autorisée - User ID: ${payload.userId}`
      );

      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Accès réservé aux super administrateurs" },
          { status: 403 }
        ),
      };
    }

    // ✅ Utilisateur autorisé
    return {
      authorized: true,
      user,
    };
  } catch (error) {
    console.error("Erreur middleware admin:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Token invalide" },
          { status: 401 }
        ),
      };
    }

    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Erreur serveur" },
        { status: 500 }
      ),
    };
  }
}

// Helper pour logger les actions admin
export async function logAdminAction(
  adminId: string,
  action: string,
  details?: any
) {
  console.log(`[ADMIN ACTION] ${action}`, {
    adminId,
    timestamp: new Date().toISOString(),
    details,
  });

  // TODO: Sauvegarder dans une table AdminLogs si nécessaire
  // await prisma.adminLog.create({
  //   data: { adminId, action, details, timestamp: new Date() }
  // });
}