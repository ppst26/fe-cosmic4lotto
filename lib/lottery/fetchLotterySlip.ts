import type { LotterySlipListQuery, LotterySlipListResponse, LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { apiFetch, type ApiResult } from "@/lib/api/http";

/** ดึงโพยที่ส่งแล้ว — null เมื่อไม่พบหรือโหลดไม่ได้ (หน้า /lottery/slips/[slipId]) */
export async function fetchLotterySlip(slipId: string): Promise<LotterySubmittedSlip | null> {
  const res = await apiFetch<LotterySubmittedSlip>(
    `/api/lottery/slips/${encodeURIComponent(slipId)}`,
  );
  return res.ok ? res.data : null;
}

/**
 * รายการโพยหนึ่งหน้า (หน้า /lottery/slips) — scope pending/history + ตัวกรอง + cursor
 * ต่อ backend: GET /api/lottery/slips พร้อม query เดียวกัน (ดู docs/superpowers/specs/2026-10-10-lottery-slips-design.md §5)
 */
export function fetchLotterySlipPage(query: LotterySlipListQuery): Promise<ApiResult<LotterySlipListResponse>> {
  return apiFetch<LotterySlipListResponse>("/api/lottery/slips", {
    query: {
      scope: query.scope,
      market: query.market,
      result: query.result,
      from: query.from,
      to: query.to,
      cursor: query.cursor,
      limit: query.limit,
    },
  });
}
