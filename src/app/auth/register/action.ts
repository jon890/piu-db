"use server";

import prisma from "@/server/prisma/client";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { RegisterUserSchema } from "./schema";

type State = {
  message?: string;
};

export async function registerUser(
  prevState: State | null,
  formData: FormData
) {
  const validatedFields = await RegisterUserSchema.safeParseAsync(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
      message: "Missing Fields. Failed to Register User.",
    };
  }

  const { name, nickname, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      nickname,
    },
  });

  redirect("/auth/login");
}
