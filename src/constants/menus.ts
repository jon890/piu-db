export const MENUS = [
  { text: "공지사항", href: "/notice" },
  { text: "숙제방 목록", href: "/rooms" },
  { text: "펌프잇업 로그인", href: "/piu-login" },
  { text: "전체 노래 목록", href: "/songs" },
  {
    text: "내 기록 목록",
    href: "/records",
  },
  { text: "스킬 어택", href: "/skill-attack" },
  { text: "펌빌리티", href: "/pumbility" },
  { text: "프로필", href: "/profile" },
] as const;

export type MenuType = keyof typeof MENUS;
