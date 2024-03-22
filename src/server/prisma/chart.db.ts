import prisma from "@/server/prisma/client";
import { Chart, ChartType, Song } from "@prisma/client";
import fs from "node:fs";
import fsPromise from "node:fs/promises";
import path from "node:path";
import { TMP_DIR } from "../utils/tmpdir";
import SongDB from "./song.db";
import { cache } from "react";

const CACHE_FOLDER = path.resolve(TMP_DIR, "piudb_cache");
const CACHE_FILE = path.resolve(CACHE_FOLDER, "charts.json");

function isCached() {
  return fs.existsSync(CACHE_FILE);
}

async function _findAll(): Promise<Chart[]> {
  // from cache
  if (isCached()) {
    console.log("...Parse Chart JSON file...");
    const cached = await fsPromise.readFile(CACHE_FILE, {
      encoding: "utf-8",
    });
    return JSON.parse(cached);
  } else {
    if (!fs.existsSync(CACHE_FOLDER)) {
      await fsPromise.mkdir(CACHE_FOLDER);
    }

    const charts = await prisma.chart.findMany();
    await fsPromise.writeFile(CACHE_FILE, JSON.stringify(charts, null, 2));
    return charts;
  }
}

const findAll = cache(_findAll);

export type SongWithCharts = Song & { charts?: Chart[] };
async function findAllGroupBySong(): Promise<SongWithCharts[]> {
  const songs = await SongDB.findAll();
  const songMap = new Map<number, Song>();

  for (const song of songs) {
    songMap.set(song.seq, song);
  }

  const charts = await findAll();
  const chartSongSeqMap = new Map<number, Chart[]>();

  for (const chart of charts) {
    const songSeq = chart.songSeq;
    const song = songMap.get(songSeq);
    if (!song) continue;

    if (chartSongSeqMap.has(songSeq)) {
      chartSongSeqMap.get(songSeq)?.push(chart);
    } else {
      chartSongSeqMap.set(songSeq, [chart]);
    }
  }

  const songWithCharts: (Song & { charts: Chart[] | undefined })[] = [];
  songMap.forEach((song, seq) => {
    const charts = chartSongSeqMap.get(seq);
    songWithCharts.push({ ...song, charts });
  });

  return songWithCharts;
}

async function findChart(songSeq: number, level: number, chartType: ChartType) {
  if (isCached()) {
    const charts = await findAll();
    return charts.find(
      (c) =>
        c.chartType === chartType && c.level === level && c.songSeq === songSeq
    );
  } else {
    const chart = await prisma.chart.findUnique({
      where: {
        songSeq_chartType_level: {
          songSeq,
          level,
          chartType,
        },
      },
    });
    return chart;
  }
}

async function findCharts(songSeq: number) {
  if (isCached()) {
    const charts = await findAll();
    return charts.filter((c) => c.songSeq === songSeq);
  }

  return null;
}

async function findBySeq(seq: number) {
  const charts = await findAll();
  return charts.find((it) => it.seq === seq);
}

async function findBySeqIn(seqs: number[]) {
  const charts = await findAll();
  return charts.filter((it) => seqs.includes(it.seq));
}

async function findSongBySeqInCache(seq: number) {
  if (isCached()) {
    const charts = await findAll();
    const chart = charts.find((it) => it.seq === seq);

    const song = chart?.songSeq ? await SongDB.findBySeq(chart?.songSeq) : null;

    return { chart, song };
  }

  return null;
}

const ChartDB = {
  CACHE_FILE,
  findAll,
  findAllGroupBySong,
  findChart,
  findCharts,
  findBySeq,
  findBySeqIn,
  findSongBySeqInCache,
};

export default ChartDB;
