"use server";

import prisma from "@/server/prisma/client";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

type State = {
  errors?: {
    name?: string[];
    password?: string[];
    passwordConfirm?: string[];
    nickname?: string[];
  };
  message?: string | null;
};

const regsiterUserSchema = z.object({
  name: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(6, "비밀번호는 최소 6자리로 설정해주세요"),
  passwordConfirm: z.string().min(6, "비밀번호는 최소 6자리로 설정해주세요"),
  nickname: z.string().min(1, "닉네임을 입력해주세요"),
});

export async function registerUser(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = regsiterUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Register User.",
    };
  }

  const { name, nickname, password, passwordConfirm } = validatedFields.data;

  if (password !== passwordConfirm) {
    return {
      errors: {
        passwordConfirm: ["비밀번호와 비밀번호 확인이 다릅니다"],
      },
      // message: "Password and PasswordConfirm is not match",
    };
  }

  const exist = await prisma.user.findMany({
    where: {
      OR: [{ name }, { nickname }],
    },
  });

  if (exist.find((it) => it.name === name)) {
    return {
      errors: {
        name: ["아이디가 중복되었습니다"],
      },
      // message: "id duplicated",
    };
  }

  if (exist.find((it) => it.nickname === nickname)) {
    return {
      errors: {
        nickname: ["닉네임이 중복되었습니다"],
      },
      // message: "nickname duplicated",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      password: hashedPassword,
      nickname,
    },
  });

  // revalidatePath("/auth/reigster");
  redirect("/auth/login");
}
