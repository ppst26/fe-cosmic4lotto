import { CASHBACK_LOSS_PANEL_MOCK, CASHBACK_PLAY_PANEL_MOCK, CASHBACK_TABS } from "@/app/data/cashbackMockData";
import {
  LOSS_REBATE_HISTORY_MOCK,
  LOSS_REBATE_MONTH_OPTIONS,
  LOSS_REBATE_SUMMARY_MOCK,
  LOSS_REBATE_TERMS,
} from "@/app/data/lossRebateMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

function cashbackPanelsMock() {
  return { tabs: CASHBACK_TABS, play: CASHBACK_PLAY_PANEL_MOCK, loss: CASHBACK_LOSS_PANEL_MOCK };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/cashback (ตอนนี้อนุมานจาก mock) */
export type CashbackPanelsData = ReturnType<typeof cashbackPanelsMock>;

/**
 * ต่อ backend: return apiFetch<CashbackPanelsData>("/api/cashback")
 */
export function fetchCashbackPanels(): Promise<ApiResult<CashbackPanelsData>> {
  return mockResult(cashbackPanelsMock());
}

function lossRebateMock() {
  return {
    summary: LOSS_REBATE_SUMMARY_MOCK,
    months: LOSS_REBATE_MONTH_OPTIONS,
    terms: LOSS_REBATE_TERMS,
    history: LOSS_REBATE_HISTORY_MOCK,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/cashback/loss-rebate (ตอนนี้อนุมานจาก mock) */
export type LossRebateData = ReturnType<typeof lossRebateMock>;

/**
 * ต่อ backend: return apiFetch<LossRebateData>("/api/cashback/loss-rebate")
 */
export function fetchLossRebate(): Promise<ApiResult<LossRebateData>> {
  return mockResult(lossRebateMock());
}
