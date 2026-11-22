import type { MyPromotionItem, MyPromotionStatus, PromotionDetailId } from "@/app/types/promotions";
import { loadPromotionDetail } from "@/lib/promotions/promotionCatalog";

type ProgressTemplate = {
  deposit: { current: number; target: number };
  turnover: { current: number; target: number };
  expiresInDays: number;
};

/** ค่าเริ่มต้นต่อโปร — mock back office กำหนดเป้าหมายยอดฝาก/เทิร์น */
const PROGRESS_BY_PROMO: Partial<Record<PromotionDetailId, ProgressTemplate>> = {
  welcome: {
    deposit: { current: 100, target: 100 },
    turnover: { current: 5250, target: 15000 },
    expiresInDays: 30,
  },
  "promo-cashback": {
    deposit: { current: 0, target: 300 },
    turnover: { current: 1200, target: 8000 },
    expiresInDays: 14,
  },
  "promo-refer-friends": {
    deposit: { current: 50, target: 100 },
    turnover: { current: 0, target: 5000 },
    expiresInDays: 45,
  },
  "promo-vip": {
    deposit: { current: 500, target: 1000 },
    turnover: { current: 8000, target: 20000 },
    expiresInDays: 60,
  },
  "promo-check-in": {
    deposit: { current: 100, target: 100 },
    turnover: { current: 3000, target: 3000 },
    expiresInDays: 7,
  },
  "promo-wheel": {
    deposit: { current: 0, target: 200 },
    turnover: { current: 500, target: 10000 },
    expiresInDays: 21,
  },
};

const DEFAULT_TEMPLATE: ProgressTemplate = {
  deposit: { current: 0, target: 100 },
  turnover: { current: 0, target: 5000 },
  expiresInDays: 30,
};

const store = new Map<string, Map<string, MyPromotionItem>>();

function userStore(userId: string): Map<string, MyPromotionItem> {
  let map = store.get(userId);
  if (!map) {
    map = new Map();
    store.set(userId, map);
  }
  return map;
}

function addDaysIso(from: Date, days: number): string {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function resolveStatus(deposit: number, depositTarget: number, turnover: number, turnoverTarget: number, expiresAt: string): MyPromotionStatus {
  if (new Date(expiresAt).getTime() < Date.now()) return "expired";
  if (deposit >= depositTarget && turnover >= turnoverTarget) return "completed";
  return "active";
}

function buildItem(
  promotionId: PromotionDetailId,
  title: string,
  claimedAt: string,
  template: ProgressTemplate,
): MyPromotionItem {
  const expiresAt = addDaysIso(new Date(claimedAt), template.expiresInDays);
  const deposit = template.deposit;
  const turnover = template.turnover;
  return {
    id: `mine-${promotionId}`,
    promotionId,
    title,
    status: resolveStatus(deposit.current, deposit.target, turnover.current, turnover.target, expiresAt),
    claimedAt,
    expiresAt,
    deposit: { current: deposit.current, target: deposit.target },
    turnover: { current: turnover.current, target: turnover.target },
  };
}

/** ตัวอย่างโปรต้อนรับ — แสดงครั้งแรกเมื่อยังไม่มีรายการ */
async function seedWelcomeIfEmpty(userId: string): Promise<void> {
  const map = userStore(userId);
  if (map.size > 0) return;

  const detail = await loadPromotionDetail("welcome");
  const title = detail?.bannerTitle?.replace(/\p{Extended_Pictographic}/gu, "").trim() || "สิทธิพิเศษ ต้อนรับคุณ";
  const claimedAt = new Date().toISOString();
  const template = PROGRESS_BY_PROMO.welcome ?? DEFAULT_TEMPLATE;
  map.set("welcome", buildItem("welcome", title, claimedAt, template));
}

/**
 * รายการโปรของสมาชิก — mock ต่อ user
 * ใช้ใน GET /api/promotions/mine
 */
export async function listMyPromotions(userId: string): Promise<MyPromotionItem[]> {
  await seedWelcomeIfEmpty(userId);
  const items = Array.from(userStore(userId).values());
  items.sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime());
  return items.map((item) => ({
    ...item,
    status: resolveStatus(
      item.deposit.current,
      item.deposit.target,
      item.turnover.current,
      item.turnover.target,
      item.expiresAt,
    ),
  }));
}

/**
 * อัปเดตรายการหลังรับโปร — เรียกจาก POST /api/promotions/[id]/claim
 */
export async function syncMyPromotionAfterClaim(
  userId: string,
  promotionId: PromotionDetailId,
  claimedAt: string,
): Promise<void> {
  const map = userStore(userId);
  if (map.has(promotionId)) return;

  const detail = await loadPromotionDetail(promotionId);
  const title =
    detail?.bannerTitle?.replace(/\p{Extended_Pictographic}/gu, "").trim() || promotionId;
  const template = PROGRESS_BY_PROMO[promotionId] ?? DEFAULT_TEMPLATE;
  map.set(promotionId, buildItem(promotionId, title, claimedAt, template));
}
