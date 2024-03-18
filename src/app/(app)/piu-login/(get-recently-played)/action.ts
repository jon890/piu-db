"use server";

import crawlerClient from "@/server/client/crawler.client";
import ChartDB from "@/server/prisma/chart.db";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import RecordDB from "@/server/prisma/record.db";
import SongDB from "@/server/prisma/song.db";
import { PiuAuth } from "@/types/piu-auth";

export async function getAndSaveRecentlyPlayedAction(
  piuAuth: PiuAuth,
  userSeq: number
) {
  const primaryProfile = await PiuProfileDB.getPrimary(userSeq);

  if (!primaryProfile) {
    return { ok: false, message: "주 계정정보가 없습니다" };
  }

  const crawlingRes = await crawlerClient.getRecentlyPlayed(
    piuAuth.email,
    piuAuth.password,
    primaryProfile.gameId
  );

  if (!crawlingRes.ok) {
    return {
      ok: false,
      message: crawlingRes.error,
    };
  }

  // cache enable
  await SongDB.findAll();
  await ChartDB.findAll();

  for (const record of crawlingRes.data) {
    await RecordDB.saveRecentRecord(userSeq, primaryProfile.seq, record);
  }

  return {
    ok: true,
    data: crawlingRes.data,
  };
}
