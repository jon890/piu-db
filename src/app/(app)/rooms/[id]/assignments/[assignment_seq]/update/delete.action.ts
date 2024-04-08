"use server";

import AssignmentRecordDB from "@/server/prisma/assignment-record.db";
import AssignmentDB from "@/server/prisma/assignment.db";
import AuthUtil from "@/server/utils/auth-util";
import { revalidatePath } from "next/cache";

export async function deleteAssignmentAction(assignmentSeq: number) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const recordCounts =
    await AssignmentRecordDB.getCountByAssignmentSeq(assignmentSeq);
  if (recordCounts > 0) {
    return {
      ok: false,
      message: "기록이 등록되어 있어 숙제를 삭제할 수 없습니다",
    };
  }

  const deleted = await AssignmentDB.deleteAssignment(userSeq, assignmentSeq);

  if (!deleted) {
    return {
      ok: false,
    };
  }

  revalidatePath(`/rooms/${deleted.roomSeq}`);

  return {
    ok: true,
  };
}
