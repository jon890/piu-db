import prisma from "@/server/prisma/client";
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
    },
    update: {
      isExited: false,
      // TODO 나갔다가 들어왔을 때 기록을 말소할지?
    },
  });
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
    },
  });
}

const ParticipantsDB = {
  participate,
  update,
  getByRoom,
};

export default ParticipantsDB;
