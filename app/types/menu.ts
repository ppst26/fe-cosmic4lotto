/* ── จาก app/data/menuMockData.ts ── */

import type { MessageKey } from "@/lib/i18n/messages";

export type MenuDialogAction = "vip-rank" | "coupon" | "language";

export interface MenuDialogTile {
  id: string;
  /** key ใน dictionary nav — render ด้วย useT("nav")(labelKey) */
  labelKey: MessageKey<"nav">;
  href?: string;
  action?: MenuDialogAction;
  iconId: string;
  /** ต้องล็อกอินก่อน — เปิด login sheet (RightMenuDrawer) */
  requiresAuth?: boolean;
  /** ยังไม่เปิดใช้ — แสดง Coming soon · ไม่นำทาง */
  comingSoon?: boolean;
}

export interface MenuDialogSection {
  id: string;
  sectionLabelKey: MessageKey<"nav">;
  columns: 2 | 3 | 4;
  layout?: "vertical" | "horizontal";
  items: MenuDialogTile[];
}
