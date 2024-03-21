import prisma from "@/server/prisma/client";
import { Song } from "@prisma/client";
import fsPromise from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { TMP_DIR } from "../utils/tmpdir";
import { cache } from "react";

const CACHE_FOLDER = path.resolve(TMP_DIR, "piudb_cache");
const CACHE_FILE = path.resolve(CACHE_FOLDER, "songs.json");

function isCached() {
  return fs.existsSync(CACHE_FILE);
}

async function _findAll(): Promise<Song[]> {
  // from cache
  if (isCached()) {
    console.log("...Parse Song JSON file...");
    const cached = await fsPromise.readFile(CACHE_FILE, {
      encoding: "utf-8",
    });
    return JSON.parse(cached);
  } else {
    if (!fs.existsSync(CACHE_FOLDER)) {
      await fsPromise.mkdir(CACHE_FOLDER);
    }

    const songs = await prisma.song.findMany();
    await fsPromise.writeFile(CACHE_FILE, JSON.stringify(songs, null, 2));
    return songs;
  }
}

const findAll = cache(_findAll);

async function findBySongName(songName: string) {
  if (isCached()) {
    const songs = await findAll();
    return songs.find((s) => s.name === songName);
  }

  return null;
}

async function findSongBySeqInCache(seq: number) {
  if (isCached()) {
    const songs = await findAll();
    return songs.find((it) => it.seq === seq);
  }

  return null;
}

const SongDB = {
  CACHE_FILE,
  findAll,
  findBySongName,
  findSongBySeqInCache,
};

export default SongDB;
