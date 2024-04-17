import { UpdateAssignmentSchema } from "@/app/(app)/rooms/[id]/assignments/[assignment_seq]/update/update.schema";
import { CreateAssignmentSchema } from "@/app/(app)/rooms/[id]/assignments/create/create-schema";
import prisma from "@/server/prisma/client";
import { z } from "zod";
import TimeUtil from "../utils/time-util";
import { Prisma, PrismaClient } from "@prisma/client";

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
  return prisma.$transaction(async (tx) => {
    const room = await tx.assignmentRoom.findUnique({
      where: {
        seq: params.room_seq,
      },
    });

    if (!room) {
      return { ok: false, message: "방이 존재하지 않습니다" };
    }

    const assignmentAuthorityUsers = room.selectSongAuthorityUsers as
      | null
      | number[];
    if (
      assignmentAuthorityUsers &&
      !assignmentAuthorityUsers.includes(params.user_seq)
    ) {
      return { ok: false, message: "숙제곡 선곡 권한이 없습니다" };
    }

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
      return {
        ok: false,
        message: "해당 차트의 이미 진행중인 숙제가 있습니다",
      };
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
  });
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

async function deleteAssignment(userSeq: number, assignmentSeq: number) {
  return prisma.assignment.delete({
    where: {
      seq: assignmentSeq,
      createUserSeq: userSeq,
    },
  });
}

async function updateAssignment({
  assignment_seq,
  end_date,
  start_date,
  user_seq,
  enable_break_off,
  memo,
}: z.infer<typeof UpdateAssignmentSchema>) {
  return prisma.assignment.update({
    data: {
      startDate: start_date,
      endDate: TimeUtil.setMaxTime(end_date),

      memo: memo,
      enableBreakOff: enable_break_off === "on",
    },
    where: {
      seq: assignment_seq,
      createUserSeq: user_seq,
    },
  });
}

async function readyRankProcess(
  roomSeq: number,
  txClient?: Prisma.TransactionClient
) {
  const now = TimeUtil.now();
  const client = txClient ? txClient : prisma;

  const assignments = await client.assignment.findMany({
    where: {
      roomSeq,
      rankProcessed: false,
      endDate: {
        lte: now,
      },
    },
  });

  if (assignments.length === 0) return [];

  await client.assignment.updateMany({
    data: {
      rankProcessed: true,
    },
    where: {
      seq: {
        in: assignments.map((it) => it.seq),
      },
    },
  });

  return assignments;
}

const AssignmentDB = {
  createAssignment,
  getOngoingAssignments,
  getAssignments,
  getAssignment,
  deleteAssignment,
  updateAssignment,
  readyRankProcess,
};

export default AssignmentDB;
