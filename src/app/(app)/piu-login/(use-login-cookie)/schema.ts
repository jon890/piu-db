import { z } from "zod";

export const GetRecentlyPlayedSchema = z.object({
  email: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  userSeq: z.coerce.number().gt(0, "유저 정보가 잘못되었습니다"),
});
