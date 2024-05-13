"use server";

import ActionLogDB from "@/server/prisma/action-log.db";
import UserDB from "@/server/prisma/user.db";
import AuthUtil from "@/server/utils/auth-util";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export async function changeNicknameAction(newNickname: string) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const user = await UserDB.getUserBySeq(userSeq);

  if (!user) {
    return {
      ok: false,
      errorCode: "NOT_FOUND_USER",
      mesasge: "사용자가 존재하지 않습니다",
    };
  }

  const latestLog = await ActionLogDB.getLatestBy({
    userSeq,
    actionType: "CHANGE_NICKNAME",
  });

  if (latestLog) {
    const dayDiff = dayjs().diff(latestLog.createdAt, "day");
    if (dayDiff === 0) {
      return {
        ok: false,
        errorCode: "NOT_POSSIBLE_CHANGE_NICKNAME_DAYS",
        message: "닉네임을 아직 변경할 수 없습니다",
      };
    }
  }

  await UserDB.updateNickname(userSeq, newNickname);
  await ActionLogDB.create({
    actionType: "CHANGE_NICKNAME",
    userSeq,
    extra: JSON.stringify({ oldValue: user.nickname, newValue: newNickname }),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
