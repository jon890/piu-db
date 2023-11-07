import Link from "next/link";

export default function Menu() {
  return (
    <ul className="menu menu-xs sm:menu-sm md:menu-md lg:menu-lg p-4 w-80 min-h-full bg-base-200 font-semibold space-y-5">
      <li>
        <Link href="/rooms">방 목록</Link>
      </li>
      <li>
        <Link href="/asdf">펌프잇업 기록 연동</Link>
      </li>
    </ul>
  );
}
