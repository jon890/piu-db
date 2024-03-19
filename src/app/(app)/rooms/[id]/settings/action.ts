"use server";

import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ChangeRoomSettingsSchema } from "./schema";

type State = {
  message?: string;
};

export async function changeRoomSettings(
  prevState: State | null,
  formData: FormData
) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const validatedFields = ChangeRoomSettingsSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      paramErrors: validatedFields.error.flatten(),
      message: "Missing Fields. Failed to Create Room.",
    };
  }

  const res = await RoomDB.changeSettings(userSeq, validatedFields.data);

  if (!res.ok) {
    return { ...res };
  }

  revalidatePath("/rooms/" + validatedFields.data.room_seq);
  redirect("/rooms/" + validatedFields.data.room_seq);
}
