"use server";

import { auth } from "@/auth";
import crawlerClient from "@/server/client/crawler.client";
import { RecentlyPlayed } from "@/types/recently-played";
import { HTTPError } from "ky";
import { z } from "zod";

export type RecentlyPlayedFormState = {
  ok: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    crawler?: string;
  };
  message?: string;
  data?: RecentlyPlayed[];
};

const getRecentlyPlayedSchema = z.object({
  email: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  nickname: z.string().min(1, "닉네임을 입력해주세요"),
  userSeq: z.coerce.number().gt(0, "유저 정보가 잘못되었습니다"),
});

export async function getRecentlyPlayed(
  prevState: RecentlyPlayedFormState,
  formData: FormData
): Promise<RecentlyPlayedFormState> {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;

  const validatedFields = getRecentlyPlayedSchema.safeParse({
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

  const { email, password, userSeq, nickname } = validatedFields.data;

  try {
    const res = await crawlerClient
      .getRecentlyPlayed(email, password, nickname)
      .json<{ recentlyPlayed: RecentlyPlayed[] }>();

    // const profile = await prisma.piuProfile.findMany({
    //   where: {
    //     gameId: nickname,
    //   },
    // });

    // if (!profile) {
    //   throw new Error("프로파일이 존재하지 않습니다");
    // }

    return { ok: true, data: res.recentlyPlayed };
  } catch (e) {
    let errorMsg: string;
    if (e instanceof HTTPError) {
      const errorBody = await e.response.json();
      errorMsg = errorBody;
    } else {
      console.log(e);
      errorMsg = (e as Error).message;
    }

    return {
      ok: false,
      errors: { crawler: errorMsg },
      message: "실패했습니다",
    };
  }
}
