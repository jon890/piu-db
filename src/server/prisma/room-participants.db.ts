import prisma from "@/server/prisma/client";
import { Prisma } from "@prisma/client";

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
  update,
  getByRoom,
};

export default ParticipantsDB;
