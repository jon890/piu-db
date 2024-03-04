import prisma from "@/server/prisma/client";

function getSongsByName(songNames: string[]) {
  return prisma.song.findMany({
    where: {
      name: {
        in: songNames,
      },
    },
  });
}

const SongDB = {
  getSongsByName,
};

export default SongDB;
