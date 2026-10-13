import { PROFILE_HUB_STATS_MOCK } from "@/app/data/profileHubMockData";
import { MENU_DIALOG_TICKET_COUNT_MOCK } from "@/app/data/menuMockData";
import { SIGNUP_BANKS, SIGNUP_CHANNELS } from "@/app/data/signupMockData";
import { MOCK_MAIN_WALLET_BALANCE } from "@/app/data/walletMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

/** ยอดเครดิตหลัก — สัญญา GET /api/wallet/balance */
export interface WalletBalance {
  amount: number;
}

function profileHubStatsMock() {
  return PROFILE_HUB_STATS_MOCK;
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/profile/hub-stats (ตอนนี้อนุมานจาก mock) */
export type ProfileHubStatsData = ReturnType<typeof profileHubStatsMock>;

/**
 * ต่อ backend: return apiFetch<ProfileHubStatsData>("/api/profile/hub-stats")
 */
export function fetchProfileHubStats(): Promise<ApiResult<ProfileHubStatsData>> {
  return mockResult(profileHubStatsMock());
}

/**
 * ยอดเครดิตหลัก — อ่านผ่าน useWallet() (app/hooks/api/account.ts) เท่านั้น
 * ต่อ backend: return apiFetch<WalletBalance>("/api/wallet/balance")
 */
export function fetchWalletBalance(): Promise<ApiResult<WalletBalance>> {
  return mockResult({ amount: MOCK_MAIN_WALLET_BALANCE });
}

function signUpOptionsMock() {
  return { banks: SIGNUP_BANKS, channels: SIGNUP_CHANNELS };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/auth/sign-up-options (ตอนนี้อนุมานจาก mock) */
export type SignUpOptionsData = ReturnType<typeof signUpOptionsMock>;

/**
 * ต่อ backend: return apiFetch<SignUpOptionsData>("/api/auth/sign-up-options")
 */
export function fetchSignUpOptions(): Promise<ApiResult<SignUpOptionsData>> {
  return mockResult(signUpOptionsMock());
}

function menuTicketCountMock() {
  return MENU_DIALOG_TICKET_COUNT_MOCK;
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/menu/ticket-count (ตอนนี้อนุมานจาก mock) */
export type MenuTicketCountData = ReturnType<typeof menuTicketCountMock>;

/**
 * ต่อ backend: return apiFetch<MenuTicketCountData>("/api/menu/ticket-count")
 */
export function fetchMenuTicketCount(): Promise<ApiResult<MenuTicketCountData>> {
  return mockResult(menuTicketCountMock());
}
