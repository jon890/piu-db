import SkillAttackRecordTable from "@/components/skill-attack/record-table";
import RecordDB from "@/server/prisma/record.db";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import AuthUtil from "@/server/utils/auth-util";

export default async function MySkillAttackPage() {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const skillAttack = await SkillAttackDB.findByUserLatest(userSeq);
  const records = skillAttack
    ? await RecordDB.findBySeqIn(skillAttack.recordSeqs as number[])
    : [];

  return records.length > 0 && <SkillAttackRecordTable records={records} />;
}
