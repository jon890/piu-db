"use server";

import { auth } from "@/auth";
import { HTTPError } from "ky";
import { z } from "zod";
import crawlerClient from "../client/crawler.client";
import prisma from "../prisma/client";

export type GameIdFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    crawler?: string;
  };
  message?: string;
  data?: any;
};

export type GameId = {
  title: string;
  nickname: string;
  latestLoginDate: string;
  latestGameCenter: string;
};

const participateRoomSchema = z.object({
  email: z.string(),
  password: z.string(),
  userSeq: z.coerce.number().gt(0, "유저 정보가 잘못되었습니다"),
});

export async function getGameId(
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
      errors: validatedFields.error.flatten().fieldErrors,
      message: "로그인 정보가 잘못되었습니다",
    };
  }

  const { email, password, userSeq } = validatedFields.data;

  try {
    const res = await crawlerClient
      .getGameIds(email, password)
      .json<{ gameIds: GameId[] }>();

    console.log(res);

    const piuProfiles = await prisma.piuProfile.findMany({
      where: {
        gameId: {
          in: res.gameIds.map((id) => id.nickname),
        },
      },
    });

    console.log(piuProfiles);

    const notExistIds = res.gameIds.filter((id) =>
      piuProfiles.find((profile) => profile.gameId === id.nickname)
    );

    console.log(notExistIds);

    await prisma.piuProfile.createMany({
      data: notExistIds.map((id) => ({
        userSeq,
        gameId: id.nickname,
        lastPlayedCenter: id.latestGameCenter,
        lastLoginDate: id.latestLoginDate === "-" ? null : id.latestLoginDate,
      })),
    });

    return { data: res };
  } catch (e) {
    let errorMsg: string;
    if (e instanceof HTTPError) {
      const errorBody = await e.response.json();
      errorMsg = errorBody;
    } else {
      console.log(e);
      errorMsg = (e as Error).message;
    }

    return { errors: { crawler: errorMsg }, message: "실패했습니다" };
  }
}
