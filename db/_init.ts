import { PrismaClient } from "@prisma/client";
import { FIESTA_TO_FIESTA2_SONGS } from "./fiesta-to-fiesta2";
import { FIRST_ZERO_SONGS } from "./first-to-zero";
import { NX_NXA_SONGS } from "./nx-to-nxa";
import { PHOENIX_SONGS } from "./phoenix";
import { PRIME_SONGS } from "./prime";
import { PRIME2_SONGS } from "./prime2";
import { SongData } from "./song-type";
import { XX_SONGS } from "./xx";

const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

async function initSongAndCharts(songs: SongData[], upsertCharts?: boolean) {
  for (const song of songs) {
    const songEntity = await prisma.song.upsert({
      where: {
        name: song.name,
      },
      create: {
        name: song.name,
        artist: song.artist,
        bpm: song.bpm,
        version: song.version,
        songType: song.songType,
        isPremium: song.isPremium,
        patchVersion: song.patchVersion,
        charts: {
          create: [...song.charts],
        },
        imageUrl: song.imageUrl,
      },
      update: {
        name: song.name,
        artist: song.artist,
        bpm: song.bpm,
        version: song.version,
        songType: song.songType,
        isPremium: song.isPremium,
        patchVersion: song.patchVersion,
        imageUrl: song.imageUrl,
      },
    });

    if (upsertCharts) {
      for (const chart of song.charts) {
        await prisma.chart.upsert({
          where: {
            songSeq_chartType_level: {
              songSeq: songEntity.seq,
              chartType: chart.chartType,
              level: chart.level,
            },
          },
          create: {
            songSeq: songEntity.seq,
            chartType: chart.chartType,
            level: chart.level,
          },
          update: {},
        });
      }
    }
  }
}

async function main() {
  // await initSongAndCharts(FIRST_ZERO_SONGS, true);
  // await initSongAndCharts(NX_NXA_SONGS);
  // await initSongAndCharts(FIESTA_TO_FIESTA2_SONGS, true);
  // await initSongAndCharts(PRIME_SONGS);
  // await initSongAndCharts(PRIME2_SONGS, true);
  // await initSongAndCharts(XX_SONGS, true);
  await initSongAndCharts(PHOENIX_SONGS);
}

main();
