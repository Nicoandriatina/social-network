// lib/validation/userUpdate.ts
import * as z from "zod";

const EtablissementUpdateSchema = z.object({
  fullName: z.string().min(3).optional(),
  avatar: z.string().optional(),
  telephone: z.string().optional(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  whatsapp: z.string().optional(),
  profession: z.string().optional(),
  etablissement: z.object({
    nom: z.string().optional(),
    type: z.enum(["PUBLIC", "PRIVE"]).optional(),
    niveau: z.enum(["EPP", "CEG", "LYCEE", "COLLEGE", "UNIVERSITE", "ORGANISME"]).optional(),
    adresse: z.string().optional(),
  }).optional(),
});

const EnseignantUpdateSchema = z.object({
  fullName: z.string().min(3).optional(),
  avatar: z.string().optional(),
  telephone: z.string().optional(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  whatsapp: z.string().optional(),
  profession: z.string().optional(),
  enseignant: z.object({
    school: z.string().optional(),
    position: z.string().optional(),
    experience: z.string().optional(),
    degree: z.string().optional(),
  }).optional(),
});

const DonateurUpdateSchema = z.object({
  fullName: z.string().min(3).optional(),
  avatar: z.string().optional(),
  telephone: z.string().optional(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  whatsapp: z.string().optional(),
  profession: z.string().optional(),
  donateur: z.object({
    donorType: z.string().optional(),
    sector: z.string().optional(),
  }).optional(),
});

export const UpdateForType = {
  ETABLISSEMENT: EtablissementUpdateSchema,
  ENSEIGNANT: EnseignantUpdateSchema,
  DONATEUR: DonateurUpdateSchema,
};