"use server";

import { syncRecentlyPlayedAction as _syncRecentlyPlayedAction } from "@/server/action/sync-recently-played.action";
import AuthUtil from "@/server/utils/auth-util";
import type { PiuAuth } from "@/types/piu-auth";

export async function syncRecentlyPlayedAction(piuAuth: PiuAuth) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const crawlingRes = await _syncRecentlyPlayedAction(piuAuth, userSeq);
  if (!crawlingRes.ok) {
    return { ok: false, message: crawlingRes.message };
  }

  return { ok: true, message: "기록 동기화가 완료되었습니다" };
}
