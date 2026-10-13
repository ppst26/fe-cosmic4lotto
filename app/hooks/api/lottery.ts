"use client";

import {
  fetchLotteryCatalog,
  fetchLotteryHub,
  fetchLotteryPlayRounds,
  fetchThaiLottoBoard,
  fetchYikiBoard,
} from "@/lib/api/lotteryContent";
import { useApi } from "@/app/hooks/useApi";

/** เนื้อหาหวย (สาธารณะ) — แคตตาล็อก · hub · รอบเปิดรับ · กระดานแทง */
export const useLotteryCatalog = () => useApi(["lottery-catalog"], fetchLotteryCatalog);
export const useLotteryHub = () => useApi(["lottery-hub"], fetchLotteryHub);
/** รอบของตลาด — อิงเวลาปัจจุบัน ดึงฝั่ง client เท่านั้น (ไม่มี SSR snapshot คนละเวลา) */
export const useLotteryPlayRounds = (slug: string) =>
  useApi(["lottery-rounds", slug], () => fetchLotteryPlayRounds(slug));
export const useYikiBoard = () => useApi(["yiki-board"], fetchYikiBoard);
export const useThaiLottoBoard = () => useApi(["thai-lotto-board"], fetchThaiLottoBoard);
