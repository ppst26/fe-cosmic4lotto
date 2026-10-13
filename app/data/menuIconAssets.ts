import type { CategoryId } from "@/app/types/lobby";

const MENU_ICON_BASE = "/assets/3d/menuicon";

/**
 * ไอคอน 3D เมนู — แหล่งเดียวสำหรับ CategoryNav · MenuDrawer · sidebar desktop
 * ไฟล์อยู่ที่ public/assets/3d/menuicon/
 */
export const MENU_ICON_SRC: Record<string, string> = {
  home: `${MENU_ICON_BASE}/home.avif`,
  casino: `${MENU_ICON_BASE}/casino.avif`,
  slots: `${MENU_ICON_BASE}/slot.avif`,
  fishing: `${MENU_ICON_BASE}/fish.avif`,
  sports: `${MENU_ICON_BASE}/sport.avif`,
  lottery: `${MENU_ICON_BASE}/lotto.avif`,
  games: `${MENU_ICON_BASE}/games.avif`,
  cards: `${MENU_ICON_BASE}/card.avif`,
  profile: `${MENU_ICON_BASE}/profile.avif`,
  transactions: `${MENU_ICON_BASE}/transactions.avif`,
  rank: `${MENU_ICON_BASE}/rank.avif`,
  promotions: `${MENU_ICON_BASE}/promotion.avif`,
  activities: `${MENU_ICON_BASE}/event.avif`,
  cashback: `${MENU_ICON_BASE}/cashback.avif`,
  "check-in": `${MENU_ICON_BASE}/checkin.avif`,
  wheel: `${MENU_ICON_BASE}/wheel.avif`,
  gems: `${MENU_ICON_BASE}/diamond.avif`,
  referral: `${MENU_ICON_BASE}/referral.avif`,
  coupon: `${MENU_ICON_BASE}/coupon.avif`,
  ticket: `${MENU_ICON_BASE}/ticket.avif`,
  "reward-hub": `${MENU_ICON_BASE}/event.avif`,
  "lucky-box": "/assets/3d/card-1-mobile.avif",
  "random-card": `${MENU_ICON_BASE}/card.avif`,
  "exchange-money": "/assets/check-in/diamon3.avif",
  freespins: `${MENU_ICON_BASE}/slot.avif`,
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
