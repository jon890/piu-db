"use server";

import RoomDB from "@/server/prisma/room.db";
import { redirect } from "next/navigation";
import AuthUtil from "../utils/auth-util";

export type ParticipateRoomState = {
  message?: string;
};

export async function participateRoom(roomSeq: number) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  return RoomDB.participate(roomSeq, userSeq);
}
