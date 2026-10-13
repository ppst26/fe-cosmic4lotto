import type { MenuDialogAction, MenuDialogTile, MenuDialogSection } from "@/app/types/menu";

/** จำนวนตั๋ว mock — การ์ดบนเมนูเต็มจอ (MenuDrawerWalletCards) */
export const MENU_DIALOG_TICKET_COUNT_MOCK = 2;

/** เมนูที่ต้องล็อกอินก่อนเข้า */
export function menuTileRequiresAuth(tile: MenuDialogTile): boolean {
  return tile.requiresAuth === true;
}

/** action เมนูที่ต้องล็อกอิน (sidebar desktop · mobile drawer) */
export const MENU_DIALOG_ACTION_REQUIRES_AUTH: Record<MenuDialogAction, boolean> = {
  "vip-rank": true,
  coupon: true,
  language: false,
};

export function menuActionRequiresAuth(action: MenuDialogAction): boolean {
  return MENU_DIALOG_ACTION_REQUIRES_AUTH[action] === true;
}

/**
 * path จาก href เมนู — ใช้เช็ค requiresAuth (วงล้อ / ตั๋ว ที่ไม่ใช่ hub modal)
 */
export function menuHrefRequiresAuth(href: string): boolean {
  const path = href.split("?")[0]?.split("#")[0] ?? href;
  const normalized =
    path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
  const tile = MENU_DIALOG_ALL_TILES.find((t) => {
    if (!t.href) return false;
    const tilePath = t.href.split("?")[0]?.split("#")[0] ?? t.href;
    const tileNorm =
      tilePath.endsWith("/") && tilePath.length > 1
        ? tilePath.slice(0, -1)
        : tilePath;
    return tileNorm === normalized;
  });
  return tile ? menuTileRequiresAuth(tile) : false;
}

/**
 * กลุ่มเมนู dialog — เลเบลด้านบนแต่ละกลุ่ม · grid 3 / 2 (row) / 4
 * ใช้โดย app/components/layout/RightMenuDrawer.tsx
 */
export const MENU_DIALOG_SECTIONS: MenuDialogSection[] = [
  {
    id: "personal",
    sectionLabelKey: "menuSections.personal",
    columns: 3,
    layout: "vertical",
    items: [
      { id: "profile", labelKey: "menu.profile", href: "/profile/account", iconId: "profile", requiresAuth: true },
      { id: "transactions", labelKey: "menu.transactions", href: "/transactions", iconId: "transactions", requiresAuth: true },
      { id: "rank", labelKey: "menu.rank", action: "vip-rank", iconId: "rank", requiresAuth: true },
    ],
  },
  {
    id: "privileges",
    sectionLabelKey: "menuSections.privileges",
    columns: 4,
    layout: "horizontal",
    items: [
      { id: "promotions", labelKey: "menu.promotions", href: "/promotions", iconId: "promotions" },
      { id: "cashback", labelKey: "menu.cashback", href: "/cashback", iconId: "cashback", requiresAuth: true },
      { id: "check-in", labelKey: "menu.checkIn", href: "/missions/check-in", iconId: "check-in", requiresAuth: true },
      { id: "referral", labelKey: "menu.referral", href: "/referral", iconId: "referral", requiresAuth: true },
    ],
  },
  {
    id: "rewards",
    sectionLabelKey: "menuSections.rewards",
    columns: 4,
    layout: "horizontal",
    items: [
      {
        id: "reward-hub",
        labelKey: "menu.rewardHub",
        href: "/reward",
        iconId: "reward-hub",
        requiresAuth: true,
      },
      { id: "wheel", labelKey: "menu.wheel", href: "/wheel", iconId: "wheel", requiresAuth: true },
      { id: "gems-shop", labelKey: "menu.gemsShop", href: "/gems-store", iconId: "gems", requiresAuth: true },
      { id: "activities", labelKey: "menu.activities", href: "/event", iconId: "activities" },
      { id: "coupon", labelKey: "menu.coupon", action: "coupon", iconId: "coupon", requiresAuth: true },
    ],
  },
];

/** รายการเมนูรวมทุกกลุ่ม — desktop hub / legacy */
export const MENU_DIALOG_ALL_TILES: MenuDialogTile[] = MENU_DIALOG_SECTIONS.flatMap(
  (section) => section.items,
);

/**
 * เมนูมือถือเต็มจอ — แถวรายการ (RightMenuDrawer mobile)
 */
export const MENU_DIALOG_MOBILE_LIST_ITEMS: MenuDialogTile[] = [
  { id: "rank", labelKey: "menu.vipRank", action: "vip-rank", iconId: "rank", requiresAuth: true },
  {
    id: "referral-earnings",
    labelKey: "menu.referralEarnings",
    href: "/referral",
    iconId: "referral",
    requiresAuth: true,
  },
  { id: "referral", labelKey: "menu.referFriend", href: "/referral", iconId: "referral", requiresAuth: true },
  { id: "coupon", labelKey: "menu.coupon", action: "coupon", iconId: "coupon", requiresAuth: true },
  {
    id: "reward-hub",
    labelKey: "menu.specialBonus",
    href: "/reward",
    iconId: "reward-hub",
    requiresAuth: true,
  },
];

/** เมนูมือถือ — กริด 3 คอลัมน์ใต้รายการหลัก */
export const MENU_DIALOG_MOBILE_GRID_ITEMS: MenuDialogTile[] = [
  { id: "promotions", labelKey: "menu.promotions", href: "/promotions", iconId: "promotions" },
  { id: "activities", labelKey: "menu.activities", href: "/event", iconId: "activities" },
  { id: "transactions", labelKey: "menu.history", href: "/transactions", iconId: "transactions", requiresAuth: true },
  { id: "profile", labelKey: "menu.profile", href: "/profile/account", iconId: "profile", requiresAuth: true },
  { id: "cashback", labelKey: "menu.cashback", href: "/cashback", iconId: "cashback", requiresAuth: true },
  { id: "check-in", labelKey: "menu.checkIn", href: "/missions/check-in", iconId: "check-in", requiresAuth: true },
  { id: "gems-shop", labelKey: "menu.gemsShop", href: "/gems-store", iconId: "gems", requiresAuth: true },
  { id: "wheel", labelKey: "menu.wheel", href: "/wheel", iconId: "wheel", requiresAuth: true },
  /** ไอคอนเป็นธงภาษาปัจจุบัน (RightMenuDrawer) · ไม่ต้องล็อกอิน */
  { id: "language", labelKey: "menu.language", action: "language", iconId: "language" },
];
