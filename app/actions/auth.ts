"use server";

import { redirect } from "next/navigation";
import { RegisterSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function registerAction(data: unknown) {
  let isSuccess = false;
  let errorMessage: string | null = null;

  try {
    const validated = RegisterSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      errorMessage = "akun sudah terdaftar";
    } else {
      const hashedPassword = await bcrypt.hash(validated.password, 10);
      await prisma.user.create({
        data: {
          email: validated.email,
          name: validated.name || null,
          company_name: validated.company_name || null,
          password: hashedPassword,
        },
      });
      isSuccess = true;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      errorMessage = error.issues[0]?.message || "Input tidak valid.";
    } else {
      errorMessage = "Terjadi kesalahan pada server.";
    }
  }

  if (isSuccess) {
    redirect("/login?success=Akun Berhasil Dibuat!");
  }

  return { error: errorMessage };
}
