import ContentBox from "@/components/layout/content-box";
import SkillAttackTab from "@/components/skill-attack/tab";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import AuthUtil from "@/server/utils/auth-util";
import CookieUtil from "@/server/utils/cookie-util";
import { Suspense } from "react";
import SkillAttackSyncButton from "./sync-button";

type Props = {
  children: React.ReactNode;
};

export default async function SkillAttackLayout({ children }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const skillAttack = await SkillAttackDB.findByUserLatest(userSeq);
  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  return (
    <ContentBox title="스킬 어택">
      <SkillAttackTab />

      {/* 스킬 어택 설명 */}
      <h2 className="text-center font-medium">
        * 스킬 어택은 내 기록을 통해서만 반영되고 있습니다.
        <br />
        자주 플레이하고, 점수를 갱신해보세요!
        <br />
        <strong className="text-gray-500">
          (* 내 기록 목록에서 기록을 불러온 후 갱신해야 적용됩니다)
        </strong>
      </h2>
      <h3 className="text-sm font-light">
        점수는 다음과 같이 집계됩니다
        <br />
        점수 / 1,000,000 * 레벨
        <br />
        <br />
        [예시] 24레벨 95만점
        <br />
        950,000 / 1,000,000 * 24 = 22.8
        <br />
        (소수점 3자리까지 반영, 나머지 버림처리)
        <br />
        <br />
        점수가 높은 순서대로 50곡을 선별하여 총 점을 계산합니다.
      </h3>

      <SkillAttackSyncButton piuAuth={piuAuthValue} />

      {skillAttack ? (
        <p>
          Your Skill Points
          <strong className="ml-4 mt-32 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-3xl sm:text-5xl font-bold text-transparent">
            {skillAttack.skillPoints.toFixed(3)}
          </strong>
        </p>
      ) : (
        <p>위 버튼을 눌러 스킬 어택을 동기화 해주세요</p>
      )}

      <Suspense fallback={<p>데이터를 불러오고 있습니다...</p>}>
        {children}
      </Suspense>
    </ContentBox>
  );
}
