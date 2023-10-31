import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { User } from "@prisma/client";
import prisma from "@/server/prisma/client";
import bcrypt from "bcrypt";

async function getUser(name: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { name } });
    return user;
  } catch (error) {
    console.log("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

/**
 * Next.js Middleware에서
 * Node.js API에 의존하는 bcrypt를 사용할 수 없으므로`
 * bcrypt를 import하는 새로운 파일을 만든다
 * 이 파일은 미들웨어 파일로는 임포트 되면 안된다
 */
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ name: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { name, password } = parsedCredentials.data;
          const user = await getUser(name);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
