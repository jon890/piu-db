import prisma from "@/server/prisma/client";
import { z } from "zod";

// todo 쿼리 2건을 한 번에 처리 가능?
export const RegisterUserSchema = z
  .object({
    name: z.string().trim().min(1, "아이디를 입력해주세요"),
    password: z.string().min(6, "비밀번호는 최소 6자리로 설정해주세요"),
    passwordConfirm: z.string().min(6, "비밀번호는 최소 6자리로 설정해주세요"),
    nickname: z.string().min(1, "닉네임을 입력해주세요"),
  })
  .refine(
    ({ password, passwordConfirm }) => {
      if (password !== passwordConfirm) {
        return false;
      }

      return true;
    },
    {
      path: ["passwordConfirm"],
      message: "비밀번호와 비밀번호 확인이 다릅니다",
    }
  )
  .refine(
    async ({ name }) => {
      const exist = await prisma.user.findUnique({
        where: {
          name,
        },
      });

      return !exist;
    },
    { path: ["name"], message: "아이디가 중복되었습니다" }
  )
  .refine(
    async ({ nickname }) => {
      const exist = await prisma.user.findUnique({
        where: {
          nickname,
        },
      });
      return !exist;
    },
    { path: ["nickname"], message: "닉네임이 중복되었습니다" }
  );
