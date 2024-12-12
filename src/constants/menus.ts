export const MENUS = [
  { text: "공지사항", href: "/notice", isNew: false, isBeta: false },
  { text: "숙제방 목록", href: "/rooms", isNew: false, isBeta: false },
  { text: "펌프잇업 로그인", href: "/piu-login", isNew: false, isBeta: false },
  { text: "전체 노래 목록", href: "/songs", isNew: false, isBeta: false },
  {
    text: "내 기록 목록",
    href: "/records",
    isNew: false,
    isBeta: false,
  },
  { text: "스킬 어택", href: "/skill-attack", isNew: false, isBeta: false },
  { text: "펌빌리티", href: "/pumbility", isNew: false, isBeta: true },
  { text: "프로필", href: "/profile", isNew: false, isBeta: false },
] as const;

export type MenuType = keyof typeof MENUS;
