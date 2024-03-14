"use server";

import AssignmentRecordDB from "@/server/prisma/assignment-record.db";
import AssignmentDB from "@/server/prisma/assignment.db";
import RecordDB from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import { RecordSyncSchema } from "./record-sync-schema";

export type State = {
  message?: string;
};

export async function syncRecord(prevState: State | null, formData: FormData) {
  const validatedFields = RecordSyncSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: await AuthUtil.getUserSeqThrows(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
      message: "참여 정보가 잘못되었습니다",
    };
  }

  const { roomSeq, userSeq } = validatedFields.data;

  const assignments = await AssignmentDB.getOngoingAssignments(roomSeq);

  for (const assignment of assignments) {
    const prevSubmitted = await AssignmentRecordDB.getRecordsByUser(
      assignment.seq,
      userSeq
    );

    const maxRecord = await RecordDB.getMaxRecordByUserAndChartDateBetween({
      userSeq,
      chartSeq: assignment.chartSeq,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
    });

    if (!maxRecord) {
      continue;
    }

    const already = prevSubmitted.find((it) => it.recordSeq === maxRecord?.seq);
    if (already) {
      continue;
    }

    await AssignmentRecordDB.submitAssignment({
      assignmentSeq: assignment.seq,
      record: maxRecord,
    });
  }

  return {
    message: "숙제 동기화가 완료되었습니다.",
  };
}
