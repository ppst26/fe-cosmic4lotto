/**
 * ข้อมูลและ Mock Items สำหรับหน้ารวมยิงปลา (/fishing)
 * การ์ดรูปจาก public/fishing — ใช้บนหน้า /fishing, carousel หน้าแรก และ lobby desktop
 */

import type { FishingFilterTabItem, FishingCardItem } from "@/app/types/providers";

/** แถบตัวกรองหน้ายิงปลา */
export const FISHING_FILTER_TABS: FishingFilterTabItem[] = [
  { id: "all-in-one", labelKey: "filters.allInOne", iconId: "gift" },
  { id: "all-providers", labelKey: "filters.allProviders", iconId: "gamepad" },
  { id: "arcade", labelKey: "filters.arcade", iconId: "water-drop" },
  { id: "multiplayer", labelKey: "filters.multiplayer", iconId: "trophy" },
  { id: "hot", labelKey: "filters.hot", iconId: "flame" },
];

const FISHING_DEFAULT_TAGS = ["all-in-one", "all-providers", "arcade"] as const;

/** ชื่อค่ายตามไฟล์ใน public/fishing */
const FISHING_COVER_META: {
  file: string;
  title: string;
  provider: string;
  href: string;
  badges?: FishingCardItem["badges"];
  tags?: string[];
}[] = [
  {
    file: "amb.avif",
    title: "AMB Fishing",
    provider: "AMB",
    href: "/fishing/amb",
    badges: ["EXCLUSIVE", "HOT"],
  },
  {
    file: "cq9.avif",
    title: "CQ9 Fishing",
    provider: "CQ9",
    href: "/fishing/cq9",
    badges: ["HOT", "LIVE"],
    tags: ["all-in-one", "all-providers", "arcade", "hot"],
  },
  {
    file: "Fc.avif",
    title: "FC Fishing",
    provider: "FC",
    href: "/fishing/fc",
    badges: ["EXCLUSIVE"],
  },
  {
    file: "fungy.avif",
    title: "FunGy Fishing",
    provider: "FunGy",
    href: "/fishing/fungy",
    badges: ["HOT"],
    tags: ["all-in-one", "all-providers", "multiplayer"],
  },
  {
    file: "goldy.avif",
    title: "Goldy Fishing",
    provider: "Goldy",
    href: "/fishing/goldy",
    badges: ["LIVE"],
  },
  {
    file: "simpleplay.avif",
    title: "Simple Play Fishing",
    provider: "Simple Play",
    href: "/fishing/simpleplay",
    badges: ["EXCLUSIVE", "LIVE"],
    tags: ["all-in-one", "all-providers", "arcade"],
  },
  {
    file: "spade.avif",
    title: "Spadegaming Fishing",
    provider: "Spadegaming",
    href: "/fishing/spade",
    badges: ["HOT", "LIVE"],
    tags: ["all-in-one", "all-providers", "hot"],
  },
  {
    file: "Xo.avif",
    title: "XO Fishing",
    provider: "XO",
    href: "/fishing/xo",
    badges: ["EXCLUSIVE", "LIVE"],
    tags: ["all-in-one", "all-providers", "multiplayer"],
  },
  {
    file: "ygr.avif",
    title: "YGR Fishing",
    provider: "YGR",
    href: "/fishing/ygr",
    badges: ["HOT"],
  },
];

function buildFishingCoverItem(meta: (typeof FISHING_COVER_META)[number]): FishingCardItem {
  const slug = meta.file.replace(/\.avif$/i, "");
  return {
    id: `fishing-${slug.toLowerCase()}`,
    title: meta.title,
    provider: meta.provider,
    badges: meta.badges ?? ["LIVE"],
    coverSrc: `/fishing/${meta.file}`,
    tags: meta.tags ?? [...FISHING_DEFAULT_TAGS],
    href: meta.href,
  };
}

export const FISHING_PROVIDER_COVERS: FishingCardItem[] =
  FISHING_COVER_META.map(buildFishingCoverItem);

export const FISHING_ITEMS: FishingCardItem[] = FISHING_PROVIDER_COVERS;
