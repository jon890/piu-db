import type { ActionType } from "@prisma/client";
import prisma from "./client";

async function create({
  actionType,
  userSeq,
  extra,
}: {
  actionType: ActionType;
  userSeq: number;
  extra?: string;
}) {
  return prisma.actionLog.create({
    data: {
      actionType,
      userSeq,
      extra,
    },
  });
}

async function getLatestSyncRecord({ userSeq }: { userSeq: number }) {
  return prisma.actionLog.findFirst({
    where: {
      actionType: "SYNC_RECORD",
      userSeq,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });
}

async function getLatestBy({
  userSeq,
  actionType,
}: {
  userSeq: number;
  actionType: ActionType;
}) {
  return prisma.actionLog.findFirst({
    where: {
      actionType,
      userSeq,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });
}

const ActionLogDB = {
  create,
  getLatestSyncRecord,
  getLatestBy,
};

export default ActionLogDB;
