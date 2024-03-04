import prisma from "@/server/prisma/client";
import { Song } from "@prisma/client";
import fsPromise from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { TMP_DIR } from "../utils/tmpdir";

const CACHE_FOLDER = path.resolve(TMP_DIR, "piudb_cache");
const CACHE_FILE = path.resolve(CACHE_FOLDER, "songs.json");

function isCached() {
  return fs.existsSync(CACHE_FILE);
}

async function findAll(): Promise<Song[]> {
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

    const songs = await prisma.song.findMany();
    await fsPromise.writeFile(CACHE_FILE, JSON.stringify(songs, null, 2));
    return songs;
  }
}

async function findBySongName(songName: string) {
  if (isCached()) {
    const songs = await findAll();
    return songs.find((s) => s.name === songName);
  } else {
    const songs = await prisma.song.findMany({
      where: {
        name: songName,
      },
    });
    return songs?.[0];
  }
}

const SongDB = {
  findAll,
  findBySongName,
};

export default SongDB;
