import type { ReferralEarningHistoryRow, ReferralEarningPeriodId } from "@/app/types/referral";

/**
 * helper แนะนำเพื่อน — ย้ายมาจาก app/data/referralMockData.ts
 */

/**
 * ลิงก์ชวนเพื่อน — ใช้ origin ของหน้าปัจจุบัน · ตอน SSR ใช้ NEXT_PUBLIC_SITE_URL
 * ใช้ใน MenuDrawerMobileToolbar · ProfileReferralInviteCard · ReferralOverviewSections
 */
export function buildReferralLink(refCode: string): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  return `${origin}/?ref=${encodeURIComponent(refCode)}`;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * กรองประวัติรายได้ตามช่วงเวลา (ฝั่ง client) — today · week = 7 วันก่อนวันนี้ · month = วันที่ 8–30 ย้อนหลัง
 * เมื่อ backend รองรับ ให้ส่ง period เป็น query แทน
 */
export function filterReferralEarningHistoryByPeriod(
  rows: ReferralEarningHistoryRow[],
  period: ReferralEarningPeriodId,
  now: Date = new Date(),
): ReferralEarningHistoryRow[] {
  if (period === "all") return rows;

  const todayStart = startOfLocalDay(now).getTime();
  const msDay = 24 * 60 * 60 * 1000;

  return rows.filter((row) => {
    const at = new Date(row.occurredAt).getTime();
    if (period === "today") {
      return at >= todayStart;
    }
    if (period === "week") {
      const weekStart = todayStart - 7 * msDay;
      return at >= weekStart && at < todayStart;
    }
    const monthStart = todayStart - 30 * msDay;
    const monthEnd = todayStart - 7 * msDay;
    return at >= monthStart && at < monthEnd;
  });
}
