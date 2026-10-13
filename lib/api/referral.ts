import {
  REFERRAL_COMMISSION_TIERS,
  REFERRAL_EARNING_HISTORY_MOCK,
  REFERRAL_EARNING_PERIOD_OPTIONS,
  REFERRAL_EARNING_SUMMARY_MOCK,
  REFERRAL_FEATURE_CHECKS,
  REFERRAL_MOCK_REF_CODE,
  REFERRAL_STATS_MOCK,
  REFERRAL_STEPS,
  REFERRAL_USERS_MOCK,
} from "@/app/data/referralMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

function referralOverviewMock() {
  return {
    refCode: REFERRAL_MOCK_REF_CODE,
    stats: REFERRAL_STATS_MOCK,
    tiers: REFERRAL_COMMISSION_TIERS,
    checks: REFERRAL_FEATURE_CHECKS,
    steps: REFERRAL_STEPS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/referral/overview (ตอนนี้อนุมานจาก mock) */
export type ReferralOverviewData = ReturnType<typeof referralOverviewMock>;

/**
 * ต่อ backend: return apiFetch<ReferralOverviewData>("/api/referral/overview")
 */
export function fetchReferralOverview(): Promise<ApiResult<ReferralOverviewData>> {
  return mockResult(referralOverviewMock());
}

function referralUsersMock() {
  return REFERRAL_USERS_MOCK;
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/referral/users (ตอนนี้อนุมานจาก mock) */
export type ReferralUsersData = ReturnType<typeof referralUsersMock>;

/**
 * ต่อ backend: return apiFetch<ReferralUsersData>("/api/referral/users")
 */
export function fetchReferralUsers(): Promise<ApiResult<ReferralUsersData>> {
  return mockResult(referralUsersMock());
}

function referralEarningsMock() {
  return {
    summary: REFERRAL_EARNING_SUMMARY_MOCK,
    history: REFERRAL_EARNING_HISTORY_MOCK,
    periods: REFERRAL_EARNING_PERIOD_OPTIONS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/referral/earnings (ตอนนี้อนุมานจาก mock) */
export type ReferralEarningsData = ReturnType<typeof referralEarningsMock>;

/**
 * ต่อ backend: return apiFetch<ReferralEarningsData>("/api/referral/earnings")
 */
export function fetchReferralEarnings(): Promise<ApiResult<ReferralEarningsData>> {
  return mockResult(referralEarningsMock());
}
