"use server";

import AuthUtil from "@/server/utils/auth-util";
import { CreateAssignmentSchema } from "./create-schema";
import AssignmentDB from "@/server/prisma/assignment.db";
import { redirect } from "next/navigation";

export type State = {
  message?: string;
};

export async function createAssignment(
  _prevState: State | null | undefined,
  formData: FormData
) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const validatedFields = await CreateAssignmentSchema.safeParseAsync({
    ...Object.fromEntries(formData.entries()),
    user_seq: userSeq,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
      message: "정보를 다시 확인해주세요",
    };
  }

  const ret = await AssignmentDB.createAssignment(validatedFields.data);
  if (!ret.ok) {
    return {
      message: ret.message ?? "오류가 발생했습니다",
    };
  }

  redirect(`/rooms/${validatedFields.data.room_seq}`);
}
