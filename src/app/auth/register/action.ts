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

  // todo uid 중복시 재시도?
  await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      nickname,
      uid: getRandomUID(6),
    },
  });

  redirect("/auth/login");
}

function getRandomUID(length: number) {
  const candidates =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

  let uid = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * candidates.length);
    uid += candidates[index];
  }

  return uid;
}
