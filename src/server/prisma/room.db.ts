import { ChangeRoomSettingsSchema } from "@/app/(app)/rooms/[id]/settings/schema";
import { CreateRoomSchema } from "@/app/(app)/rooms/create/schema";
import prisma from "@/server/prisma/client";
import { z } from "zod";
import { ROOM_PAGING_UNIT } from "./const";

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

    await tx.assignmentRoomParticipants.create({
      data: {
        assignmentRoomSeq: room.seq,
        userSeq: adminUserSeq,
      },
    });
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
        select: { assignmentRoomParticipants: true },
      },
    },
  });
}

async function getRoom(seq: number, userSeq: number) {
  const room = await prisma.assignmentRoom.findUnique({
    where: {
      seq,
    },
  });

  let _isParticipated = false;
  if (room) {
    _isParticipated = await isParticipated(room.seq, userSeq);
  }

  return { room, isParticipated: _isParticipated };
}

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

async function participate(roomSeq: number, userSeq: number) {
  return prisma.$transaction(async (tx) => {
    const room = await tx.assignmentRoom.findUnique({
      where: {
        seq: roomSeq,
      },
    });

    if (!room) {
      return { ok: false, message: "방이 존재하지 않습니다" };
    }

    if (room.stopParticipating) {
      return { ok: false, message: "해당 방의 참여가 제한되어있습니다" };
    }

    await tx.assignmentRoomParticipants.upsert({
      where: {
        assignmentRoomSeq_userSeq: {
          assignmentRoomSeq: roomSeq,
          userSeq,
        },
      },
      create: {
        assignmentRoomSeq: roomSeq,
        userSeq,
      },
      update: {},
    });

    return { ok: true, message: "방에 참여되었습니다" };
  });
}

async function isParticipated(roomSeq: number, userSeq: number) {
  const exist = await prisma.assignmentRoomParticipants.count({
    where: {
      assignmentRoomSeq: roomSeq,
      userSeq: userSeq,
    },
  });

  return exist > 0;
}

const RoomDB = {
  create,
  changeSettings,
  getRooms,
  getRoom,
  getParticipants,
  participate,
  isParticipated,
};

export default RoomDB;
