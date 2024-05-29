"use client";

import useToast from "@/client/hooks/use-toast";
import type { PiuAuth } from "@/types/piu-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { syncMyBestScoreAction } from "./sync-my-best-score.action";
import ButtonWithLoading from "@/components/common/button-with-loading";
import Link from "next/link";

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
    <ButtonWithLoading
      loading={loading}
      onClick={run}
      disabled={loading}
      aria-disabled={loading}
      loadingText="페이지를 이동하지마세요... (최대 1분 정도 소요됩니다)"
      text="마이 베스트 불러오기 (전체)"
      className="btn-secondary"
    />
  ) : (
    <Link className="btn btn-info" href="/piu-login">
      마이베스트를 불러오려면 먼저 펌프잇업 로그인을 이용하세요
    </Link>
  );
}
