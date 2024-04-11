"use client";

import classnames from "@/client/utils/classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SkillAttackTab() {
  const pathname = usePathname();

  return (
    <div role="tablist" className="tabs tabs-bordered">
      <Link
        href="/skill-attack"
        role="tab"
        className={classnames(
          "tab",
          pathname === "/skill-attack" ? "tab-active" : ""
        )}
      >
        내 기록
      </Link>
      <Link
        href="/skill-attack/rank"
        role="tab"
        className={classnames(
          "tab",
          pathname === "/skill-attack/rank" ? "tab-active" : ""
        )}
      >
        랭킹
      </Link>
    </div>
  );
}
