"use client";

import {
  fetchLotteryCatalog,
  fetchLotteryHub,
  fetchLotteryPlayRounds,
  fetchThaiLottoBoard,
  fetchYikiBoard,
} from "@/lib/api/lotteryContent";
import { useApi, usePrefetchApi, type PrefetchTarget } from "@/app/hooks/useApi";
import { LOTTERY_CATALOG_ENTRIES } from "@/app/data/lotteryCatalogMockData";

/** เนื้อหาหวย (สาธารณะ) — แคตตาล็อก · hub · รอบเปิดรับ · กระดานแทง */
export const useLotteryCatalog = () => useApi(["lottery-catalog"], fetchLotteryCatalog);
export const useLotteryHub = () => useApi(["lottery-hub"], fetchLotteryHub);
/** รอบของตลาด — อิงเวลาปัจจุบัน ดึงฝั่ง client เท่านั้น (ไม่มี SSR snapshot คนละเวลา) */
export const useLotteryPlayRounds = (slug: string) =>
  useApi(["lottery-rounds", slug], () => fetchLotteryPlayRounds(slug));

/** รอบของทุกตลาดใน sidebar + กระดานแทงยี่กี (step 3) — key/load ต้องตรงกับ useLotteryPlayRounds / useYikiBoard */
const LOTTERY_ROUNDS_TARGETS: readonly PrefetchTarget[] = [
  ...LOTTERY_CATALOG_ENTRIES.map((entry) => ({
    key: ["lottery-rounds", entry.slug],
    load: () => fetchLotteryPlayRounds(entry.slug),
  })),
  { key: ["yiki-board"], load: fetchYikiBoard },
];

/** อุ่น cache รอบของตลาดอื่น + กระดานแทงตอนว่าง — กดเปลี่ยนตลาด / กดรอบแล้วเห็นเนื้อหาทันที ไม่ขึ้นสถานะโหลด */
export const usePrefetchLotteryRounds = () => usePrefetchApi(LOTTERY_ROUNDS_TARGETS);

export const useYikiBoard = () => useApi(["yiki-board"], fetchYikiBoard);
export const useThaiLottoBoard = () => useApi(["thai-lotto-board"], fetchThaiLottoBoard);
