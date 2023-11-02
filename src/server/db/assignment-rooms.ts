import prisma from "@/server/prisma/client";

/**
 * 한 페이지에 보여줄 갯수
 */
const ROOM_PAGING_UNIT = 10;

/**
 * 방 목록
 */
export async function getRooms(page: number = 0) {
  return prisma.assignmentRoom.findMany({
    skip: page * ROOM_PAGING_UNIT,
    take: ROOM_PAGING_UNIT,
  });
}

export async function getRoom(seq: number) {
  return prisma.assignmentRoom.findUnique({
    where: {
      seq,
    },
  });
}
