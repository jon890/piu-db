import { Prisma } from "@prisma/client";
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

const SkillAttackDB = {
  create,
  findByUserLatest,
};

export default SkillAttackDB;
