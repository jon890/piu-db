import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import prisma from "./client";

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

/**
 * 각 유저의 최신 기록을 불러온다
 * @param page
 * @returns
 */
type SkillAttackRanking = {
  sp_seq: number;
  user_seq: number;
  nickname: string;
  uid: string;
  skill_points: Decimal;
  created_at: Date;
};
async function getRanking(page: number) {
  return prisma.$queryRaw<SkillAttackRanking[]>`
  select 
    sp.seq sp_seq,
    user.seq user_seq ,
    user.nickname ,
    user.uid , 
    max_sp.skill_points, sp.created_at
  from td_user user,
     (select user_seq, max(skill_points) skill_points
      from td_skill_attack
      group by user_seq
      order by max(skill_points) desc) max_sp,
     td_skill_attack sp
  where user.seq = max_sp.user_seq
    and sp.user_seq = max_sp.user_seq
    and sp.skill_points = max_sp.skill_points;
  `;
}

const SkillAttackDB = {
  create,
  findByUserLatest,
  getRanking,
};

export default SkillAttackDB;
