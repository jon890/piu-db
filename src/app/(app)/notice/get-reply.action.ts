"use server";

import NoticeDB from "@/server/prisma/notice.db";

export default async function getReplyAction(noticeSeq: number) {
  return NoticeDB.getReply(noticeSeq);
}
