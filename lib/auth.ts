import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { type Role } from "./rbac";

export type AuthUser = {
  id: string;
  role: Role;
  type: "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR";
};

export async function getAuthUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const token = store.get("token")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string; role: Role; type: AuthUser["type"];
    };
    // optionnel: recharger depuis DB si tu veux vérifier l’état actuel
    // const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, role: true, type: true }});
    // if (!user) return null;
    return { id: payload.userId, role: payload.role, type: payload.type };
  } catch {
    return null;
  }
}

// “Guard” minimal pour routes API / server actions
export async function requirePermission(perm: import("./rbac").Permission) {
  const auth = await getAuthUser();
  if (!auth) return { ok: false as const, status: 401, reason: "unauthorized" };
  const { can } = await import("./rbac");
  if (!can(auth.role, perm)) return { ok: false as const, status: 403, reason: "forbidden" };
  return { ok: true as const, auth };
}
