import { authConfig } from "@/auth.config";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import UserDB from "./server/prisma/user.db";

/**
 * Next.js Middleware에서
 * Node.js API에 의존하는 bcrypt를 사용할 수 없으므로
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
          const user = await UserDB.getUser(name);
          // console.log("auth", "getUser", user);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          // console.log("passwordsMatch", passwordsMatch);

          // TODO KBT : 리턴값이 custom 화 될 수 없는지?
          // declare module 로 동작하지 않는듯..
          if (passwordsMatch) {
            return {
              id: user.seq.toString(),
              name: user.name,
              email: user.seq.toString(),
            };
          }
        }

        // console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
