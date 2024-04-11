import SkillAttackRecordTable from "@/components/skill-attack/record-table";
import RecordDB from "@/server/prisma/record.db";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import UserDB from "@/server/prisma/user.db";
import { notFound } from "next/navigation";

type Props = {
  params: {
    uid: string;
  };
};

export default async function MySkillAttackPage({ params: { uid } }: Props) {
  const user = await UserDB.getUserByUID(uid);

  if (!user) {
    notFound();
  }

  const skillAttack = await SkillAttackDB.findByUserLatest(user.seq);
  if (!skillAttack) {
    notFound();
  }

  const records = skillAttack
    ? await RecordDB.findBySeqIn(skillAttack.recordSeqs as number[])
    : [];

  return (
    <>
      <p>
        {user.nickname} Skill Points
        <strong className="ml-4 mt-32 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-3xl sm:text-5xl font-bold text-transparent">
          {skillAttack.skillPoints.toFixed(3)}
        </strong>
      </p>
      {records.length > 0 && <SkillAttackRecordTable records={records} />}
    </>
  );
}
