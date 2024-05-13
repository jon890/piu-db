import { ChangeRoomSettingsSchema } from "@/app/(app)/rooms/[id]/settings/schema";
import { CreateRoomSchema } from "@/app/(app)/rooms/create/schema";
import { ROOM_PAGING_UNIT } from "@/constants/const";
import prisma from "@/server/prisma/client";
import { BusinessException } from "@/utils/business.exception";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import ParticipantsDB from "./room-participants.db";

async function create({
  adminUserSeq,
  name,
  bannerImage,
  description,
}: z.infer<typeof CreateRoomSchema>) {
  return prisma.$transaction(async (tx) => {
    const room = await tx.assignmentRoom.create({
      data: {
        name,
        adminUserSeq,
        bannerImage,
        description,
        selectSongAuthorityUsers: [adminUserSeq],
      },
    });

    await ParticipantsDB.participate(room, adminUserSeq, tx);
  });
}

async function changeSettings(
  userSeq: number,
  {
    room_seq,
    bannerImage,
    description,
    name,
    stopParticipating,
    selectSongAuthorityUsers,
  }: z.infer<typeof ChangeRoomSettingsSchema>
) {
  const room = await prisma.assignmentRoom.findUnique({
    select: {
      adminUserSeq: true,
    },
    where: {
      seq: room_seq,
    },
  });

  if (!room) {
    return { ok: false, message: "존재하지 않는 방입니다" };
  }

  if (room.adminUserSeq !== userSeq) {
    return { ok: false, message: "방장이 아닙니다" };
  }

  await prisma.assignmentRoom.update({
    data: {
      bannerImage,
      description,
      name,
      stopParticipating: stopParticipating === "on",
      selectSongAuthorityUsers,
    },
    where: { seq: room_seq },
  });

  return { ok: true, message: "설정을 변경했습니다" };
}

/**
 * 방 목록
 */
async function getRooms(page: number = 0) {
  return prisma.assignmentRoom.findMany({
    skip: page * ROOM_PAGING_UNIT,
    take: ROOM_PAGING_UNIT,
    include: {
      admin: {
        select: { nickname: true },
      },
      _count: {
        select: {
          assignmentRoomParticipants: {
            where: {
              isExited: false,
            },
          },
        },
      },
    },
  });
}

async function getRoomOrElseThrows(roomSeq: number) {
  const room = await prisma.assignmentRoom.findUnique({
    where: {
      seq: roomSeq,
    },
  });

  if (!room) {
    throw new BusinessException("NOT_EXIST_ROOM");
  }

  return room;
}

async function getRoom(seq: number, userSeq: number) {
  const room = await prisma.assignmentRoom.findUnique({
    where: {
      seq,
    },
  });

  let isParticipated = false;
  if (room) {
    isParticipated = await ParticipantsDB.isParticipated(room.seq, userSeq);
  }

  return { room, isParticipated };
}

export type RoomParticipants = Prisma.PromiseReturnType<typeof getParticipants>;
async function getParticipants(roomSeq: number) {
  return prisma.assignmentRoomParticipants.findMany({
    where: {
      assignmentRoomSeq: roomSeq,
    },
    include: {
      user: {
        select: {
          seq: true,
          nickname: true,
          uid: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

const RoomDB = {
  create,
  changeSettings,
  getRooms,
  getRoom,
  getRoomOrElseThrows,
  getParticipants,
};

export default RoomDB;
