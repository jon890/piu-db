import ChartDB from "./chart.db";
import SongDB from "./song.db";
import fsPromise from "node:fs/promises";
import fs from "node:fs";
import logger from "../client/logger.client";

export const refreshCache = async () => {
  logger.info("refreshCache");

  if (fs.existsSync(SongDB.CACHE_FILE)) {
    logger.info("remove song cache");
    await fsPromise.rm(SongDB.CACHE_FILE);
  }

  if (fs.existsSync(ChartDB.CACHE_FILE)) {
    logger.info("remove chart cache");
    await fsPromise.rm(ChartDB.CACHE_FILE);
  }

  await SongDB.findAll();
  await ChartDB.findAll();
};
