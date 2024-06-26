import { authConfig } from "@/auth.config";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./app/auth/login/schema";
import UserDB from "./server/prisma/user.db";
import logger from "./server/client/logger.client";

/**
 * Next.js Middleware에서
 * Node.js API에 의존하는 bcrypt를 사용할 수 없으므로
 * bcrypt를 import하는 새로운 파일을 만든다
 * 이 파일은 미들웨어 파일로는 임포트 되면 안된다
 */
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  logger: {
    error(code, ...message) {
      logger.error(`AuthError code:${code}, message:${message}`);
    },
    warn(code, ...message) {
      logger.warn(`AuthWarn code:${code}, message:${message}`);
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { name, password } = parsedCredentials.data;
        const user = await UserDB.getUser(name);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return {
          id: user.seq.toString(),
          name: user.name,
          email: user.seq.toString(),
        };
      },
    }),
  ],
});
