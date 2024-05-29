"use server";

import crawlerClient from "@/server/client/crawler.client";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import AuthUtil from "@/server/utils/auth-util";
import { GetGameIdSchema } from "./schema";

type GameIdFormState = {
  ok: boolean;
  message?: string;
};

export async function getGameIdAction(
  _prevState: GameIdFormState | null,
  formData: FormData
) {
  const validatedFields = GetGameIdSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: await AuthUtil.getUserSeqThrows(),
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      paramErrors: validatedFields.error.flatten(),
      message: "입력한 정보를 다시 확인해주세요",
    };
  }

  const { email, password, userSeq } = validatedFields.data;

  const crawlingResponse = await crawlerClient.getGameIds(email, password);
  if (!crawlingResponse.ok) {
    return {
      ok: false,
      message: crawlingResponse.error,
    };
  }

  for (const profile of crawlingResponse.data) {
    const gameId = profile.nickname;
    const exist = await PiuProfileDB.getByGameId(gameId);
    if (exist) {
      if (exist.userSeq !== userSeq) {
        return {
          ok: false,
          error: "ALREADY_ASSOCIATED_OTHER_ACCOUNT",
          message: `다른 계정에 연동되어있습니다. 관리자에게 문의해주세요`,
        };
      } else {
        await PiuProfileDB.update(gameId, profile);
      }
    } else {
      await PiuProfileDB.create(userSeq, profile);
    }
  }

  return { ok: true };
}
