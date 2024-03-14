"use server";

import { auth } from "@/auth";
import RoomDB from "@/server/prisma/room.db";
import { redirect } from "next/navigation";
import { ParticipantRoomSchema } from "./participate-schema";
import AuthUtil from "@/server/utils/auth-util";

export type ParticipateRoomState = {
  message?: string;
};

export async function participateRoom(
  prevState: ParticipateRoomState | null,
  formData: FormData
) {
  const validatedFields = ParticipantRoomSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: await AuthUtil.getUserSeq(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
      message: "참여 정보가 잘못되었습니다",
    };
  }

  const { roomSeq, userSeq } = validatedFields.data;

  await RoomDB.participate(roomSeq, userSeq);

  redirect(`/rooms/${roomSeq}`);
}
