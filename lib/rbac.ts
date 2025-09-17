// lib/rbac.ts
export type Role = "SIMPLE" | "ADMIN" | "SUPERADMIN";
export type Permission =
  | "profil:read"
  | "profil:update"
  | "projet:create"
  | "projet:read"
  | "projet:update"
  | "projet:delete"
  | "enseignant:validate"
  | "don:view"
  | "don:create"
  | "admin:panel";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SIMPLE: ["profil:read", "profil:update", "projet:read", "don:view"],
  ADMIN: [
    "profil:read", "profil:update",
    "projet:read", "projet:create", "projet:update", "projet:delete",
    "enseignant:validate", "don:view"
  ],
  SUPERADMIN: [
    "profil:read","profil:update",
    "projet:read","projet:create","projet:update","projet:delete",
    "enseignant:validate","don:view","don:create",
    "admin:panel"
  ],
};

export function can(role: Role, perm: Permission) {
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}
