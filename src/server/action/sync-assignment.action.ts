"use server";

import { syncRecentlyPlayedAction } from "@/server/action/sync-recently-played.action";
import AssignmentRecordDB from "@/server/prisma/assignment-record.db";
import AssignmentDB from "@/server/prisma/assignment.db";
import RecordDB from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import type { PiuAuth } from "@/types/piu-auth";

/**
 * 숙제를 동기화하는
 * 서버 액션
 * @param roomSeq
 * @param piuAuth
 * @returns
 */
export async function syncAssignmentAction(roomSeq: number, piuAuth: PiuAuth) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const crawlingRes = await syncRecentlyPlayedAction(piuAuth, userSeq);
  if (!crawlingRes.ok) {
    return { ok: false, message: crawlingRes.message };
  }

  const assignments = await AssignmentDB.getOngoingAssignments(roomSeq);
  for (const assignment of assignments) {
    const prevSubmitted = await AssignmentRecordDB.getRecordByUser(
      assignment.seq,
      userSeq
    );

    const maxRecord = await RecordDB.getMaxRecordByUserAndChartDateBetween({
      userSeq,
      chartSeq: assignment.chartSeq,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      enableBreakOff: assignment.enableBreakOff,
    });

    if (!maxRecord) {
      continue;
    }

    const already = prevSubmitted?.recordSeq === maxRecord.seq;
    if (already) {
      continue;
    }

    await AssignmentRecordDB.submitAssignment({
      assignmentSeq: assignment.seq,
      record: maxRecord,
    });
  }

  return {
    ok: true,
    message: "숙제 동기화가 완료되었습니다.",
  };
}
