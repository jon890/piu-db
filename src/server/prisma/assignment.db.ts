import { CreateAssignmentSchema } from "@/app/(app)/rooms/[id]/assignment/create/create-schema";
import prisma from "@/server/prisma/client";
import { z } from "zod";

async function createAssignment(
  params: z.infer<typeof CreateAssignmentSchema>
) {
  const ongoing = await prisma.assignment.count({
    where: {
      roomSeq: params.room_seq,
      chartSeq: params.chart_seq,
      endDate: {
        gte: new Date(),
      },
    },
  });

  if (ongoing > 0) {
    return { ok: false, message: "해당 차트의 이미 진행중인 숙제가 있습니다" };
  }

  const assignment = await prisma.assignment.create({
    data: {
      roomSeq: params.room_seq,
      chartSeq: params.chart_seq,
      startDate: params.start_date,
      endDate: params.end_date,
      createUserSeq: params.user_seq,
    },
  });

  return {
    ok: true,
    assignment,
  };
}

const AssignmentDB = {
  createAssignment,
};

export default AssignmentDB;
