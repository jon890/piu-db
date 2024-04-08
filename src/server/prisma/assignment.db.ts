import { CreateAssignmentSchema } from "@/app/(app)/rooms/[id]/assignments/create/create-schema";
import prisma from "@/server/prisma/client";
import { z } from "zod";
import TimeUtil from "../utils/time-util";

/**
 * 과제곡 생성 유저에서 join해서 불러올 필드 정의
 */
const AssignmentCreateUserPayload = {
  createUser: {
    select: { nickname: true },
  },
};

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
      endDate: TimeUtil.setMaxTime(params.end_date),
      createUserSeq: params.user_seq,
      memo: params.memo,
      enableBreakOff: params.enable_break_off === "on",
    },
  });

  return {
    ok: true,
    assignment,
  };
}

// TODO : 과제곡이 많아졌을 때 페이징 처리
async function getAssignments(roomSeq: number) {
  return prisma.assignment.findMany({
    where: {
      roomSeq,
    },
    orderBy: [{ endDate: "asc" }],
    include: {
      ...AssignmentCreateUserPayload,
    },
  });
}

async function getOngoingAssignments(roomSeq: number) {
  const now = TimeUtil.now();

  const assigments = await prisma.assignment.findMany({
    where: {
      roomSeq,
      startDate: {
        lte: now,
      },
      endDate: {
        gte: now,
      },
    },
    include: {
      ...AssignmentCreateUserPayload,
    },
  });

  return assigments;
}

async function getAssignment(assignmentSeq: number) {
  const assignment = await prisma.assignment.findUnique({
    where: {
      seq: assignmentSeq,
    },
  });

  return assignment;
}

const AssignmentDB = {
  createAssignment,
  getOngoingAssignments,
  getAssignments,
  getAssignment,
};

export default AssignmentDB;
