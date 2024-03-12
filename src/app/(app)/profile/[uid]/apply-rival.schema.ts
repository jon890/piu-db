import { z } from "zod";

export const ApplyRivalSchema = z.object({
  uid: z.string().length(6, "라이벌 코드가 잘못되었습니다."),
});
