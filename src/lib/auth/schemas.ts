import { z } from "zod";

export const emailSchema = z.string().email("Ungültige E-Mail-Adresse");
export const passwordSchema = z
  .string()
  .min(8, "Mindestens 8 Zeichen")
  .max(72, "Maximal 72 Zeichen");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().min(2, "Mindestens 2 Zeichen").max(80),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Passwort erforderlich"),
});

export const createClubSchema = z.object({
  name: z.string().min(2, "Mindestens 2 Zeichen").max(120),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "PLZ muss 5 Ziffern haben")
    .optional()
    .or(z.literal("")),
  sports: z.array(z.string().min(1)).max(20).default([]),
  federationId: z.string().uuid().optional().nullable(),
});

export const createInvitationSchema = z.object({
  role: z.enum(["admin", "member"]),
});

export const redeemInvitationSchema = z.object({
  token: z.string().min(16).max(128),
});
