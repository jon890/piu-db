import AssignmentDB from "@/server/prisma/assignment.db";
import TimeUtil from "@/server/utils/time-util";
import dayjs from "dayjs";
import { z } from "zod";

export const UpdateAssignmentSchema = z
  .object({
    user_seq: z.coerce.number().gt(0, "유저 정보가 잘못되었습니다"),
    room_seq: z.coerce.number().gt(0, "방 정보가 잘못되었습니다"),
    assignment_seq: z.coerce.number().gt(0, "숙제방 정보가 잘못되었습니다"),
    start_date: z.coerce.date({ required_error: "시작일을 입력해주세요" }),
    end_date: z.coerce.date({ required_error: "종료일을 입력해주세요" }),
    memo: z.string().optional(),
    enable_break_off: z.literal("on").optional(),
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
    async ({ user_seq, assignment_seq }) => {
      const assignment = await AssignmentDB.getAssignment(assignment_seq);
      if (!assignment) return false;

      const between = TimeUtil.isBetween(
        assignment.startDate,
        assignment.endDate
      );
      if (!between) return false;

      const isMine = user_seq === assignment.createUserSeq;
      if (!isMine) return false;

      return true;
    },
    {
      path: ["assignment_seq"],
      message: "숙제를 변경할 수 없습니다",
    }
  );
