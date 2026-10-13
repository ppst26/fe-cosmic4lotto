import type { LotterySlipListQuery } from "@/app/types/lotterySlip";

/** ช่วงเวลาที่เลือกในแท็บประวัติ — custom ใช้ from/to (YYYY-MM-DD ตามเวลาเครื่องผู้ใช้) */
export type SlipRangeId = "today" | "7d" | "30d" | "custom";

export const SLIP_RANGE_IDS: readonly SlipRangeId[] = ["today", "7d", "30d", "custom"];

/** แปลง "YYYY-MM-DD" เป็น Date (เที่ยงคืนตามเวลาเครื่อง) — ไม่ถูกต้อง → null */
export function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const valid = date.getFullYear() === Number(y) && date.getMonth() === Number(m) - 1 && date.getDate() === Number(d);
  return valid ? date : null;
}

export function formatDateOnly(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** token ที่ใช้เป็น cache key — custom ใส่วันที่ด้วย · ไม่ใช้เวลาจริงเพื่อให้ key คงที่ */
export function slipRangeToken(range: SlipRangeId, from: string, to: string): string {
  return range === "custom" ? `custom:${from}~${to}` : range;
}

/**
 * ช่วงเวลา → from/to (ISO) สำหรับ query ประวัติ
 * 30d = ไม่ส่ง from/to (server ใช้ขอบเขตเก็บข้อมูล 30 วันเอง) · today/7d อิงเวลาเครื่อง ณ ตอนโหลด
 * custom ที่ข้อมูลไม่ครบ/ไม่ถูกต้อง → เท่ากับ 30d
 */
export function resolveSlipRange(
  range: SlipRangeId,
  from: string,
  to: string,
  now: Date,
): Pick<LotterySlipListQuery, "from" | "to"> {
  if (range === "today") return { from: startOfDay(now).toISOString(), to: now.toISOString() };
  if (range === "7d") return { from: new Date(now.getTime() - 7 * DAY_MS).toISOString(), to: now.toISOString() };
  if (range === "custom") {
    const start = parseDateOnly(from);
    const end = parseDateOnly(to);
    if (!start || !end) return {};
    const [a, b] = start.getTime() <= end.getTime() ? [start, end] : [end, start];
    return {
      from: a.toISOString(),
      // สิ้นวันของวันสุดท้าย (ไม่เกินตอนนี้ — server clamp ซ้ำอีกชั้น)
      to: new Date(b.getFullYear(), b.getMonth(), b.getDate(), 23, 59, 59, 999).toISOString(),
    };
  }
  return {};
}
