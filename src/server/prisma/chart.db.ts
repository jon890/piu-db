import prisma from "@/server/prisma/client";
import { Chart, ChartType, Song } from "@prisma/client";
import fs from "node:fs";
import fsPromise from "node:fs/promises";
import path from "node:path";
import { TMP_DIR } from "../utils/tmpdir";
import SongDB from "./song.db";
import { cache } from "react";
import ArrayUtil from "@/utils/array.util";

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
  const songMap = ArrayUtil.associatedBy(songs, (song) => song.seq);

  const charts = await findAll();
  const chartSongSeqMap = ArrayUtil.associatedByList(
    charts,
    (chart) => chart.songSeq
  );

  const songWithCharts: (Song & { charts: Chart[] | undefined })[] = [];
  songMap.forEach((song) => {
    const charts = chartSongSeqMap.get(song.seq);
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

/**
 * chart seq로
 * 노래와, 차트 객체를 찾는다
 * @param chartSeq
 * @returns
 */
async function findSongBySeq(chartSeq: number) {
  const charts = await findAll();
  const chart = charts.find((it) => it.seq === chartSeq);
  const song = chart?.songSeq ? await SongDB.findBySeq(chart?.songSeq) : null;
  return { chart, song };
}

const ChartDB = {
  CACHE_FILE,
  findAll,
  findAllGroupBySong,
  findChart,
  findCharts,
  findBySeq,
  findBySeqIn,
  findSongBySeq,
};

export default ChartDB;
