"use server";

import AssignmentDB from "@/server/prisma/assignment.db";
import AuthUtil from "@/server/utils/auth-util";
import { revalidatePath } from "next/cache";

export async function deleteAssignmentAction(assignmentSeq: number) {
  const userSeq = await AuthUtil.getUserSeqThrows();

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
