"use server";

import { auth } from "@/auth";
import crawlerClient from "@/server/client/crawler.client";
import piuProfileDb from "@/server/prisma/piu-profile.db";
import SongDB from "@/server/prisma/song-db";
import { RecentlyPlayed } from "@/types/recently-played";
import { HTTPError } from "ky";
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

  try {
    const resBody = await crawlerClient
      .getRecentlyPlayed(email, password, nickname)
      .json<{ recentlyPlayed: RecentlyPlayed[] }>();

    const profile = await piuProfileDb.createIfNotExist(userSeq, nickname);

    const songNames = resBody.recentlyPlayed.map((record) => record.songName);
    const songs = await SongDB.getSongsByName(songNames);
    resBody.recentlyPlayed
      .filter((record) => {
        const song = songs.find((song) => song.name === record.songName);
        return Boolean(song);
      })
      .map((record) => {});

    return { ok: true, data: resBody.recentlyPlayed };
  } catch (e) {
    let errorMsg: string;
    if (e instanceof HTTPError) {
      const errorBody = await e.response.json();
      errorMsg = errorBody;
    } else {
      console.log(e);
      errorMsg = (e as Error).message;
    }

    return {
      ok: false,
      errors: errorMsg,
      message: "실패했습니다",
    };
  }
}
