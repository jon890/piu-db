import { User } from "@prisma/client";
import prisma from "./client";

async function getUser(name: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { name } });
    return user;
  } catch (error) {
    console.log("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

const UserDB = {
  getUser,
};

export default UserDB;
