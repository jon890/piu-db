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

async function getRoomDetail(seq: number, userSeq: number) {
  const room = await prisma.assignmentRoom.findUnique({
    where: {
      seq,
    },
  });

  let _isParticipated = false;
  if (room) {
    _isParticipated = await isParticipated(room.seq, userSeq);
  }

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

  return { room, isParticipated: _isParticipated, assignments };
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
  getParticipants,
  participate,
  getRoomDetail,
  isParticipated,
};

export default RoomDB;
