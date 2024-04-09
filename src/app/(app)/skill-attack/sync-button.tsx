"use client";

import useToast from "@/client/hooks/use-toast";
import type { PiuAuth } from "@/types/piu-auth";
import { useState } from "react";
import { skillAttackAction } from "./skill-attack.action";
import { useRouter } from "next/navigation";

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

    const res = await skillAttackAction(piuAuth);
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
        ? "페이지를 이동하지 마세요... (최대 15초 정도 소요됩니다)"
        : "스킬 어택 동기화"}
    </button>
  ) : (
    <button className="btn btn-disabled">
      스킬어택을 사용하려면 하려면 먼저 펌프잇업 로그인을 이용하세요
    </button>
  );
}
