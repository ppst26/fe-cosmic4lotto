/**
 * ข้อมูลและ Mock Items สำหรับหน้ารวมคาสิโนสด (/casino)
 * แสดงผลเป็น 3 คอลัมน์แนวตั้ง — การ์ดรูปจาก public/casino
 */

import { casinoProviderHrefFromFile } from "@/lib/categoryProviderPaths";
import { buildCasinoProviderPlayHref } from "@/lib/gamePlayPaths";
import type { CasinoFilterTabItem, CasinoCardItem } from "@/app/types/providers";

/**
 * แถบตัวกรองสำหรับหน้าคาสิโนสด
 */
export const CASINO_FILTER_TABS: CasinoFilterTabItem[] = [
  { id: "all-in-one", labelKey: "filters.allInOne", iconId: "gift" },
  { id: "all-providers", labelKey: "filters.allProviders", iconId: "gamepad" },
  { id: "baccarat", labelKey: "filters.baccarat", iconId: "cards" },
  { id: "roulette", labelKey: "filters.roulette", iconId: "roulette" },
  { id: "blackjack", labelKey: "filters.blackjack", iconId: "cards" },
  { id: "game-shows", labelKey: "filters.gameShows", iconId: "game-shows" },
  { id: "sicbo", labelKey: "filters.sicbo", iconId: "dice" },
];

/** ชื่อค่ายตามไฟล์ใน public/casino (ครบทุก .webp) */
const CASINO_COVER_META: {
  file: string;
  title: string;
  provider: string;
  href: string;
  badges?: CasinoCardItem["badges"];
  tags?: string[];
}[] = [
  {
    file: "pragmatic",
    title: "Pragmatic Play Live",
    provider: "Pragmatic Play",
    href: "/casino/pragmatic-play",
    badges: ["EXCLUSIVE", "LIVE"],
  },
  {
    file: "pretty",
    title: "Pretty Gaming",
    provider: "Pretty Gaming",
    href: "/casino/pretty-gaming",
    badges: ["EXCLUSIVE", "LIVE"],
  },
  { file: "sa", title: "SA Gaming", provider: "SA Gaming", href: "/casino/sa-gaming" },
  {
    file: "evo",
    title: "Evolution",
    provider: "Evolution",
    href: "/casino/evolution",
    tags: ["all-in-one", "all-providers", "roulette", "game-shows"],
  },
  { file: "dream", title: "Dream Gaming", provider: "Dream Gaming", href: "/casino/dream-gaming" },
  { file: "ae", title: "AE Sexy", provider: "AE Sexy", href: "/casino/ae-sexy" },
  { file: "allbet", title: "Allbet", provider: "Allbet", href: "/casino/allbet" },
  {
    file: "betgames",
    title: "BetGames",
    provider: "BetGames",
    href: "/casino/betgames",
    tags: ["all-in-one", "all-providers", "game-shows"],
  },
  { file: "mg", title: "Microgaming Live", provider: "Microgaming", href: "/casino/microgaming" },
  { file: "mt", title: "MT Live", provider: "MT Live", href: "/casino/mt-live" },
  { file: "vivo", title: "Vivo Gaming", provider: "Vivo Gaming", href: "/casino/vivo-gaming" },
  { file: "winfinity", title: "Winfinity", provider: "Winfinity", href: "/casino/winfinity" },
  { file: "wm", title: "WM Casino", provider: "WM Casino", href: "/casino/wm-casino" },
  { file: "yb", title: "YB Live", provider: "YB Live", href: "/casino/yb-live" },
];

const CASINO_DEFAULT_TAGS = ["all-in-one", "all-providers", "baccarat"] as const;

function buildCasinoCoverItem(meta: (typeof CASINO_COVER_META)[number]): CasinoCardItem {
  const catalogPath = meta.href.startsWith("/casino/")
    ? meta.href
    : casinoProviderHrefFromFile(meta.file);
  const slug = catalogPath.replace(/^\/casino\//, "");

  return {
    id: `provider-${meta.file}`,
    title: meta.title,
    provider: meta.provider,
    badges: meta.badges ?? ["LIVE"],
    coverSrc: `/casino/${meta.file}.webp`,
    tags: meta.tags ?? [...CASINO_DEFAULT_TAGS],
    href: buildCasinoProviderPlayHref({
      slug,
      title: meta.title,
      provider: meta.provider,
    }),
  };
}

/** การ์ดรูปค่ายจาก public/casino — ใช้บนหน้า /casino */
export const CASINO_PROVIDER_COVERS: CasinoCardItem[] = CASINO_COVER_META.map(buildCasinoCoverItem);

/** รายการกริดคาสิโนสด (รูปครบทุกไฟล์ในโฟลเดอร์) */
export const CASINO_ITEMS: CasinoCardItem[] = CASINO_PROVIDER_COVERS;
