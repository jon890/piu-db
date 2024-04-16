"use client";

import useToast from "@/client/hooks/use-toast";
import classnames from "@/utils/classnames";
import { syncAssignmentAction } from "@/server/action/sync-assignment.action";
import { AssignmentRoom } from "@prisma/client";
import { useState } from "react";

type Props = {
  room: AssignmentRoom;
  piuAuth: { email: string; password: string };
};

export default function SyncAssignmentButton({ room, piuAuth }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function syncRecordWithAuth() {
    setLoading(true);

    const res = await syncAssignmentAction(room.seq, piuAuth);

    toast.createToast({
      type: res.ok ? "success" : "error",
      message: res.message ?? "",
    });

    setLoading(false);
  }

  return piuAuth ? (
    <button
      onClick={syncRecordWithAuth}
      className={classnames(loading ? "btn btn-disabled h-auto py-1" : "")}
      disabled={loading}
      aria-disabled={loading}
    >
      {loading ? (
        <>
          동기화 중입니다...
          <br />
          페이지를 이동하지마세요...
          <br />
          (최대 20초 정도 소요됩니다)
        </>
      ) : (
        "숙제 기록 동기화"
      )}
    </button>
  ) : (
    <button className="btn btn-disabled">펌프잇업 로그인이 필요합니다</button>
  );
}
