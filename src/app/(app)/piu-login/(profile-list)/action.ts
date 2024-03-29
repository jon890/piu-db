"use server";

import PiuProfileDB from "@/server/prisma/piu-profile.db";
import AuthUtil from "@/server/utils/auth-util";

export async function getPiuProfiles() {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const profiles = await PiuProfileDB.getPiuProfiles(userSeq);
  return { profiles };
}
