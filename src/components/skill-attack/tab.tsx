"use client";

import classnames from "@/utils/classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SkillAttackRankRegex = /^\/skill-attack\/[a-zA-Z]{4,6}$/;

export default function SkillAttackTab() {
  const pathname = usePathname();

  console.log("matched?", SkillAttackRankRegex.test(pathname), pathname);

  return (
    <div role="tablist" className="tabs tabs-bordered">
      <Link
        href="/skill-attack"
        role="tab"
        className={classnames(
          "tab",
          !SkillAttackRankRegex.test(pathname) ? "tab-active" : ""
        )}
      >
        내 기록
      </Link>
      <Link
        href="/skill-attack/rank"
        role="tab"
        className={classnames(
          "tab",
          SkillAttackRankRegex.test(pathname) ? "tab-active" : ""
        )}
      >
        랭킹
      </Link>
    </div>
  );
}
