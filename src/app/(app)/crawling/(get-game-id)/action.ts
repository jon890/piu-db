"use server";

import { auth } from "@/auth";
import crawlerClient from "@/server/client/crawler.client";
import prisma from "@/server/prisma/client";
import type { GameId } from "@/types/game-id";
import { HTTPError } from "ky";
import { GetGameIdSchema } from "./schema";

type GameIdFormState = {
  ok: boolean;
  message?: string;
};

export async function getGameIdAction(
  prevState: GameIdFormState | null,
  formData: FormData
) {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;

  const validatedFields = GetGameIdSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: maybeUserSeq,
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      paramErrors: validatedFields.error.flatten(),
      message: "입력한 정보를 다시 확인해주세요",
    };
  }

  const { email, password, userSeq } = validatedFields.data;

  try {
    const res = await crawlerClient
      .getGameIds(email, password)
      .json<{ gameIds: GameId[] }>();

    for (const profile of res.gameIds) {
      await prisma.piuProfile.upsert({
        where: {
          gameId: profile.nickname,
        },
        update: {
          lastPlayedCenter: profile.latestGameCenter,
          lastLoginDate:
            profile.latestLoginDate === "-" ? null : profile.latestLoginDate,
        },
        create: {
          userSeq,
          gameId: profile.nickname,
          lastPlayedCenter: profile.latestGameCenter,
          lastLoginDate:
            profile.latestLoginDate === "-" ? null : profile.latestLoginDate,
        },
      });
    }

    return { ok: true };
  } catch (e) {
    let errorMsg: string;
    if (e instanceof HTTPError) {
      const errorBody = await e.response.json();
      // todo crawler 에러 추상화
      errorMsg = (errorBody as any).error;
    } else {
      errorMsg = (e as Error).message;
    }

    return {
      ok: false,
      error: errorMsg,
      message: "실패했습니다",
    };
  }
}
