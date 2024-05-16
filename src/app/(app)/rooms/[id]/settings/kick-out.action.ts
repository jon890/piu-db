"use server";

import prisma from "@/server/prisma/client";
import MessageDB from "@/server/prisma/message.db";
import ParticipantsDB from "@/server/prisma/room-participants.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import {
  BusinessException,
  handleBusinessException,
} from "@/utils/business.exception";

export async function kickOutAction(roomSeq: number, targetUserSeq: number) {
  return handleBusinessException(async () => {
    const runUserSeq = await AuthUtil.getUserSeqThrows();

    return await prisma.$transaction(async (tx) => {
      const room = await RoomDB.getRoomOrElseThrows(roomSeq, tx);

      if (room.adminUserSeq !== runUserSeq) {
        throw BusinessException.newInstance("NOT_ROOM_ADMIN_USER");
      }

      await ParticipantsDB.exit(room, targetUserSeq);
      await MessageDB.sendKickOutMessage(room, targetUserSeq, tx);

      return { ok: true, message: "정상적으로 추방되었습니다" };
    });
  });
}
