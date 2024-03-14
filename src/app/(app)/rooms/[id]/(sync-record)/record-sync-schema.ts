import { z } from "zod";

export const RecordSyncSchema = z.object({
  roomSeq: z.coerce.number().gt(0, "참여 정보가 잘못되었습니다"),
  userSeq: z.coerce.number().gt(0, "유저 정보가 잘못되었습니다"),
});
