import ContentBox from "@/components/layout/content-box";
import RecordDB from "@/server/prisma/record.db";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import AuthUtil from "@/server/utils/auth-util";
import SkillAttackButton from "./skill-attack-form";
import SkillAttackTable from "./skill-attack-table";

export default async function SkillAttackPage() {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const skillAttack = await SkillAttackDB.findByUserLatest(userSeq);
  const records = skillAttack
    ? await RecordDB.findBySeqIn(skillAttack.recordSeqs as number[])
    : [];
  console.log(skillAttack);

  return (
    <ContentBox title="스킬 어택">
      <SkillAttackButton />

      <p>총점 : {skillAttack?.skillPoints.toNumber() ?? 0}</p>

      {records.length > 0 && <SkillAttackTable records={records} />}
    </ContentBox>
  );
}
