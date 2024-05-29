"use client";

import useToast from "@/client/hooks/use-toast";
import type { PiuAuth } from "@/types/piu-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { syncRecentlyPlayedAction } from "./sync-recently-played.action";
import Link from "next/link";
import ButtonWithLoading from "@/components/common/button-with-loading";

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
      type: res.ok ? "success" : res.type ?? "error",
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
      loadingText="페이지를 이동하지마세요... (최대 15초 정도 소요됩니다)"
      text="마이 베스트 불러오기 (전체)"
      className="btn-primary"
    />
  ) : (
    <Link className="btn btn-info" href="/piu-login">
      최근플레이를 불러오려면 먼저 펌프잇업 로그인을 이용하세요
    </Link>
  );
}
