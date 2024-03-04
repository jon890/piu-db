import prisma from "@/server/prisma/client";

async function getPiuProfiles(userSeq: number) {
  return prisma.piuProfile.findMany({
    where: { userSeq },
  });
}

async function createIfNotExist(userSeq: number, gameId: string) {
  const profile = await prisma.piuProfile.upsert({
    create: {
      gameId,
      userSeq,
    },
    update: {},
    where: {
      gameId,
    },
  });

  return profile;
}

const PiuProfileDB = {
  getPiuProfiles,
  createIfNotExist,
};

export default PiuProfileDB;
