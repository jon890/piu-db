import { User } from "@prisma/client";
import prisma from "./client";

async function getUser(name: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { name } });
    return user;
  } catch (error) {
    // console.log("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
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
