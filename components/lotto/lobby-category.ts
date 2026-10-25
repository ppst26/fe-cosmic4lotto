/** หมวดเกมของ lobby — path → หมวด (path ยาวก่อน · "/" ตรงเฉพาะหน้าแรก) */
export type LobbyCategoryKey = "lottery" | "casino" | "slots" | "fishing" | "sports" | "cards";

export const LOBBY_CATEGORIES: {
  key: LobbyCategoryKey;
  label: string;
  icon: string;
  href: string;
}[] = [
  { key: "lottery", label: "หวย", icon: "/menu-icon/lotto.webp", href: "/" },
  { key: "casino", label: "คาสิโน", icon: "/menu-icon/casino.webp", href: "/casino" },
  { key: "slots", label: "สล็อต", icon: "/menu-icon/slot.webp", href: "/slots" },
  { key: "fishing", label: "ยิงปลา", icon: "/menu-icon/fish.webp", href: "/fishing" },
  { key: "sports", label: "กีฬา", icon: "/menu-icon/sport.webp", href: "/sport" },
  { key: "cards", label: "เกมไพ่", icon: "/menu-icon/card.webp", href: "/cards" },
];

/** หมวดที่ active จาก pathname — "/" (หน้าแรก) = หวย */
export function resolveLobbyCategory(pathname: string): LobbyCategoryKey {
  for (const c of LOBBY_CATEGORIES) {
    if (c.href === "/") continue;
    if (pathname === c.href || pathname.startsWith(`${c.href}/`)) return c.key;
  }
  return "lottery";
}
