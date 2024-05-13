import ChartDB from "./chart.db";
import SongDB from "./song.db";
import fsPromise from "node:fs/promises";
import fs from "node:fs";

export const refreshCache = async () => {
  console.log("refreshCache");

  if (fs.existsSync(SongDB.CACHE_FILE)) {
    console.log("remove song cache");
    await fsPromise.rm(SongDB.CACHE_FILE);
  }

  if (fs.existsSync(ChartDB.CACHE_FILE)) {
    console.log("remove chart cache");
    await fsPromise.rm(ChartDB.CACHE_FILE);
  }

  await SongDB.findAll();
  await ChartDB.findAll();
};
