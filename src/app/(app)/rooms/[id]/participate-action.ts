"use server";

import { auth } from "@/auth";
import RoomDB from "@/server/prisma/room.db";
import { redirect } from "next/navigation";
import { ParticipantRoomSchema } from "./participate-schema";

export type ParticipateRoomState = {
  message?: string;
};

export async function participateRoom(
  prevState: ParticipateRoomState | null,
  formData: FormData
) {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;

  const validatedFields = ParticipantRoomSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: maybeUserSeq,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
      message: "참여 정보가 잘못되었습니다",
    };
  }

  const { roomSeq, userSeq } = validatedFields.data;

  await RoomDB.participant(roomSeq, userSeq);

  redirect(`/rooms/${roomSeq}`);
}
