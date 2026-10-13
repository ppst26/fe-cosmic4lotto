"use client";

import { useMemo } from "react";
import type { LotterySlipListQuery, LotterySlipListResponse } from "@/app/types/lotterySlip";
import { fetchLotterySlipPage } from "@/lib/lottery/fetchLotterySlip";
import { useApi, usePrefetchApi, type ApiResource, type PrefetchTarget } from "@/app/hooks/useApi";

/** ตัวกรองที่ใช้เป็น key — ช่วงเวลาเป็น token (today / 7d / 30d / custom) ไม่ใช่เวลาจริง เพื่อให้ cache คงที่ */
export interface LotterySlipFilterKey {
  scope: LotterySlipListQuery["scope"];
  market: string;
  result: string;
  /** token ช่วงเวลา — ใช้เฉพาะ history */
  range: string;
}

const FIRST_PAGE_SIZE = 20;

function cacheKey(filter: LotterySlipFilterKey): readonly unknown[] {
  return filter.scope === "pending"
    ? ["lottery-slips", "pending", filter.market]
    : ["lottery-slips", "history", filter.market, filter.result, filter.range];
}

/**
 * หน้าแรกของรายการโพย (ต้อง login) — query สร้างตอนเรียก (ช่วงเวลาอิงเวลาปัจจุบัน) · หน้าถัดไปโหลดแยกด้วย fetchLotterySlipPage
 * @param buildQuery สร้าง query เต็ม (from/to จาก token) — เรียกตอนโหลดจริงเท่านั้น
 */
export function useLotterySlipFirstPage(
  filter: LotterySlipFilterKey,
  buildQuery: () => LotterySlipListQuery,
): ApiResource<LotterySlipListResponse> {
  return useApi(cacheKey(filter), () => fetchLotterySlipPage({ ...buildQuery(), limit: FIRST_PAGE_SIZE }), { auth: true });
}

/** อุ่นแท็บฝั่งตรงข้าม (ตัวกรองเริ่มต้น) — สลับ pending ↔ history แล้วขึ้นทันที */
export function usePrefetchLotterySlipTab(
  other: LotterySlipFilterKey,
  buildQuery: () => LotterySlipListQuery,
): void {
  const scope = other.scope;
  const market = other.market;
  const result = other.result;
  const range = other.range;
  const targets = useMemo<readonly PrefetchTarget[]>(
    () => [
      {
        key: cacheKey({ scope, market, result, range }),
        load: () => fetchLotterySlipPage({ ...buildQuery(), limit: FIRST_PAGE_SIZE }),
        auth: true,
      },
    ],
    // buildQuery ผูกกับ filter ที่ส่งเข้ามาแล้ว — ใช้ key เป็นตัวกำหนดการสร้างใหม่
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scope, market, result, range],
  );
  usePrefetchApi(targets);
}
