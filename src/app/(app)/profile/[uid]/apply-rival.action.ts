"use server";

import RivalDB from "@/server/prisma/rival.db";
import { ApplyRivalSchema } from "./apply-rival.schema";
import AuthUtil from "@/server/utils/auth-util";

type State = {
  ok: boolean;
  message?: string;
};

export async function applyRival(prevState: State | null, formData: FormData) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const validatedFields = ApplyRivalSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      ok: false,
      errors: validatedFields.error.flatten(),
      message: "오류가 발생했습니다",
    };
  }

  const { data } = validatedFields;

  const ret = await RivalDB.createRival(userSeq, data.uid);
  if (!ret) {
    return {
      ok: false,
      message: "오류가 발생했습니다",
    };
  } else {
    return {
      ok: true,
    };
  }
}
