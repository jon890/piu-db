import prisma from "./client";
import UserDB from "./user.db";

async function getMyRivalByUID(userSeq: number, uid: string) {
  const rivalUserSeq = (await UserDB.getUserByUID(uid))?.seq;

  if (!rivalUserSeq) {
    return null;
  }

  const rivalInfos = await prisma.rival.findMany({
    where: {
      OR: [
        { fromUserSeq: userSeq, toUserSeq: rivalUserSeq },
        { fromUserSeq: rivalUserSeq, toUserSeq: userSeq },
      ],
    },
  });

  return rivalInfos?.[0];
}

async function createRival(userSeq: number, uid: string) {
  const rivalUserSeq = (await UserDB.getUserByUID(uid))?.seq;

  if (!rivalUserSeq) {
    return false;
  }

  await prisma.rival.create({
    data: {
      fromUserSeq: userSeq,
      toUserSeq: rivalUserSeq,
    },
  });
  return true;
}

const RivalDB = {
  getMyRivalByUID,
  createRival,
};

export default RivalDB;
