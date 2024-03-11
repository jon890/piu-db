import prisma from "@/server/prisma/client";

/**
 * 한 페이지에 보여줄 갯수
 */
const ROOM_PAGING_UNIT = 10;

/**
 * 방 목록
 */
async function getRooms(page: number = 0) {
  return prisma.assignmentRoom.findMany({
    skip: page * ROOM_PAGING_UNIT,
    take: ROOM_PAGING_UNIT,
    include: {
      _count: {
        select: { assignmentRoomParticipants: true },
      },
    },
  });
}

export async function getRoom(seq: number) {
  return prisma.assignmentRoom.findUnique({
    where: {
      seq,
    },
  });
}

async function getRoomDetail(seq: number) {
  const room = await prisma.assignmentRoom.findUnique({
    where: {
      seq,
    },
  });

  const participants =
    room &&
    (await prisma.assignmentRoomParticipants.findMany({
      where: {
        assignmentRoomSeq: room.seq,
      },
      include: {
        user: {
          select: {
            seq: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }));

  const assignments =
    room &&
    (await prisma.assignment.findMany({
      where: {
        roomSeq: room.seq,
      },
      orderBy: {
        endDate: "asc",
      },
    }));

  return { room, participants, assignments };
}

async function participant(roomSeq: number, userSeq: number) {
  return prisma.assignmentRoomParticipants.upsert({
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
  getRooms,
  participant,
  getRoomDetail,
  isParticipated,
};

export default RoomDB;
