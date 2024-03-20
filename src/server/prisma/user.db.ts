import prisma from "./client";

async function getUser(name: string) {
  return prisma.user.findUnique({ where: { name } });
}

async function getUserBySeq(seq: number) {
  return prisma.user.findUnique({
    where: { seq },
    select: {
      seq: true,
      name: true,
      uid: true,
      nickname: true,
    },
  });
}

async function getUserByUID(uid: string) {
  return prisma.user.findUnique({
    where: { uid },
    select: {
      seq: true,
      name: true,
      uid: true,
      nickname: true,
    },
  });
}

const UserDB = {
  getUser,
  getUserBySeq,
  getUserByUID,
};

export default UserDB;
