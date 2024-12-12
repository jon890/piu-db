import TimeUtil from "../utils/time-util";
import prisma from "./prisma.client";

async function findByGameId(gameId: string) {
  const pumbilityRanking = await prisma.pumbilityRanking.findFirst({
    where: {
      gameId,
      isActive: true,
    },
  });
  return pumbilityRanking;
}

async function findAll() {
  const pumbilityRanking = await prisma.pumbilityRanking.findMany({
    orderBy: {
      score: "desc",
    },
    where: {
      isActive: true,
    },
  });
  return pumbilityRanking;
}

async function createMany(
  pumbilityRankings: {
    gameId: string;
    score: number;
    rank: number;
    date: string;
  }[],
  createdAt: Date
) {
  const data = pumbilityRankings.map((it) => ({
    gameId: it.gameId,
    score: it.score,
    rank: it.rank,
    officialUpdatedAt: TimeUtil.convertUTC(it.date).toDate(),
    createdAt,
  }));

  await prisma.pumbilityRanking.createMany({
    data,
  });
}

async function updateMany(
  pumbilityRankings: {
    gameId: string;
    score: number;
    rank: number;
    date: string;
  }[],
  createdAt: Date
) {
  const data = pumbilityRankings.map((it) => ({
    gameId: it.gameId,
    score: it.score,
    rank: it.rank,
    officialUpdatedAt: TimeUtil.convertUTC(it.date).toDate(),
    createdAt,
  }));

  await prisma.$transaction(async (tx) => {
    await tx.pumbilityRanking.updateMany({
      data: {
        isActive: false,
      },
      where: {
        gameId: {
          in: data.map((it) => it.gameId),
        },
      },
    });

    await tx.pumbilityRanking.createMany({
      data,
    });
  });
}

const PumbilityRankingDb = {
  findAll,
  createMany,
  updateMany,
  findByGameId,
};

export default PumbilityRankingDb;
