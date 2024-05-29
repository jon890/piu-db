"use server";

import crawlerClient from "@/server/client/crawler.client";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import RecordDB from "@/server/prisma/record.db";
import { PiuAuth } from "@/types/piu-auth";
import dayjs from "dayjs";
import ActionLogDB from "../prisma/action-log.db";
import { ToastLevel } from "@/types/toast";

/**
 * 크롤러에 최근 플레이 데이터를 요청하고
 * DB에 동기화 시키는
 * 서버 액션
 * @param piuAuth
 * @param userSeq
 * @returns
 */
export async function syncRecentlyPlayedAction(
  piuAuth: PiuAuth,
  userSeq: number
) {
  // 최근 동기화가 10분 이내이면 다시 실행하지 않음
  const latestSyncRecord = await ActionLogDB.getLatestSyncRecord({ userSeq });
  if (
    latestSyncRecord &&
    dayjs().utc().diff(latestSyncRecord.createdAt, "minute") < 10
  ) {
    return {
      ok: false,
      type: "info" as ToastLevel,
      message: "10분 이내에 동기화 한 기록이 있어서 다시 실행하지 않습니다",
    };
  }

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

  await RecordDB.saveRecentRecord(
    userSeq,
    primaryProfile.seq,
    crawlingRes.data
  );
  await ActionLogDB.create({
    actionType: "SYNC_RECORD",
    userSeq,
  });

  return {
    ok: true,
    data: crawlingRes.data,
  };
}
