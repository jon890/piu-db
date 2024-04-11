import { z } from "zod";

export const ChangeRoomSettingsSchema = z.object({
  room_seq: z.coerce.number().min(1, "방 정보가 잘못되었습니다"),
  name: z.string(),
  description: z.string(),
  bannerImage: z.string(),
  stopParticipating: z.literal("on").optional(),
  selectSongAuthorityUsers: z.coerce.number().gt(0).array(),
});
