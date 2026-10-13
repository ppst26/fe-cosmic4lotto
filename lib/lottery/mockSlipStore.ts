import type {
  LotterySlipListQuery,
  LotterySlipListResponse,
  LotterySubmittedSlip,
} from "@/app/types/lotterySlip";
import { buildDemoSlips } from "./mockSlipSeed";
import { settleSlipIfDue } from "./mockSettlement";
import {
  applySlipFilters,
  distinctMarkets,
  isWithinHistoryRetention,
  paginateSlips,
  sortSlips,
  summarizeSlips,
} from "./slipFilters";

/** โพย + เจ้าของ (ownerId ไม่ส่งกลับ client) */
interface StoredSlip {
  ownerId: string;
  slip: LotterySubmittedSlip;
}

type SlipStore = Map<string, StoredSlip>;

/** เก็บโพยสูงสุดต่อ instance — mock ในหน่วยความจำ (หายเมื่อ restart · backend จริงต้องใช้ DB) */
const MAX_STORED_SLIPS = 2_000;

const globalForSlips = globalThis as typeof globalThis & {
  __cosmicLotterySlips?: SlipStore;
  __cosmicLotterySlipsSeeded?: Set<string>;
};

function getStore(): SlipStore {
  if (!globalForSlips.__cosmicLotterySlips) {
    globalForSlips.__cosmicLotterySlips = new Map();
  }
  return globalForSlips.__cosmicLotterySlips;
}

/** บันทึกโพยหลังส่งสำเร็จ — ผูกกับผู้ใช้ที่ส่ง */
export function saveLotterySlip(ownerId: string, slip: LotterySubmittedSlip): void {
  const store = getStore();
  store.set(slip.id, { ownerId, slip });
  if (store.size > MAX_STORED_SLIPS) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
}

/** mock: ผู้ใช้ที่ยังไม่เคยมีโพยได้โพยตัวอย่างชุดเดียวต่อ process (ดู mockSlipSeed.ts) */
function ensureSeeded(ownerId: string, now: Date): void {
  const seeded = (globalForSlips.__cosmicLotterySlipsSeeded ??= new Set());
  if (seeded.has(ownerId)) return;
  seeded.add(ownerId);
  const store = getStore();
  const hasAny = [...store.values()].some((stored) => stored.ownerId === ownerId);
  if (hasAny) return;
  for (const slip of buildDemoSlips(now)) store.set(slip.id, { ownerId, slip });
}

/** สรุปผลโพยที่ถึงเวลา + ลบโพยสรุปผลที่เกินช่วงเก็บประวัติ (retention ฝั่ง server) */
function refresh(now: Date): void {
  const store = getStore();
  for (const [id, stored] of store) {
    const slip = settleSlipIfDue(stored.slip, now);
    if (!isWithinHistoryRetention(slip, now)) {
      store.delete(id);
    } else if (slip !== stored.slip) {
      store.set(id, { ownerId: stored.ownerId, slip });
    }
  }
}

/** อ่านโพยตาม id — เฉพาะเจ้าของ (คนอื่นได้ null เหมือนไม่มีโพยนี้) */
export function getLotterySlipById(ownerId: string, id: string, now = new Date()): LotterySubmittedSlip | null {
  ensureSeeded(ownerId, now);
  refresh(now);
  const stored = getStore().get(id);
  return stored && stored.ownerId === ownerId ? stored.slip : null;
}

/**
 * รายการโพยตาม scope (pending / history) + ตัวกรอง + แบ่งหน้า cursor + สรุป
 * history: บังคับไม่เกิน 30 วันย้อนหลังเสมอ ไม่ว่า client ส่ง from อะไรมา
 */
export function queryLotterySlips(
  ownerId: string,
  query: LotterySlipListQuery,
  now = new Date(),
): LotterySlipListResponse {
  ensureSeeded(ownerId, now);
  refresh(now);

  const owned = [...getStore().values()]
    .filter((stored) => stored.ownerId === ownerId)
    .map((stored) => stored.slip);

  const markets = distinctMarkets(applySlipFilters(owned, { scope: query.scope }, now));
  const filtered = sortSlips(applySlipFilters(owned, query, now), query.scope);
  const { page, nextCursor } = paginateSlips(filtered, query.cursor, query.limit);

  return { slips: page, nextCursor, summary: summarizeSlips(filtered, query.scope, markets) };
}
