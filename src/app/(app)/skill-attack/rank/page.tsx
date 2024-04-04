import ContentBox from "@/components/layout/content-box";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import AuthUtil from "@/server/utils/auth-util";
import Link from "next/link";
import SkillAttackRankingTable from "./skill-attack-ranking-table";
import { Suspense } from "react";

export default async function SkillAttackPage() {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const skillAttack = await SkillAttackDB.findByUserLatest(userSeq);

  return (
    <ContentBox title="스킬 어택 랭킹">
      <Link href="/skill-attack" className="btn btn-primary">
        내 스킬 어택 상세 페이지로 돌아가기
      </Link>

      {skillAttack ? (
        <p>
          Your Skill Points
          <strong className="ml-4 mt-32 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent">
            {skillAttack.skillPoints.toFixed(3)}
          </strong>
        </p>
      ) : (
        <p>내 점수가 아직 등록되지 않았습니다.</p>
      )}

      <Suspense fallback={<p>데이터를 불러오고 있습니다...</p>}>
        <SkillAttackRankingTable />
      </Suspense>
    </ContentBox>
  );
}
