import prisma from "@/server/prisma/client";

async function getPiuProfiles(userSeq: number) {
  return prisma.piuProfile.findMany({
    where: { userSeq },
  });
}

async function setPrimary(userSeq: number, gameId: string) {
  await prisma.piuProfile.updateMany({
    data: {
      isPrimary: false,
    },
    where: {
      userSeq,
    },
  });

  await prisma.piuProfile.update({
    data: {
      isPrimary: true,
    },
    where: {
      gameId,
      userSeq,
    },
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
  setPrimary,
};

export default PiuProfileDB;
