import { LOTTERY_CATALOG_ENTRIES } from "@/app/data/lotteryCatalogMockData";
import {
  LOTTERY_FEATURED_ITEMS,
  LOTTERY_GRID_ITEMS,
  LOTTERY_LATEST_RESULTS,
} from "@/app/data/lotteryHubMockData";
import { LOTTERY_MARKETS } from "@/app/data/lotteryMarketsMockData";
import { getLotteryPlayRounds } from "@/app/data/lotteryRoundsMockData";
import { THAI_LOTTO_BET_TYPES, THAI_LOTTO_GROUPS, THAI_LOTTO_LAST_RESULT } from "@/app/data/thaiLottoMockData";
import { YIKI_BET_TYPES, YIKI_GROUPS, YIKI_SETTLEMENT_TYPES } from "@/app/data/yikiMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

function lotteryCatalogMock() {
  return LOTTERY_CATALOG_ENTRIES;
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/lottery/catalog (ตอนนี้อนุมานจาก mock) */
export type LotteryCatalogData = ReturnType<typeof lotteryCatalogMock>;

/**
 * อ่านแคตตาล็อกหวยจาก mock — จุดเดียวก่อนเปลี่ยนเป็น API
 * ต่อ backend: return apiFetch<LotteryCatalogData>("/api/lottery/catalog")
 */
export function fetchLotteryCatalog(): Promise<ApiResult<LotteryCatalogData>> {
  return mockResult(lotteryCatalogMock());
}

function lotteryHubMock() {
  return {
    featured: LOTTERY_FEATURED_ITEMS,
    grid: LOTTERY_GRID_ITEMS,
    latest: LOTTERY_LATEST_RESULTS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/lottery/hub (ตอนนี้อนุมานจาก mock) */
export type LotteryHubData = ReturnType<typeof lotteryHubMock>;

/**
 * ข้อมูลหน้า hub หวย (featured / grid / ผลล่าสุด)
 * ต่อ backend: return apiFetch<LotteryHubData>("/api/lottery/hub")
 */
export function fetchLotteryHub(): Promise<ApiResult<LotteryHubData>> {
  return mockResult(lotteryHubMock());
}

function lotteryMarketsMock() {
  return LOTTERY_MARKETS;
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/lottery/markets (ตอนนี้อนุมานจาก mock) */
export type LotteryMarketsData = ReturnType<typeof lotteryMarketsMock>;

/**
 * รายการตลาดหวยทั้งหมด
 * ต่อ backend: return apiFetch<LotteryMarketsData>("/api/lottery/markets")
 */
export function fetchLotteryMarkets(): Promise<ApiResult<LotteryMarketsData>> {
  return mockResult(lotteryMarketsMock());
}

function lotteryPlayRoundsMock(slug: string, from?: Date) {
  return getLotteryPlayRounds(slug, from);
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/lottery/markets/:slug/rounds (ตอนนี้อนุมานจาก mock) */
export type LotteryPlayRoundsData = ReturnType<typeof lotteryPlayRoundsMock>;

/**
 * รายการรอบเล่นตาม slug — ส่งต่อ getLotteryPlayRounds
 * ต่อ backend: return apiFetch<LotteryPlayRoundsData>("/api/lottery/markets/:slug/rounds")
 */
export function fetchLotteryPlayRounds(slug: string, from?: Date): Promise<ApiResult<LotteryPlayRoundsData>> {
  return mockResult(lotteryPlayRoundsMock(slug, from));
}

function yikiBoardMock() {
  return { groups: YIKI_GROUPS, betTypes: YIKI_BET_TYPES, settlement: YIKI_SETTLEMENT_TYPES };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/lottery/yiki/board (ตอนนี้อนุมานจาก mock) */
export type YikiBoardData = ReturnType<typeof yikiBoardMock>;

/**
 * กระดานยี่กี
 * ต่อ backend: return apiFetch<YikiBoardData>("/api/lottery/yiki/board")
 */
export function fetchYikiBoard(): Promise<ApiResult<YikiBoardData>> {
  return mockResult(yikiBoardMock());
}

function thaiLottoBoardMock() {
  return {
    groups: THAI_LOTTO_GROUPS,
    betTypes: THAI_LOTTO_BET_TYPES,
    lastResult: THAI_LOTTO_LAST_RESULT,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/lottery/thai/board (ตอนนี้อนุมานจาก mock) */
export type ThaiLottoBoardData = ReturnType<typeof thaiLottoBoardMock>;

/**
 * กระดานหวยรัฐบาลไทย
 * ต่อ backend: return apiFetch<ThaiLottoBoardData>("/api/lottery/thai/board")
 */
export function fetchThaiLottoBoard(): Promise<ApiResult<ThaiLottoBoardData>> {
  return mockResult(thaiLottoBoardMock());
}
