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
  await prisma.assigmentRecord.create({
    data: {
      assignmentSeq,
      recordSeq: record.seq,
      chartSeq: record.chartSeq,
      userSeq: record.userSeq,
    },
  });
}

const AssignmentRecordDB = {
  getRecordsByUser,
  submitAssignment,
};

export default AssignmentRecordDB;
