"use client";

import useToast from "@/client/hooks/use-toast";
import { useState } from "react";
import { skillAttackAction } from "./skill-attack.action";

export default function SkillAttackButton() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);

    await skillAttackAction();
    setLoading(false);
  }

  return (
    <button
      onClick={run}
      className="btn btn-primary text-xs sm:text-sm"
      disabled={loading}
      aria-disabled={loading}
    >
      {loading
        ? "잠시만 기다려주세요... (최대 10초 정도 소요됩니다)"
        : "기록 불러오기 및 스킬 어택 동기화"}
    </button>
  );
}
