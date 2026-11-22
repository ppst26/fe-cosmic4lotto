import { CASHBACK_LOSS_PANEL_MOCK, CASHBACK_PLAY_PANEL_MOCK, CASHBACK_TABS } from "@/app/data/cashbackMockData";
import {
  LOSS_REBATE_HISTORY_MOCK,
  LOSS_REBATE_MONTH_OPTIONS,
  LOSS_REBATE_SUMMARY_MOCK,
  LOSS_REBATE_TERMS,
} from "@/app/data/lossRebateMockData";
import type { CashbackPanelMock } from "@/app/types/cashback";
import type { ApiResult } from "./http";
import { mockAction, mockResult, type ActionResult } from "./mock";

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

export type CashbackClaimKind = "play" | "loss";

export interface CashbackClaimData {
  claimedThb: number;
  /** panel หลังรับแล้ว — UI แทนที่ state ด้วยค่านี้ */
  panel: CashbackPanelMock;
}

/**
 * รับคืนยอด — POST /api/cashback/claim { kind }
 * mock: รีเซ็ตยอดที่รับได้เป็น 0 เหมือนพฤติกรรมเดิมในหน้า
 * ต่อ backend: apiFetch<CashbackClaimData>(ENDPOINTS.claimCashback.path, { method: "POST", body }) แล้ว toActionResult
 */
export function claimCashback(input: { kind: CashbackClaimKind }): Promise<ActionResult<CashbackClaimData>> {
  const base = input.kind === "play" ? CASHBACK_PLAY_PANEL_MOCK : CASHBACK_LOSS_PANEL_MOCK;
  return mockAction({
    claimedThb: base.claimableThb,
    panel: {
      ...base,
      claimableThb: 0,
      canClaim: false,
      statusHintKey: "panel.claimed" as const,
      claimButtonLabelKey: "panel.claimed" as const,
    },
  });
}
