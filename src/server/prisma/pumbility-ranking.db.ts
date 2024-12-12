import TimeUtil from "../utils/time-util";
import prisma from "./prisma.client";

async function findAll() {
  const pumbilityRanking = await prisma.pumbilityRanking.findMany({
    orderBy: {
      score: "desc",
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

const PumbilityRankingDb = {
  findAll,
  createMany,
};

export default PumbilityRankingDb;
