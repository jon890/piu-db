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

async function getUsersBy(userSeqs: number[]) {
  return prisma.user.findMany({
    where: {
      seq: { in: userSeqs },
    },
    select: {
      seq: true,
      name: true,
      nickname: true,
      uid: true,
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

async function updatePassword(userId: string, password: string) {
  return prisma.user.update({
    where: {
      name: userId,
    },
    data: {
      password,
    },
  });
}

const UserDB = {
  getUser,
  getUserBySeq,
  getUserByUID,
  getUsersBy,
  updatePassword,
};

export default UserDB;
