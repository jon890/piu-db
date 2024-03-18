"use server";

import PiuProfileDB from "@/server/prisma/piu-profile.db";
import AuthUtil from "@/server/utils/auth-util";

export async function setPrimary(gameId: string) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  await PiuProfileDB.setPrimary(userSeq, gameId);
}
