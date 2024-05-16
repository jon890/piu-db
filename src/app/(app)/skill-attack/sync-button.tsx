"use client";

import useToast from "@/client/hooks/use-toast";
import { syncSkillAttackAction } from "@/server/action/sync-skill-attack.action";
import type { PiuAuth } from "@/types/piu-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  piuAuth: PiuAuth;
};

/**
 * 스킬 어택 동기화 버튼
 * @param param0
 * @returns
 */
export default function SkillAttackSyncButton({ piuAuth }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);

    const res = await syncSkillAttackAction();
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
      {loading ? "스킬어택을 갱신중입니다..." : "스킬 어택 동기화"}
    </button>
  ) : (
    <Link className="btn btn-info" href="/piu-login">
      스킬어택을 사용하려면 하려면 먼저 펌프잇업 로그인을 이용하세요
    </Link>
  );
}
