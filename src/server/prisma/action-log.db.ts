import { ActionType } from "@prisma/client";
import prisma from "./client";

async function create({
  actionType,
  userSeq,
}: {
  actionType: ActionType;
  userSeq: number;
}) {
  return prisma.actionLog.create({
    data: {
      actionType,
      userSeq,
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

const ActionLogDB = {
  create,
  getLatestSyncRecord,
};

export default ActionLogDB;
