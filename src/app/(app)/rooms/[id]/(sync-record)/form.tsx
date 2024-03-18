"use client";

import useToast from "@/client/hooks/use-toast";
import { AssignmentRoom } from "@prisma/client";
import { useState } from "react";
import { syncRecordWithAuthAction } from "./sync-record-with-auth";

type Props = {
  room: AssignmentRoom;
  piuAuth: { email: string; password: string };
};

export default function RecordSyncForm({ room, piuAuth }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function syncRecordWithAuth() {
    setLoading(true);

    const res = await syncRecordWithAuthAction(room.seq, piuAuth);

    toast.createToast({
      type: res.ok ? "success" : "error",
      message: res.message ?? "",
    });

    setLoading(false);
  }

  return piuAuth ? (
    <button
      onClick={syncRecordWithAuth}
      className="btn btn-primary text-xs sm:text-sm"
      disabled={loading}
      aria-disabled={loading}
    >
      {loading
        ? "잠시만 기다려주세요... (최대 10초 정도 소요됩니다)"
        : "숙제 기록 동기화"}
    </button>
  ) : (
    <button className="btn btn-disabled">
      숙제 동기화를 하려면 먼저 펌프잇업 로그인을 이용하세요
    </button>
  );
}
