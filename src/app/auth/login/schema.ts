import { z } from "zod";

export const LoginSchema = z.object({
  name: z.string().toLowerCase().trim().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});
