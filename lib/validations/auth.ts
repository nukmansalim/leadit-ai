import { z } from "zod";

export const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
  name: z
    .string()
    .optional()
    .transform((val) => val || undefined),
  company_name: z
    .string()
    .optional()
    .transform((val) => val || undefined),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password wajib diisi"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

