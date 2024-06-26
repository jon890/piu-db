import prisma from "@/server/prisma/prisma.client";
import { BusinessException } from "@/utils/business.exception";
import { AssignmentRoom, Prisma } from "@prisma/client";

async function participate(
  room: AssignmentRoom,
  userSeq: number,
  tx?: Prisma.TransactionClient
) {
  const client = tx ? tx : prisma;

  if (room.stopParticipating) {
    throw new BusinessException("PARTICIPATE_ROOM_RESTRICTED");
  }

  return client.assignmentRoomParticipants.upsert({
    where: {
      assignmentRoomSeq_userSeq: {
        userSeq,
        assignmentRoomSeq: room.seq,
      },
    },
    create: {
      userSeq,
      assignmentRoomSeq: room.seq,
      participateDate: new Date(),
    },
    update: {
      isExited: false,
      participateDate: new Date(),
      // TODO 나갔다가 들어왔을 때 기록을 말소할지?
    },
  });
}

async function exit(
  room: AssignmentRoom,
  userSeq: number,
  tx?: Prisma.TransactionClient
) {
  const client = tx ? tx : prisma;

  const isParticipating = await isParticipated(room.seq, userSeq, tx);
  if (!isParticipating) {
    throw BusinessException.newInstance("NOT_PARTICIPATED_ROOM");
  }

  return client.assignmentRoomParticipants.update({
    where: {
      assignmentRoomSeq_userSeq: {
        assignmentRoomSeq: room.seq,
        userSeq,
      },
    },
    data: {
      isExited: true,
    },
  });
}

async function isParticipated(
  roomSeq: number,
  userSeq: number,
  tx?: Prisma.TransactionClient
) {
  const client = tx ? tx : prisma;

  const exist = await client.assignmentRoomParticipants.count({
    where: {
      assignmentRoomSeq: roomSeq,
      userSeq: userSeq,
      isExited: false,
    },
  });

  return exist > 0;
}

async function update(
  roomSeq: number,
  userSeq: number,
  firstPlace: number[],
  secondPlace: number[],
  thirdPlace: number[],
  score: number,
  notAttendCount: number,
  tx?: Prisma.TransactionClient
) {
  const client = tx ? tx : prisma;

  return client.assignmentRoomParticipants.update({
    where: {
      assignmentRoomSeq_userSeq: {
        assignmentRoomSeq: roomSeq,
        userSeq,
      },
    },
    data: {
      firstPlaceSeqs: firstPlace,
      secondPlaceSeqs: secondPlace,
      thirdPlaceSeqs: thirdPlace,
      totalScore: score,
      notAttendCount,
    },
  });
}

async function getByRoom(roomSeq: number, tx?: Prisma.TransactionClient) {
  const client = tx ? tx : prisma;

  return client.assignmentRoomParticipants.findMany({
    where: {
      assignmentRoomSeq: roomSeq,
      isExited: false,
    },
  });
}

export type RoomParticipantsWithUser = Prisma.PromiseReturnType<
  typeof getByRoomWithUser
>;
async function getByRoomWithUser(roomSeq: number) {
  return prisma.assignmentRoomParticipants.findMany({
    where: {
      assignmentRoomSeq: roomSeq,
      isExited: false,
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
      participateDate: "asc",
    },
  });
}

export async function kickout() {}

const ParticipantsDB = {
  exit,
  update,
  participate,
  isParticipated,
  getByRoom,
  getByRoomWithUser,
};

export default ParticipantsDB;
