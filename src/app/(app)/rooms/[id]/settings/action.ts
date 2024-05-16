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
  _prevState: State | null,
  formData: FormData
) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const validatedFields = ChangeRoomSettingsSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    selectSongAuthorityUsers: formData.getAll("selectSongAuthorityUsers"),
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      paramErrors: validatedFields.error.flatten(),
      message: "방 설정 변경에 실패했습니다.",
    };
  }

  const res = await RoomDB.changeSettings(userSeq, validatedFields.data);

  if (!res.ok) {
    return { ...res };
  }

  revalidatePath("/rooms/" + validatedFields.data.room_seq);
  redirect("/rooms/" + validatedFields.data.room_seq);
}
