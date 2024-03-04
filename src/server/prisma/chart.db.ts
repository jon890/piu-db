import prisma from "@/server/prisma/client";
import { Chart, ChartType, Song } from "@prisma/client";
import fsPromise from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { TMP_DIR } from "../utils/tmpdir";

const CACHE_FOLDER = path.resolve(TMP_DIR, "piudb_cache");
const CACHE_FILE = path.resolve(CACHE_FOLDER, "charts.json");

function isCached() {
  return fs.existsSync(CACHE_FILE);
}

async function findAll(): Promise<Chart[]> {
  // from cache
  if (isCached()) {
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

async function findChartBySeqInCache(seq: number) {
  if (isCached()) {
    const charts = await findAll();
    return charts.find((it) => it.seq === seq);
  }

  return null;
}

const ChartDB = {
  findAll,
  findChart,
  findChartBySeqInCache,
};

export default ChartDB;
