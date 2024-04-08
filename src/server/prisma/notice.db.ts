import { CreateNoticeSchema } from "@/app/(app)/notice/create/schema";
import { z } from "zod";
import prisma from "./client";

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

async function getReply(noticeSeq: number) {
  return prisma.reply.findMany({
    where: {
      noticeSeq,
      type: "NOTICE",
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
}

async function createReply({
  contents,
  noticeSeq,
  userSeq,
}: {
  contents: string;
  noticeSeq: number;
  userSeq: number;
}) {
  return prisma.reply.create({
    data: {
      type: "NOTICE",
      userSeq,
      noticeSeq,
      contents,
    },
  });
}

const NoticeDB = {
  getNotices,
  create,
  getReply,
  createReply,
};

export default NoticeDB;
