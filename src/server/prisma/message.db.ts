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

const MessageDB = {
  getMessagesByUser,
};

export default MessageDB;
