"use server";

import { auth } from "@/auth";
import crawlerClient from "@/server/client/crawler.client";
import prisma from "@/server/prisma/client";
import type { GameId } from "@/types/game-id";
import { HTTPError } from "ky";
import { z } from "zod";

export type GameIdFormState = {
  ok: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    crawler?: string;
  };
  message?: string;
};

const participateRoomSchema = z.object({
  email: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  userSeq: z.coerce.number().gt(0, "유저 정보가 잘못되었습니다"),
});

export async function getGameIdAction(
  prevState: GameIdFormState,
  formData: FormData
): Promise<GameIdFormState> {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;

  const validatedFields = participateRoomSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: maybeUserSeq,
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "입력한 정보를 다시 확인해주세요",
    };
  }

  const { email, password, userSeq } = validatedFields.data;

  try {
    const res = await crawlerClient
      .getGameIds(email, password)
      .json<{ gameIds: GameId[] }>();

    const piuProfiles = await prisma.piuProfile.findMany({
      where: {
        gameId: {
          in: res.gameIds.map((id) => id.nickname),
        },
      },
    });

    const notExistIds = res.gameIds.filter(
      (id) => !piuProfiles.find((profile) => profile.gameId === id.nickname)
    );

    await prisma.piuProfile.createMany({
      data: notExistIds.map((id) => ({
        userSeq,
        gameId: id.nickname,
        lastPlayedCenter: id.latestGameCenter,
        lastLoginDate: id.latestLoginDate === "-" ? null : id.latestLoginDate,
      })),
    });

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

    // console.log(errorMsg);

    return {
      ok: false,
      errors: { crawler: errorMsg },
      message: "실패했습니다",
    };
  }
}
