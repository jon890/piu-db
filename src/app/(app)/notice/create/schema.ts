import { z } from "zod";

export const CreateNoticeSchema = z.object({
  title: z.string().min(1),
  contents: z.string().min(1),
  userSeq: z.number().min(1),
});
