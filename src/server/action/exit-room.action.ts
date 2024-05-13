"use server";

import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "../utils/auth-util";
import ParticipantsDB from "../prisma/room-participants.db";
import { handleBusinessException } from "@/utils/business.exception";
import { revalidatePath } from "next/cache";

export async function exitRoomAction(roomSeq: number) {
  return await handleBusinessException(async () => {
    const userSeq = await AuthUtil.getUserSeqThrows();

    const room = await RoomDB.getRoomOrElseThrows(roomSeq);

    await ParticipantsDB.exit(room, userSeq);

    revalidatePath(`/rooms`);
    revalidatePath(`/rooms/${room.seq}`);
    return { message: "숙제방에서 나갔습니다" };
  });
}
