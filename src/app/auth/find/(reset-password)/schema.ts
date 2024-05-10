import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    userId: z.string().min(1, "정보가 잘못되었습니다"),
    password: z.string().min(1, "비밀번호를 입력해주세요"),
    passwordConfirm: z.string().min(1, "비밀번호를 입력해주세요"),
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
  );
