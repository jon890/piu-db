"use server";

import CrawlerClient from "@/server/client/crawler.client";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import RecordDB from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import type { PiuAuth } from "@/types/piu-auth";

export async function syncMyBestScoreAction(piuAuth: PiuAuth) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const primaryProfile = await PiuProfileDB.getPrimary(userSeq);
  if (!primaryProfile) {
    return { ok: false, message: "주 계정정보가 없습니다" };
  }

  const crawlingRes = await CrawlerClient.getMyBestScores(
    piuAuth,
    primaryProfile.gameId
  );
  if (!crawlingRes.ok) {
    return { ok: false, message: crawlingRes.error };
  }

  await RecordDB.saveBestScores(userSeq, primaryProfile.seq, crawlingRes.data);

  return { ok: true, message: "기록 동기화가 완료되었습니다" };
}
