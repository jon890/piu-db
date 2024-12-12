import PiuProfileDB from "@/server/prisma/piu-profile.db";
import PumbilityRankingDb from "@/server/prisma/pumbility-ranking.db";
import AuthUtil from "@/server/utils/auth-util";

export default async function MyPumbility() {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const profile = await PiuProfileDB.getPrimary(userSeq);

  if (!profile) {
    return <div>계정 정보가 등록되지 않았습니다.</div>;
  }

  const pumbilityRanking = await PumbilityRankingDb.findByGameId(
    profile?.gameId
  );

  return (
    <div>
      <p>MyPumbility</p>
      <p>{pumbilityRanking?.score}</p>
    </div>
  );
}
