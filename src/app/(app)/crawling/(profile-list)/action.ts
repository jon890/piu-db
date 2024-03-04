"use server";

import { auth } from "@/auth";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import { PiuProfile } from "@prisma/client";

type State = {
  profiles: PiuProfile[];
};

export async function getPiuProfiles() {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;
  if (!maybeUserSeq) return { profiles: [] };

  const profiles = await PiuProfileDB.getPiuProfiles(Number(maybeUserSeq));

  return { profiles };
}
