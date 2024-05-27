import { Prisma, Record } from "@prisma/client";
import prisma from "./prisma.client";

async function getRecordByUser(assignmentSeq: number, userSeq: number) {
  return prisma.assigmentRecord.findFirst({
    where: {
      assignmentSeq,
      userSeq,
    },
  });
}

async function submitAssignment({
  assignmentSeq,
  record,
}: {
  assignmentSeq: number;
  record: Record;
}) {
  return prisma.$transaction([
    prisma.assigmentRecord.deleteMany({
      where: {
        userSeq: record.userSeq,
        assignmentSeq,
      },
    }),

    prisma.assigmentRecord.create({
      data: {
        assignmentSeq,
        recordSeq: record.seq,
        chartSeq: record.chartSeq,
        userSeq: record.userSeq,
      },
    }),
  ]);
}

async function getRecordsByAssgimentSeq(
  assignmentSeq: number,
  tx?: Prisma.TransactionClient
) {
  const client = tx ? tx : prisma;
  return client.assigmentRecord.findMany({
    where: {
      assignmentSeq,
    },
    select: {
      user: {
        select: { seq: true, nickname: true, uid: true },
      },
      record: true,
    },
    orderBy: [
      {
        record: {
          score: "desc",
        },
      },
      {
        record: {
          playedAt: "asc",
        },
      },
    ],
  });
}

async function getCountByAssignmentSeq(assignmentSeq: number) {
  return prisma.assigmentRecord.count({
    where: {
      assignmentSeq,
    },
  });
}

const AssignmentRecordDB = {
  getRecordByUser,
  submitAssignment,
  getRecordsByAssgimentSeq,
  getCountByAssignmentSeq,
};

export default AssignmentRecordDB;
