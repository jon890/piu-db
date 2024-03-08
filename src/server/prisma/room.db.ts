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

async function getRoomWithParticipants(seq: number) {
  const room = await prisma.assignmentRoom.findUnique({
    where: {
      seq,
    },
  });

  const participants = room
    ? await prisma.assignmentRoomParticipants.findMany({
        where: {
          assignmentRoomSeq: room.seq,
        },
        include: {
          user: true,
        },
      })
    : null;

  return { room, participants };
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

const RoomDB = {
  getRooms,
  participant,
  getRoomWithParticipants,
};

export default RoomDB;
