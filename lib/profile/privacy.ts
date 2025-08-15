// lib/profile/privacy.ts
export const mask = (value?: string | null) =>
  !value ? "—" : value.replace(/.(?=.{2})/g, "•");

export function protectedContact(value?: string | null, isFriend?: boolean) {
  if (!value) return "—";
  return isFriend ? value : mask(value);
}

export function initials(nameOrEmail: string) {
  const base = nameOrEmail.includes("@")
    ? nameOrEmail.split("@")[0]
    : nameOrEmail;
  return base
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]!.toUpperCase())
    .join("");
}

export const roleLabel: Record<UserRole, string> = {
  SIMPLE: "Simple utilisateur",
  ADMIN: "Administrateur d’établissement",
  SUPERADMIN: "Super administrateur",
};