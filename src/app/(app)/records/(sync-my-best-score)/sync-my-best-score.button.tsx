"use client";

import useToast from "@/client/hooks/use-toast";
import type { PiuAuth } from "@/types/piu-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { syncRecentlyPlayedAction } from "../(sync-recently-played)/sync-recently-played.action";
import { syncMyBestScoreAction } from "./sync-my-best-score.action";

type Props = {
  piuAuth: PiuAuth;
};

export default function SyncMyBestScoreButton({ piuAuth }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);

    const res = await syncMyBestScoreAction(piuAuth);
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
      className="btn btn-secondary text-xs sm:text-sm"
      disabled={loading}
      aria-disabled={loading}
    >
      {loading
        ? "페이지를 이동하지마세요... (최대 1분 정도 소요됩니다)"
        : "마이 베스트 불러오기 (전체)"}
    </button>
  ) : (
    <button className="btn btn-disabled">
      기록을 가져오려면 로그인이 필요합니다
    </button>
  );
}
