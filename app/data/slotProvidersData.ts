/**
 * ข้อมูล mock หน้าค่ายสล็อต (/slots) — กริดรูปจาก public/slots
 */

import { slotProviderCoverSrc } from "./slotProviderCoverData";
import type { SlotFilterTabItem, FeaturedSlotProviderItem } from "@/app/types/providers";

/**
 * แท็บตัวกรองสำหรับหน้าสล็อต: ศูนย์รวม, ค่ายเกมทั้งหมด, Drops & Wins, ไก่, ซื้อฟรีสปิน, แจ็คพอต, เมกะเวย์
 */
export const SLOT_FILTER_TABS: SlotFilterTabItem[] = [
  {
    id: "all-in-one",
    labelKey: "filters.allInOne",
    iconId: "gift",
  },
  {
    id: "all-providers",
    labelKey: "filters.allGameProviders",
    iconId: "gamepad",
  },
  {
    id: "drops-and-wins",
    labelKey: "filters.dropsAndWins",
    iconId: "water-drop",
  },
  {
    id: "chicken",
    labelKey: "filters.chicken",
    iconId: "chicken",
  },
  {
    id: "buy-feature",
    labelKey: "filters.buyFeature",
    iconId: "flame",
  },
  {
    id: "jackpot",
    labelKey: "filters.jackpot",
    iconId: "trophy",
  },
  {
    id: "megaways",
    labelKey: "filters.megaways",
    iconId: "sparkle",
  },
];

/**
 * 2 แบนเนอร์ใหญ่พิเศษด้านบน (JILI & PRAGMATIC PLAY)
 */
export const FEATURED_SLOT_PROVIDERS: FeaturedSlotProviderItem[] = [
  {
    id: "jili",
    name: "JILI",
    slogan: "PLAY FOR A BRIGHTER TOMORROW",
    badge: "HOT",
    bgGradient: "from-[#220d36] via-[#381048] to-[#180924]",
    borderColor: "border-[#9333ea]/40",
    glowColor: "shadow-[0_4px_24px_rgba(147,51,234,0.25)]",
    href: "/slots/jili",
    artType: "jili-skeleton",
    coverSrc: slotProviderCoverSrc("JILI.webp"),
  },
  {
    id: "pragmatic",
    name: "PRAGMATIC PLAY",
    slogan: "PLAY BEYOND LIMITS",
    bgGradient: "from-[#081838] via-[#0d2b5c] to-[#06142e]",
    borderColor: "border-[#2563eb]/40",
    glowColor: "shadow-[0_4px_24px_rgba(37,99,235,0.25)]",
    href: "/slots/pragmatic",
    artType: "pragmatic-zeus",
    coverSrc: slotProviderCoverSrc("pragmaticplay.webp"),
  },
];

export { GRID_SLOT_PROVIDERS } from "./slotProviderCoverData";

