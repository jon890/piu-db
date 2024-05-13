"use server";

import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "../utils/auth-util";
import ParticipantsDB from "../prisma/room-participants.db";
import {
  BusinessException,
  handleBusinessException,
} from "@/utils/business.exception";
import { revalidatePath } from "next/cache";

export async function exitRoomAction(roomSeq: number) {
  return await handleBusinessException(async () => {
    const userSeq = await AuthUtil.getUserSeqThrows();

    const room = await RoomDB.getRoomOrElseThrows(roomSeq);

    if (room.adminUserSeq === userSeq) {
      throw BusinessException.newInstance("NOT_EXITED_ROOM_BECAUSE_ADMIN");
    }

    await ParticipantsDB.exit(room, userSeq);

    revalidatePath(`/rooms`);
    revalidatePath(`/rooms/${room.seq}`);
    return { message: "숙제방에서 나갔습니다" };
  });
}
