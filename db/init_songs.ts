import { PrismaClient } from "@prisma/client";
import { FIESTA_TO_FIESTA2_SONGS } from "./fiesta-to-fiesta2";
import { FIRST_ZERO_SONGS } from "./first-to-zero";
import { NX_NXA_SONGS } from "./nx-to-nxa";
import { PHOENIX_SONGS } from "./phoenix";
import { PRIME_SONGS } from "./prime";
import { SongData } from "./song-type";

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

async function initSongAndCharts(songs: SongData[]) {
  for (const song of songs) {
    await prisma.song.create({
      data: {
        name: song.name,
        artist: song.artist,
        bpm: song.bpm,
        version: song.version,
        songType: song.songType,
        charts: {
          create: [...song.charts],
        },
      },
    });
  }
}

async function deleteAll() {
  await prisma.chart.deleteMany();
  await prisma.song.deleteMany();
}

async function main() {
  await deleteAll();
  await initSongAndCharts(FIRST_ZERO_SONGS);
  await initSongAndCharts(NX_NXA_SONGS);
  await initSongAndCharts(FIESTA_TO_FIESTA2_SONGS);
  await initSongAndCharts(PRIME_SONGS);
  await initSongAndCharts(PHOENIX_SONGS);
}

main();
