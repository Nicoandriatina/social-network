// // lib/validation/userUpdate.ts
// import * as z from "zod";

// export const BaseUserUpdate = z.object({
//   fullName: z.string().min(2).max(120).optional(),
//   avatar: z.string().url().nullable().optional(),
//   telephone: z.string().min(6).max(20).nullable().optional(),
//   address: z.string().max(200).nullable().optional(),
//   facebook: z.string().url().nullable().optional(),
//   twitter: z.string().url().nullable().optional(),
//   whatsapp: z.string().max(30).nullable().optional(),
//   profession: z.string().max(120).nullable().optional(),
// });

// export const EtablissementUpdate = z.object({
//   etablissement: z.object({
//     nom: z.string().min(2).max(140).optional(),
//     type: z.enum(["PUBLIC", "PRIVE"]).optional(),
//     niveau: z.enum(["EPP","CEG","LYCEE","COLLEGE","UNIVERSITE","ORGANISME"]).optional(),
//     adresse: z.string().max(200).optional(),
//     isPublic: z.boolean().nullable().optional(),
//   }).partial().optional(),
// });

// export const EnseignantUpdate = z.object({
//   enseignant: z.object({
//     matiere: z.string().max(100).optional(),
//     experience: z.string().max(200).optional(),
//     degree: z.string().max(140).optional(),
//   }).partial().optional(),
// });

// export const DonateurUpdate = z.object({
//   donateur: z.object({
//     organisation: z.string().max(140).optional(),
//     secteur: z.string().max(140).optional(),
//   }).partial().optional(),
// });

// export const UpdateForType = {
//   ETABLISSEMENT: BaseUserUpdate.merge(EtablissementUpdate),
//   ENSEIGNANT: BaseUserUpdate.merge(EnseignantUpdate),
//   DONATEUR: BaseUserUpdate.merge(DonateurUpdate),
// } as const;

// export type UpdatePayload<T extends "ETABLISSEMENT"|"ENSEIGNANT"|"DONATEUR"> = z.infer<(typeof UpdateForType)[T]>;


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