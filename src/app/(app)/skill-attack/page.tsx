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
