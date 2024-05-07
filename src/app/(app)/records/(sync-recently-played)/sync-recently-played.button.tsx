"use client";

import useToast from "@/client/hooks/use-toast";
import type { PiuAuth } from "@/types/piu-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { syncRecentlyPlayedAction } from "./sync-recently-played.action";

type Props = {
  piuAuth: PiuAuth;
};

export default function SyncRecentlyPlayedButton({ piuAuth }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);

    const res = await syncRecentlyPlayedAction(piuAuth);
    toast.createToast({
      type: res.ok ? "success" : "error",
      message: res.message ?? "",
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
    }
  }

  return piuAuth ? (
    <button
      onClick={run}
      className="btn btn-primary text-xs sm:text-sm"
      disabled={loading}
      aria-disabled={loading}
    >
      {loading
        ? "페이지를 이동하지마세요... (최대 15초 정도 소요됩니다)"
        : "최근 기록 불러오기 (최대 50개)"}
    </button>
  ) : (
    <button className="btn btn-disabled">
      기록을 가져오려면 로그인이 필요합니다
    </button>
  );
}
