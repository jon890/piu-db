import RoomDB from "@/server/prisma/room.db";
import dayjs from "dayjs";
import { z } from "zod";

export const CreateAssignmentSchema = z
  .object({
    user_seq: z.coerce.number().gt(0, "유저 정보가 잘못되었습니다"),
    room_seq: z.coerce.number().gt(0, "참여 정보가 잘못되었습니다"),
    song_seq: z.coerce.number().gt(0, "노래 정보가 잘못되었습니다"),
    chart_seq: z.coerce.number().gt(0, "노래 정보가 잘못되었습니다"),
    start_date: z.coerce.date({ required_error: "시작일을 입력해주세요" }),
    end_date: z.coerce.date({ required_error: "종료일을 입력해주세요" }),
  })
  .refine(
    ({ end_date }) => {
      if (dayjs().isAfter(end_date)) {
        return false;
      }

      return true;
    },
    { path: ["end_date"], message: "종료일이 오늘보다 이전입니다." }
  )
  .refine(
    ({ start_date, end_date }) => {
      if (dayjs(start_date).isAfter(end_date)) {
        return false;
      }

      return true;
    },
    { path: ["start_date"], message: "종료일보다 시작일이 더 이후입니다." }
  )

  .refine(
    async ({ user_seq, room_seq }) => {
      return RoomDB.isParticipated(room_seq, user_seq);
    },
    { path: ["room_seq"], message: "해당 숙제방에 참여중인 멤버가 아닙니다" }
  );
