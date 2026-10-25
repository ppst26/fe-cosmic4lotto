import type { CategoryId } from "@/app/types/lobby";

const MENU_ICON_BASE = "/assets/3d/menuicon";
/** ชุดไอคอนใหม่ — public/menu-icon/*.webp (ใช้แทนชุดเดิมในรายการที่มีครบ) */
const NEW_ICON_BASE = "/menu-icon";

/**
 * ไอคอน 3D เมนู — แหล่งเดียวสำหรับ CategoryNav · MenuDrawer · sidebar desktop
 * ไฟล์อยู่ที่ public/menu-icon/ (ชุดใหม่) · รายการที่ยังไม่มีในชุดใหม่ใช้ public/assets/3d/menuicon/
 */
export const MENU_ICON_SRC: Record<string, string> = {
  home: `${NEW_ICON_BASE}/home.webp`,
  casino: `${NEW_ICON_BASE}/casino.webp`,
  slots: `${NEW_ICON_BASE}/slot.webp`,
  fishing: `${NEW_ICON_BASE}/fish.webp`,
  sports: `${NEW_ICON_BASE}/sport.webp`,
  lottery: `${NEW_ICON_BASE}/lotto.webp`,
  games: `${MENU_ICON_BASE}/games.avif`,
  cards: `${NEW_ICON_BASE}/card.webp`,
  profile: `${NEW_ICON_BASE}/profile.webp`,
  transactions: `${NEW_ICON_BASE}/history.webp`,
  rank: `${NEW_ICON_BASE}/vip.webp`,
  promotions: `${NEW_ICON_BASE}/promotion.webp`,
  activities: `${NEW_ICON_BASE}/event.webp`,
  cashback: `${NEW_ICON_BASE}/cashback.webp`,
  "check-in": `${NEW_ICON_BASE}/checkin.webp`,
  wheel: `${NEW_ICON_BASE}/wheel.webp`,
  gems: `${NEW_ICON_BASE}/diamond.webp`,
  referral: `${NEW_ICON_BASE}/refferal.webp`,
  coupon: `${NEW_ICON_BASE}/coupon.webp`,
  ticket: `${MENU_ICON_BASE}/ticket.avif`,
  "reward-hub": `${NEW_ICON_BASE}/event.webp`,
  "lucky-box": "/assets/3d/card-1-mobile.avif",
  "random-card": `${NEW_ICON_BASE}/card.webp`,
  "exchange-money": "/assets/check-in/diamon3.avif",
  freespins: `${NEW_ICON_BASE}/slot.webp`,
};

/** หมวดเกม lobby — map CategoryId → asset */
export const CATEGORY_MENU_ICON_SRC: Record<CategoryId, string> = {
  home: MENU_ICON_SRC.home,
  casino: MENU_ICON_SRC.casino,
  slots: MENU_ICON_SRC.slots,
  fishing: MENU_ICON_SRC.fishing,
  sports: MENU_ICON_SRC.sports,
  lottery: MENU_ICON_SRC.lottery,
  cards: MENU_ICON_SRC.cards,
};

export function getMenuIconSrc(iconId: string): string | undefined {
  return MENU_ICON_SRC[iconId];
}

export function getCategoryMenuIconSrc(categoryId: CategoryId): string {
  return CATEGORY_MENU_ICON_SRC[categoryId];
}
