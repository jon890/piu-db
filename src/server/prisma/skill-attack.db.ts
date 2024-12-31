import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import prisma from "./prisma.client";

async function create({
  userSeq,
  recordSeqs,
  skillPoints,
}: {
  userSeq: number;
  recordSeqs: Prisma.JsonArray;
  skillPoints: number;
}) {
  const prev = await prisma.skillAttack.aggregate({
    where: {
      userSeq,
    },
    _max: {
      skillPoints: true,
    },
  });

  const prevSkillPoints = prev._max.skillPoints;

  if (!prevSkillPoints || prevSkillPoints.lt(skillPoints)) {
    await prisma.skillAttack.create({
      data: {
        userSeq,
        recordSeqs,
        skillPoints,
      },
    });
    return {
      ok: true,
      delta: new Decimal(skillPoints).minus(prevSkillPoints ?? 0).toNumber(),
    };
  } else {
    return {
      ok: false,
    };
  }
}

async function findByUserLatest(userSeq: number) {
  const skillAttack = await prisma.skillAttack.findFirst({
    where: {
      userSeq,
    },
    orderBy: { skillPoints: "desc" },
  });

  return skillAttack;
}

type SkillAttackRanking = {
  sp_seq: number;
  user_seq: number;
  nickname: string;
  uid: string;
  skill_points: Decimal;
  created_at: Date;
};
async function getRanking() {
  return prisma.$queryRaw<SkillAttackRanking[]>`
  select sp.seq sp_seq,
        td_user.seq,
        td_user.nickname,
        td_user.uid,
        max_sp.skill_points,
        sp.created_at
  from td_user,
      (select user_seq, max(skill_points) skill_points
        from td_skill_attack
        group by user_seq
        order by max(skill_points) desc) max_sp,
      td_skill_attack sp
  where td_user.seq = max_sp.user_seq
    and sp.user_seq = max_sp.user_seq
    and sp.skill_points = max_sp.skill_points
  order by max_sp.skill_points desc;
  `;
}

const SkillAttackDB = {
  create,
  findByUserLatest,
  getRanking,
};

export default SkillAttackDB;
