"use server";

import { auth } from "@/auth";
import { PiuProfile } from "@prisma/client";
import piuProfileDb from "../prisma/piu-profile-db";

type State = {
  profiles: PiuProfile[];
};

export async function getPiuProfiles(prevState: State, formData: FormData) {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;
  if (!maybeUserSeq) return { profiles: [] };

  const profiles = await piuProfileDb.getPiuProfiles(Number(maybeUserSeq));

  return { profiles };
}
