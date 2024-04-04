import { Prisma, User } from "@prisma/client";
import prisma from "./client";
import UserDB from "./user.db";

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

async function getRanking(page: number) {
  const ranking = await prisma.skillAttack.groupBy({
    _max: { skillPoints: true },
    by: ["userSeq"],
    orderBy: { _max: { skillPoints: "desc" } },
    skip: 100 * page,
    take: 100,
  });

  const users = await UserDB.getUsersBy(ranking.map((it) => it.userSeq));
  const userMap = new Map<
    number,
    { seq: number; name: string; nickname: string; uid: string }
  >();
  for (const user of users) {
    userMap.set(user.seq, user);
  }

  return ranking.map((it) => ({
    skillPoint: it._max.skillPoints,
    user: userMap.get(it.userSeq),
  }));
}

const SkillAttackDB = {
  create,
  findByUserLatest,
  getRanking,
};

export default SkillAttackDB;
