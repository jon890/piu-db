import { auth } from "@/auth";
import PumbilityCrawlerClient from "@/server/client/pumbility-crawler.client";
import PumbilityRankingDb from "@/server/prisma/pumbility-ranking.db";
import { PumbilityRankingDatum } from "@/types/pumbility-ranking-datum";
import ArrayUtil from "@/utils/array.util";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  const id = session?.user?.name;

  const pumbilityRankingsResponse =
    await PumbilityCrawlerClient.getPumbilityRanking();

  if (!pumbilityRankingsResponse.ok) {
    return NextResponse.json(
      { error: pumbilityRankingsResponse.error },
      { status: 500 }
    );
  }

  const batchedAt = new Date();
  const originalRankings = await PumbilityRankingDb.findAll();

  const originalRankingsMap = ArrayUtil.associatedBy(
    originalRankings,
    (it) => it.gameId
  );

  const fetchedRankings = pumbilityRankingsResponse.data;
  const updatedRankings: PumbilityRankingDatum[] = [];
  const newRankings: PumbilityRankingDatum[] = [];

  for (const fetchedRanking of fetchedRankings) {
    const originalRanking = originalRankingsMap.get(fetchedRanking.gameId);

    if (!fetchedRanking) {
      continue;
    }

    if (!originalRanking) {
      newRankings.push(fetchedRanking);
      continue;
    }

    if (originalRanking.score !== fetchedRanking.score) {
      updatedRankings.push(fetchedRanking);
    }
  }

  await PumbilityRankingDb.createMany(newRankings, batchedAt);
  await PumbilityRankingDb.createMany(updatedRankings, batchedAt);

  return NextResponse.json({ message: "success" }, { status: 200 });
}
