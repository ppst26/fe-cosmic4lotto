import type { TransactionKind } from "@/app/types/transaction";
import type { VipModalTabId } from "@/app/types/vip";
import type { CashbackTabId } from "@/app/types/cashback";
import type { MessageKey } from "@/lib/i18n/messages";

/** หมวด hub ที่เปิดเป็น modal บน desktop (lg+) */
export type DesktopHubId =
  | "promotions"
  | "activities"
  | "cashback"
  | "gems-store"
  | "account"
  | "referral"
  | "transactions"
  | "check-in"
  | "vip";

export interface OpenHubOptions {
  cashbackTab?: CashbackTabId;
  transactionKind?: TransactionKind;
  vipTab?: VipModalTabId;
}

/** หัวข้อ hub modal — key ใน dictionary nav (render ด้วย useT("nav")) */
export const HUB_MODAL_TITLE_KEYS: Record<DesktopHubId, MessageKey<"nav">> = {
  promotions: "hub.promotions",
  activities: "hub.activities",
  cashback: "hub.cashback",
  "gems-store": "hub.gemsStore",
  account: "hub.account",
  referral: "hub.referral",
  transactions: "hub.transactions",
  "check-in": "hub.checkIn",
  vip: "hub.vip",
};

/** ไอคอน 3D นำหน้าหัวข้อ hub modal บน desktop — อ้าง menuIconAssets */
export const HUB_MODAL_ICON_IDS: Record<DesktopHubId, string> = {
  promotions: "promotions",
  activities: "activities",
  cashback: "cashback",
  "gems-store": "gems",
  account: "profile",
  referral: "referral",
  transactions: "transactions",
  "check-in": "check-in",
  vip: "rank",
};

const PATH_TO_HUB: Record<string, DesktopHubId> = {
  "/promotions": "promotions",
  "/event": "activities",
  "/cashback": "cashback",
  "/gems-store": "gems-store",
  "/profile/account": "account",
  "/referral": "referral",
  "/transactions": "transactions",
  "/missions/check-in": "check-in",
  "/vip": "vip",
};

/**
 * แยก pathname จาก href (รองรับ query string)
 */
export function getHrefPathname(href: string): string {
  const path = href.split("?")[0]?.split("#")[0] ?? href;
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

/**
 * แมป href → hub id + ตัวเลือกเปิด (เช่น แท็บ cashback)
 */
export function parseHubFromHref(href: string): {
  id: DesktopHubId | null;
  options?: OpenHubOptions;
} {
  const pathname = getHrefPathname(href);

  if (pathname === "/loss-rebate") {
    return { id: "cashback", options: { cashbackTab: "loss" } };
  }

  const id = PATH_TO_HUB[pathname] ?? null;
  if (!id) return { id: null };

  const options: OpenHubOptions = {};
  const query = href.includes("?") ? href.split("?")[1]?.split("#")[0] : "";

  if (query) {
    const params = new URLSearchParams(query);
    if (id === "cashback") {
      const tab = params.get("tab");
      if (tab === "loss") options.cashbackTab = "loss";
    }
    if (id === "transactions") {
      const kind = params.get("kind");
      if (kind === "withdraw") options.transactionKind = "withdraw";
    }
    if (id === "vip") {
      const tab = params.get("tab") ?? params.get("vipTab");
      if (tab === "rank" || tab === "benefits" || tab === "my-level") {
        options.vipTab = tab;
      }
    }
  }

  return { id, options: Object.keys(options).length ? options : undefined };
}

export function hrefToHubId(href: string): DesktopHubId | null {
  return parseHubFromHref(href).id;
}

export function isDesktopHubId(value: string | null): value is DesktopHubId {
  return value !== null && value in HUB_MODAL_TITLE_KEYS;
}

/** hub ที่ต้องล็อกอินก่อนเปิด modal */
/** hub ที่ต้องล็อกอิน — สอดคล้องเมนูมือถือ (โปรโมชัน/กิจกรรม เปิดได้โดยไม่ล็อกอิน) */
export const HUB_REQUIRES_AUTH: ReadonlySet<DesktopHubId> = new Set([
  "cashback",
  "account",
  "transactions",
  "vip",
  "referral",
  "check-in",
  "gems-store",
]);

export function hubRequiresAuth(id: DesktopHubId): boolean {
  return HUB_REQUIRES_AUTH.has(id);
}

/** Hub ที่ใช้ responsive sheet แบบคูปอง/ฝาก-ถอน (ไม่ใช่ modal hub กลางจอแบบเดิม) */
export const RESPONSIVE_SHEET_HUB_IDS: ReadonlySet<DesktopHubId> = new Set([
  "promotions",
  "activities",
  "cashback",
  "gems-store",
  "referral",
  "check-in",
  "account",
  "transactions",
  "vip",
]);

export function isResponsiveSheetHub(id: DesktopHubId): boolean {
  return RESPONSIVE_SHEET_HUB_IDS.has(id);
}

/** ความกว้าง sheet บน desktop — wide สำหรับ master–detail · hubCompact สำหรับเช็คอิน */
export function getHubSheetSize(
  id: DesktopHubId,
): "compact" | "wide" | "hubCompact" | "hubNarrow" {
  if (id === "check-in" || id === "gems-store") {
    return "hubCompact";
  }
  if (id === "account") {
    return "hubNarrow";
  }
  if (
    id === "referral" ||
    id === "promotions" ||
    id === "activities" ||
    id === "transactions" ||
    id === "vip"
  ) {
    return "wide";
  }
  return "compact";
}
