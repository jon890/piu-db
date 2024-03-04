"use server";

import { auth } from "@/auth";
import crawlerClient from "@/server/client/crawler.client";
import ChartDB from "@/server/prisma/chart.db";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import RecordDB from "@/server/prisma/record.db";
import SongDB from "@/server/prisma/song.db";
import { RecentlyPlayed } from "@/types/recently-played";
import { GetRecentlyPlayedSchema } from "./schema";

export type RecentlyPlayedFormState = {
  ok: boolean;
  message?: string;
  data?: RecentlyPlayed[];
};

export async function getRecentlyPlayedAction(
  prevState: RecentlyPlayedFormState | null,
  formData: FormData
) {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;

  const validatedFields = GetRecentlyPlayedSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: maybeUserSeq,
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      paramError: validatedFields.error.flatten(),
      message: "입력한 정보를 다시 확인해주세요",
    };
  }

  const { email, password, userSeq, nickname } = validatedFields.data;

  const crawlingRes = await crawlerClient.getRecentlyPlayed(
    email,
    password,
    nickname
  );

  if (!crawlingRes.ok) {
    return {
      ok: false,
      errors: crawlingRes.error,
    };
  }

  // 기록 저장
  const profile = await PiuProfileDB.createIfNotExist(userSeq, nickname);

  // cache enable
  await SongDB.findAll();
  await ChartDB.findAll();

  for (const record of crawlingRes.data) {
    await RecordDB.saveRecentRecord(profile.seq, record);
  }

  return {
    ok: true,
    data: crawlingRes.data,
  };
}
