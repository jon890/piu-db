import { Record } from "@prisma/client";
import prisma from "./client";

async function getRecordsByUser(assignmentSeq: number, userSeq: number) {
  const records = await prisma.assigmentRecord.findMany({
    where: {
      assignmentSeq,
      userSeq,
    },
  });

  return records;
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

async function getRecordsByAssgimentSeq(assignmentSeq: number) {
  return prisma.assigmentRecord.findMany({
    where: {
      assignmentSeq,
    },
    select: {
      user: {
        select: { seq: true, nickname: true, uid: true },
      },
      record: true,
    },
  });
}

const AssignmentRecordDB = {
  getRecordsByUser,
  submitAssignment,
  getRecordsByAssgimentSeq,
};

export default AssignmentRecordDB;
