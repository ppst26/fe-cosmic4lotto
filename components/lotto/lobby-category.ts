/** หมวดเกมของ lobby — path → หมวด (path ยาวก่อน · "/" ตรงเฉพาะหน้าแรก) */
export type LobbyCategoryKey = "lottery" | "casino" | "slots" | "fishing" | "sports" | "cards";

export const LOBBY_CATEGORIES: {
  key: LobbyCategoryKey;
  label: string;
  icon: string;
  href: string;
}[] = [
  { key: "lottery", label: "หวย", icon: "/assets/3d/menuicon/lotto.avif", href: "/" },
  { key: "casino", label: "คาสิโน", icon: "/assets/3d/menuicon/casino.avif", href: "/casino" },
  { key: "slots", label: "สล็อต", icon: "/assets/3d/menuicon/slot.avif", href: "/slots" },
  { key: "fishing", label: "ยิงปลา", icon: "/assets/3d/menuicon/fish.avif", href: "/fishing" },
  { key: "sports", label: "กีฬา", icon: "/assets/3d/menuicon/sport.avif", href: "/sport" },
  { key: "cards", label: "เกมไพ่", icon: "/assets/3d/menuicon/card.avif", href: "/cards" },
];

/** หมวดที่ active จาก pathname — "/" (หน้าแรก) = หวย */
export function resolveLobbyCategory(pathname: string): LobbyCategoryKey {
  for (const c of LOBBY_CATEGORIES) {
    if (c.href === "/") continue;
    if (pathname === c.href || pathname.startsWith(`${c.href}/`)) return c.key;
  }
  return "lottery";
}
