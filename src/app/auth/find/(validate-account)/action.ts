"use server";

import crawlerClient from "@/server/client/crawler.client";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import UserDB from "@/server/prisma/user.db";
import { FindIdSchema } from "./schema";

type State = {
  ok: boolean;
  message?: string;
};

export async function findIdAction(
  prevState: State | null,
  formData: FormData
) {
  const validatedFields = FindIdSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      paramErrors: validatedFields.error.flatten(),
      message: "입력한 정보를 다시 확인해주세요",
    };
  }

  const { email, password } = validatedFields.data;

  const res = await crawlerClient.getGameIds(email, password);

  if (!res.ok) {
    return {
      ok: false,
      error: res.error,
      message: `로그인에 실패했습니다: ${res.error}`,
    };
  }

  let userSeq = -1;
  let exist = false;
  for (const profile of res.data) {
    const gameId = profile.nickname;
    const piuProfile = await PiuProfileDB.getByGameId(gameId);
    if (piuProfile) {
      userSeq = piuProfile.userSeq;
      exist = true;
      break;
    }
  }
  const user = await UserDB.getUserBySeq(userSeq);
  if (!exist || !user) {
    return {
      ok: false,
      error: "NOT_FOUND_USER",
      message: "가입 정보가 없습니다",
    };
  }

  return { ok: true, userId: user.name };
}
