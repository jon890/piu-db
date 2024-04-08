"use server";

import NoticeDB from "@/server/prisma/notice.db";
import AuthUtil from "@/server/utils/auth-util";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateNoticeSchema } from "./schema";

type State = {
  message?: string;
};

export async function createNotice(
  prevState: State | null,
  formData: FormData
) {
  const validatedFields = CreateNoticeSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: await AuthUtil.getUserSeqThrows(),
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      errors: validatedFields.error.flatten(),
      message: "Missing Fields. Failed to Create Notice.",
    };
  }

  await NoticeDB.create(validatedFields.data);

  revalidatePath("/notice");
  redirect("/notice");
}
