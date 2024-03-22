import ContentBox from "@/components/layout/content-box";
import RecordDB from "@/server/prisma/record.db";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import AuthUtil from "@/server/utils/auth-util";
import SkillAttackButton from "./skill-attack-form";
import SkillAttackTable from "./skill-attack-table";
import CookieUtil from "@/server/utils/cookie-util";

export default async function SkillAttackPage() {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const skillAttack = await SkillAttackDB.findByUserLatest(userSeq);
  const records = skillAttack
    ? await RecordDB.findBySeqIn(skillAttack.recordSeqs as number[])
    : [];

  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  return (
    <ContentBox title="스킬 어택">
      <h2 className="text-center font-medium">
        * 스킬 어택은 최근 플레이 기록을 통해서만 반영되고 있습니다.
        <br />
        자주 플레이하고, 점수를 갱신해보세요!
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
      <SkillAttackButton piuAuth={piuAuthValue} />

      {skillAttack ? (
        <p>
          Your Skill Points
          <strong className="ml-4 mt-32 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent">
            {skillAttack.skillPoints.toFixed(3)}
          </strong>
        </p>
      ) : (
        <p>위 버튼을 눌러 스킬 어택을 동기화 해주세요</p>
      )}

      {records.length > 0 && <SkillAttackTable records={records} />}
    </ContentBox>
  );
}
