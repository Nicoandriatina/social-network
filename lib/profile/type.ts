// lib/profile/types.ts
export type UserRole = "SIMPLE" | "ADMIN" | "SUPERADMIN";
export type UserType = "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR";

export type EtablissementType = "PUBLIC" | "PRIVE";
export type EtablissementNiveau = "EPP" | "CEG" | "LYCEE" | "COLLEGE" | "UNIVERSITE" | "ORGANISME";

export interface EtablissementLite {
  id: string;
  nom: string;
  type: EtablissementType;
  adresse: string | null;
}

export interface UserDTO {
  id: string;
  email: string;
  nom: string | null;
  avatarUrl: string | null;
  role: UserRole;
  typeProfil: UserType | null;
  etablissement: EtablissementLite | null;
  isProfileComplete: boolean;
  // optionnels à afficher/éditer
  telephone?: string | null;
  adressePostale?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  whatsapp?: string | null;
  secteur?: string | null;
  profession?: string | null;
  scolariteAnnee?: number[] | null;
}