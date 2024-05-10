"use server";

import UserDB from "@/server/prisma/user.db";
import { ResetPasswordSchema } from "./schema";
import bcrypt from "bcrypt";

type State = {
  step: number;
  userId?: string;
  ok?: boolean;
  message?: string;
};

export async function resetPasswordAction(
  prevState: State | null,
  formData: FormData
) {
  const validatedFields = ResetPasswordSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userId: prevState?.userId,
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      paramErrors: validatedFields.error.flatten(),
      message: "입력한 정보를 다시 확인해주세요",
      userId: prevState?.userId,
      step: 1,
    };
  }

  const { password, userId } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  await UserDB.updatePassword(userId, hashedPassword);

  return { ok: true, userId, step: 2 };
}
