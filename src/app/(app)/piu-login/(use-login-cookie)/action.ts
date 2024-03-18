"use server";

import { auth } from "@/auth";
import crawlerClient from "@/server/client/crawler.client";
import ChartDB from "@/server/prisma/chart.db";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import RecordDB from "@/server/prisma/record.db";
import SongDB from "@/server/prisma/song.db";
import { RecentlyPlayed } from "@/types/recently-played";
import { GetRecentlyPlayedSchema } from "./schema";
import AuthUtil from "@/server/utils/auth-util";
import { cookies } from "next/headers";
import CryptService from "@/server/crypt/crypt.service";

export type State = {
  ok: boolean;
  message?: string;
  data?: RecentlyPlayed[];
};

export async function useLoginCookieAction(
  prevState: State | null,
  formData: FormData
) {
  const validatedFields = GetRecentlyPlayedSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: await AuthUtil.getUserSeqThrows(),
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      paramError: validatedFields.error.flatten(),
      message: "입력한 정보를 다시 확인해주세요",
    };
  }

  const { email, password, userSeq } = validatedFields.data;

  const login = JSON.stringify({
    email,
    password,
  });

  const encrypted = await CryptService.encrypt(login);
  const oneMonth = 30 * 24 * 60 * 60 * 1000;
  const domain =
    process.env.NODE_ENV === "production" ? "piudb.com" : "localhost";
  cookies().set("_PUMPITUPAUTH", encrypted, {
    domain,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: Date.now() + oneMonth,
  });

  return {
    ok: true,
  };
}
