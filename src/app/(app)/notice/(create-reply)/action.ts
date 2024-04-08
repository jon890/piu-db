"use server";

import NoticeDB from "@/server/prisma/notice.db";
import AuthUtil from "@/server/utils/auth-util";

export async function createNoticeReply(noticeSeq: number, contents: string) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  await NoticeDB.createReply({
    noticeSeq,
    contents,
    userSeq,
  });

  return {
    ok: true,
  };
}
