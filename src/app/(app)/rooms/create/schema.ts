import { z } from "zod";

export const CreateRoomSchema = z.object({
  name: z.string().min(1, "방 이름을 입력해주세요"),
  adminUserSeq: z.number().gt(0),
  description: z.string().optional(),
  bannerImage: z.string().optional(),
});
