import { z } from "zod";
import prisma from "./client";
import { CreateNoticeSchema } from "@/app/(app)/notice/create/schema";

async function getNotices(page: number) {
  const unit = 10;

  return prisma.notice.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    skip: (page - 1) * unit,
    take: unit,
  });
}

async function create({
  contents,
  title,
  userSeq,
}: z.infer<typeof CreateNoticeSchema>) {
  return prisma.notice.create({
    data: {
      contents,
      title,
      userSeq,
    },
  });
}

const NoticeDB = {
  getNotices,
  create,
};

export default NoticeDB;
