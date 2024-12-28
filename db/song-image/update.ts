import { PrismaClient } from "@prisma/client";
import { SONG_IMAGES_2024_12_28 } from "./song-image";

const prisma = new PrismaClient({
  // log: [
  //   {
  //     emit: "stdout",
  //     level: "query",
  //   },
  //   {
  //     emit: "stdout",
  //     level: "error",
  //   },
  //   {
  //     emit: "stdout",
  //     level: "info",
  //   },
  //   {
  //     emit: "stdout",
  //     level: "warn",
  //   },
  // ],
});

async function updateSongImages() {
  for (const song of SONG_IMAGES_2024_12_28) {
    const songEntity = await prisma.song.findUnique({
      where: {
        name: song.songname,
      },
    });

    if (!songEntity) {
      console.log("Song not founded ===> songname:", song.songname);
      continue;
    }

    if (songEntity.imageUrl !== song.imageUrl) {
      await prisma.song.update({
        where: {
          name: song.songname,
        },
        data: {
          imageUrl: song.imageUrl,
        },
      });
      console.log("Updated song Image with (", song.songname, ")");
    }

    console.log("Update song image completed...");
  }
}

updateSongImages();
