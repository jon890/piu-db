import prisma from "@/server/prisma/client";
import type { GameId } from "@/types/game-id";

async function getByGameId(gameId: string) {
  return prisma.piuProfile.findUnique({
    where: {
      gameId,
    },
  });
}

async function update(gameId: string, profile: GameId) {
  return prisma.piuProfile.update({
    where: {
      gameId,
    },
    data: {
      lastPlayedCenter: profile.latestGameCenter,
      lastLoginDate:
        profile.latestLoginDate === "-" ? null : profile.latestLoginDate,
    },
  });
}

async function create(userSeq: number, profile: GameId) {
  return prisma.piuProfile.create({
    data: {
      userSeq,
      gameId: profile.nickname,
      lastPlayedCenter: profile.latestGameCenter,
      lastLoginDate:
        profile.latestLoginDate === "-" ? null : profile.latestLoginDate,
    },
  });
}

async function getPiuProfiles(userSeq: number) {
  return prisma.piuProfile.findMany({
    where: { userSeq },
  });
}

async function getPrimary(userSeq: number) {
  return prisma.piuProfile.findFirst({
    where: {
      userSeq,
      isPrimary: true,
    },
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
  create,
  update,
  getByGameId,
  getPiuProfiles,
  createIfNotExist,
  setPrimary,
  getPrimary,
};

export default PiuProfileDB;
