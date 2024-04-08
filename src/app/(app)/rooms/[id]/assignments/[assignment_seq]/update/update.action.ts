"use server";

import AssignmentDB from "@/server/prisma/assignment.db";
import AuthUtil from "@/server/utils/auth-util";
import { redirect } from "next/navigation";
import { UpdateAssignmentSchema } from "./update.schema";
import { revalidatePath } from "next/cache";

export type State = {
  message?: string;
};

export async function updateAssignmentAction(
  _prevState: State | null | undefined,
  formData: FormData
) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const validatedFields = await UpdateAssignmentSchema.safeParseAsync({
    ...Object.fromEntries(formData.entries()),
    user_seq: userSeq,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
      message: "정보를 다시 확인해주세요",
    };
  }

  const ret = await AssignmentDB.updateAssignment(validatedFields.data);

  const path = `/rooms/${validatedFields.data.room_seq}/assignments/${validatedFields.data.assignment_seq}`;
  revalidatePath(path);
  redirect(path);
}
