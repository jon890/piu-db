"use client";

import classnames from "@/utils/classnames";
import { MENUS } from "@/constants/menus";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
  return (
    <ul className="menu menu-sm md:menu-md lg:menu-lg p-4 w-40 lg:w-60 xl:w-80 min-h-full bg-base-200 font-semibold gap-5 z-40">
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
