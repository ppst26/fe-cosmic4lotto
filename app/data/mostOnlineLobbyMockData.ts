import type { MostOnlineLobbyItem } from "@/app/types/lobby";

/**
 * แถบออนไลน์มากที่สุดหน้าแรก — ตัวเลขเป็นตัวอย่าง (ไม่ใช่ live)
 * ใช้ใน fetchHomeMostOnline() → MostOnlineProvidersSection
 */
export const MOST_ONLINE_LOBBY_ITEMS: MostOnlineLobbyItem[] = [
  {
    id: "most-online-pg",
    brandName: "PG SOFT",
    tagline: "POCKET GAMES SOFT",
    href: "/slots/pg-soft",
    coverSrc: "/slots/pg.webp",
    onlineCount: 30_000,
    showHot: true,
  },
  {
    id: "most-online-sexy",
    brandName: "SEXY GAMING",
    tagline: "LIVE BACCARAT",
    href: "/casino/pretty-gaming",
    coverSrc: "/casino/pretty.webp",
    onlineCount: 18_200,
    showHot: true,
  },
  {
    id: "most-online-sa",
    brandName: "SA GAMING",
    tagline: "ENTERTAINMENT",
    href: "/casino/sa-gaming",
    coverSrc: "/casino/sa.webp",
    onlineCount: 7_278,
    showHot: true,
  },
  {
    id: "most-online-evo",
    brandName: "EVOLUTION",
    tagline: "LIVE CASINO",
    href: "/casino/evolution",
    coverSrc: "/casino/evo.webp",
    onlineCount: 7_807,
    showHot: true,
  },
  {
    id: "most-online-pp",
    brandName: "PRAGMATIC PLAY",
    tagline: "DROPS & WINS",
    href: "/slots/pragmatic-play",
    coverSrc: "/slots/pragmaticplay.webp",
    onlineCount: 24_650,
    showHot: true,
  },
  {
    id: "most-online-joker",
    brandName: "JOKER GAMING",
    tagline: "SLOT & ARCADE",
    href: "/slots/joker-gaming",
    coverSrc: "/slots/joker.webp",
    onlineCount: 14_320,
    showHot: true,
  },
];
