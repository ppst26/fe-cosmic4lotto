import type {
  LotterySlipListQuery,
  LotterySlipListSummary,
  LotterySlipScope,
  LotterySubmittedSlip,
} from "@/app/types/lotterySlip";

/** ประวัติโพยเก็บย้อนหลังกี่วัน — นับจากเวลาสรุปผล (settledAt) */
export const SLIP_HISTORY_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

/** เวลาเริ่มต้นของช่วงที่เก็บประวัติ — เก่ากว่านี้ไม่แสดง/ถูกลบ */
export function slipHistoryCutoff(now: Date): Date {
  return new Date(now.getTime() - SLIP_HISTORY_DAYS * DAY_MS);
}

/** สรุปผลแล้วหรือยัง (won / lost / void) */
export function isSettledSlip(slip: LotterySubmittedSlip): boolean {
  return slip.status !== "submitted";
}

/** โพยสรุปผลแล้วที่ยังอยู่ในช่วงเก็บประวัติ — pending ไม่ถูกตัดตามวัน */
export function isWithinHistoryRetention(slip: LotterySubmittedSlip, now: Date): boolean {
  if (!isSettledSlip(slip)) return true;
  const settledAt = slip.settledAt ? new Date(slip.settledAt).getTime() : NaN;
  if (Number.isNaN(settledAt)) return false;
  return settledAt >= slipHistoryCutoff(now).getTime();
}

/** บีบช่วงวันที่ของประวัติให้ไม่เกินช่วงเก็บข้อมูล — from เก่ากว่า cutoff ถูกดึงขึ้นมา · to อนาคตถูกดึงลงเป็นตอนนี้ */
export function clampHistoryRange(
  range: { from?: string | null; to?: string | null },
  now: Date,
): { from: Date; to: Date } {
  const cutoff = slipHistoryCutoff(now);
  const parse = (value: string | null | undefined) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const rawFrom = parse(range.from);
  const rawTo = parse(range.to);
  const from = rawFrom && rawFrom.getTime() > cutoff.getTime() ? rawFrom : cutoff;
  const to = rawTo && rawTo.getTime() < now.getTime() ? rawTo : now;
  return from.getTime() <= to.getTime() ? { from, to } : { from: to, to: from };
}

/** pending: ยังไม่ถึงเวลาออกผล (waitingDraw) หรือเลยแล้วแต่ยังไม่สรุป (waitingSettle) */
export type SlipPendingState = "waitingDraw" | "waitingSettle";

export function slipPendingState(slip: LotterySubmittedSlip, now: Date): SlipPendingState {
  return new Date(slip.drawAt).getTime() > now.getTime() ? "waitingDraw" : "waitingSettle";
}

/** กรองตาม query — ตลาด · ผล · ช่วงเวลา (history) · ไม่เรียง ไม่แบ่งหน้า */
export function applySlipFilters(
  slips: readonly LotterySubmittedSlip[],
  query: Pick<LotterySlipListQuery, "scope" | "market" | "result" | "from" | "to">,
  now: Date,
): LotterySubmittedSlip[] {
  const range = query.scope === "history" ? clampHistoryRange(query, now) : null;
  return slips.filter((slip) => {
    if (query.market && slip.market !== query.market) return false;
    if (query.scope === "pending") return slip.status === "submitted";
    if (slip.status === "submitted") return false;
    if (query.result && slip.status !== query.result) return false;
    const settledAt = slip.settledAt ? new Date(slip.settledAt).getTime() : NaN;
    if (Number.isNaN(settledAt) || !range) return false;
    return settledAt >= range.from.getTime() && settledAt <= range.to.getTime();
  });
}

/** pending: ออกผลใกล้สุดก่อน · history: สรุปผลล่าสุดก่อน */
export function sortSlips(slips: readonly LotterySubmittedSlip[], scope: LotterySlipScope): LotterySubmittedSlip[] {
  const time = (iso: string | null) => (iso ? new Date(iso).getTime() : 0);
  return [...slips].sort((a, b) =>
    scope === "pending" ? time(a.drawAt) - time(b.drawAt) : time(b.settledAt) - time(a.settledAt),
  );
}

/** สรุปจำนวน · เดิมพันรวม · ได้/เสียสุทธิ (void = คืนเงิน นับ 0) */
export function summarizeSlips(
  slips: readonly LotterySubmittedSlip[],
  scope: LotterySlipScope,
  markets: string[] = [],
): LotterySlipListSummary {
  return {
    count: slips.length,
    totalStake: slips.reduce((sum, slip) => sum + slip.totalStake, 0),
    totalWinLoss: scope === "history" ? slips.reduce((sum, slip) => sum + (slip.winLoss ?? 0), 0) : null,
    markets,
  };
}

/** ตลาดที่ปรากฏ (ลำดับตามที่เจอก่อน) */
export function distinctMarkets(slips: readonly LotterySubmittedSlip[]): string[] {
  return [...new Set(slips.map((slip) => slip.market))];
}

export const DEFAULT_SLIP_PAGE_SIZE = 20;
export const MAX_SLIP_PAGE_SIZE = 50;

/** แบ่งหน้าแบบ cursor (mock = offset ที่ซ่อนไว้ · client ถือเป็นค่าทึบ) */
export function paginateSlips(
  slips: readonly LotterySubmittedSlip[],
  cursor: string | null | undefined,
  limit: number | null | undefined,
): { page: LotterySubmittedSlip[]; nextCursor: string | null } {
  const size = Math.min(MAX_SLIP_PAGE_SIZE, Math.max(1, Math.floor(limit ?? DEFAULT_SLIP_PAGE_SIZE)));
  const parsed = cursor ? Number.parseInt(cursor, 10) : 0;
  const offset = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const page = slips.slice(offset, offset + size);
  const next = offset + size;
  return { page, nextCursor: next < slips.length ? String(next) : null };
}
