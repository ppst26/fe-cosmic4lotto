"use client";

import {
  fetchLotteryCatalog,
  fetchLotteryHub,
  fetchLotteryPlayRounds,
  fetchLotteryResults,
  fetchThaiLottoBoard,
  fetchYikiBoard,
} from "@/lib/api/lotteryContent";
import { useMemo } from "react";
import { useApi, usePrefetchApi, type PrefetchTarget } from "@/app/hooks/useApi";

/** เนื้อหาหวย (สาธารณะ) — แคตตาล็อก · hub · รอบเปิดรับ · กระดานแทง */
export const useLotteryCatalog = () => useApi(["lottery-catalog"], fetchLotteryCatalog);
export const useLotteryHub = () => useApi(["lottery-hub"], fetchLotteryHub);
/** รอบของตลาด — อิงเวลาปัจจุบัน ดึงฝั่ง client เท่านั้น (ไม่มี SSR snapshot คนละเวลา) */
export const useLotteryPlayRounds = (slug: string) =>
  useApi(["lottery-rounds", slug], () => fetchLotteryPlayRounds(slug));

/**
 * อุ่น cache รอบของทุกตลาดในแคตตาล็อก + กระดานแทงยี่กี (step 3) ตอนว่าง — กดเปลี่ยนตลาด / กดรอบแล้วเห็นเนื้อหาทันที
 * รายชื่อตลาดมาจาก useLotteryCatalog() (API) · key/load ต้องตรงกับ useLotteryPlayRounds / useYikiBoard
 */
export function usePrefetchLotteryRounds(): void {
  const catalog = useLotteryCatalog();
  const targets = useMemo<readonly PrefetchTarget[]>(
    () => [
      ...(catalog.data ?? []).map((entry) => ({
        key: ["lottery-rounds", entry.slug],
        load: () => fetchLotteryPlayRounds(entry.slug),
      })),
      { key: ["yiki-board"], load: fetchYikiBoard },
    ],
    [catalog.data],
  );
  usePrefetchApi(targets);
}

export const useYikiBoard = () => useApi(["yiki-board"], fetchYikiBoard);
export const useThaiLottoBoard = () => useApi(["thai-lotto-board"], fetchThaiLottoBoard);

/** ผลรางวัลของวันที่ระบุ (YYYY-MM-DD) — key ตามวันที่ จึงเลื่อนวันกลับมาใช้ cache เดิมได้ */
export const useLotteryResults = (date: string) => useApi(["lottery-results", date], () => fetchLotteryResults(date));
