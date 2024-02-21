"use client";

import classnames from "@/client/utils/classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();

  console.log("pathname", pathname);

  return (
    <ul className="menu menu-sm md:menu-md lg:menu-lg p-4 w-40 lg:w-60 xl:w-80 min-h-full bg-base-200 font-semibold gap-5">
      <li>
        <Link
          href="/rooms"
          className={classnames(pathname.startsWith("/rooms") ? "active" : "")}
        >
          방 목록
        </Link>
      </li>
      <li>
        <Link
          href="/crawling"
          className={classnames(
            pathname.startsWith("/crawling") ? "active" : ""
          )}
        >
          펌프잇업 기록 연동
        </Link>
      </li>
    </ul>
  );
}
