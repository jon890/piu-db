import { AssignmentRoom, Prisma } from "@prisma/client";
import prisma from "./client";

async function getMessagesByUser(userSeq: number) {
  return prisma.message.findMany({
    where: {
      userSeq,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
}

async function sendKickOutMessage(
  room: AssignmentRoom,
  targetUserSeq: number,
  tx: Prisma.TransactionClient
) {
  const client = tx ? tx : prisma;
  return client.message.create({
    data: {
      userSeq: targetUserSeq,
      title: "방 추방 안내",
      content: `${room.name} 방에서 추방되었습니다`,
      extra: JSON.stringify({ roomSeq: room.seq }),
      type: "KICKED_OUT_OF_THE_ASSIGNMENT_ROOM",
    },
  });
}

const MessageDB = {
  getMessagesByUser,
  sendKickOutMessage,
};

export default MessageDB;
