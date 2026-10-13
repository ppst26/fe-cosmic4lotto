import {
  VIP_BENEFIT_COMPARISON_ROWS,
  VIP_BENEFIT_COMPARISON_VALUES,
  VIP_PLAYER_MOCK,
  VIP_RANK_TIERS,
  VIP_RANK_VIDEO,
} from "@/app/data/vipMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

function vipPlayerMock() {
  return VIP_PLAYER_MOCK;
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/vip/player (ตอนนี้อนุมานจาก mock) */
export type VipPlayerData = ReturnType<typeof vipPlayerMock>;

/**
 * ต่อ backend: return apiFetch<VipPlayerData>("/api/vip/player")
 */
export function fetchVipPlayer(): Promise<ApiResult<VipPlayerData>> {
  return mockResult(vipPlayerMock());
}

function vipRanksMock() {
  return { tiers: VIP_RANK_TIERS, videos: VIP_RANK_VIDEO };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/vip/ranks (ตอนนี้อนุมานจาก mock) */
export type VipRanksData = ReturnType<typeof vipRanksMock>;

/**
 * ต่อ backend: return apiFetch<VipRanksData>("/api/vip/ranks")
 */
export function fetchVipRanks(): Promise<ApiResult<VipRanksData>> {
  return mockResult(vipRanksMock());
}

function vipBenefitsMock() {
  return { rows: VIP_BENEFIT_COMPARISON_ROWS, values: VIP_BENEFIT_COMPARISON_VALUES };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/vip/benefits (ตอนนี้อนุมานจาก mock) */
export type VipBenefitsData = ReturnType<typeof vipBenefitsMock>;

/**
 * ต่อ backend: return apiFetch<VipBenefitsData>("/api/vip/benefits")
 */
export function fetchVipBenefits(): Promise<ApiResult<VipBenefitsData>> {
  return mockResult(vipBenefitsMock());
}
