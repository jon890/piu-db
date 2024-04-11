"use server";

import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "../utils/auth-util";

type State = {
  message?: string;
};

export async function participateRoomAction(roomSeq: number) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  return RoomDB.participate(roomSeq, userSeq);
}
