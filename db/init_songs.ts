import { PrismaClient } from "@prisma/client";
import { Songs } from "./songs";

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

async function initSongAndCharts() {
  for (const song of Songs) {
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
  await initSongAndCharts();
}

main();
