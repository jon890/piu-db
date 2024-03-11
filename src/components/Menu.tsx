"use client";

import classnames from "@/client/utils/classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENUS = [
  { text: "숙제방 목록", href: "/rooms" },
  { text: "펌프잇업 기록 연동", href: "/crawling" },
  { text: "기록 목록", href: "/record" },
];

export default function Menu() {
  return (
    <ul className="menu menu-sm md:menu-md lg:menu-lg p-4 w-40 lg:w-60 xl:w-80 min-h-full bg-base-200 font-semibold gap-5">
      {MENUS.map((menu) => (
        <MenuLink key={menu.href} text={menu.text} href={menu.href} />
      ))}
    </ul>
  );
}

function MenuLink({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();
  return (
    <li>
      <Link
        href={href}
        className={classnames(pathname.startsWith(href) ? "active" : "")}
      >
        {text}
      </Link>
    </li>
  );
}
