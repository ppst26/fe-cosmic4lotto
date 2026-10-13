/* ── จาก app/data/cashbackMockData.ts ── */

import type { MessageKey } from "@/lib/i18n/messages";

/** key ใน namespace cashback — แปลตอน render ด้วย useT("cashback") */
export type CashbackMessageKey = MessageKey<"cashback">;

export type CashbackTabId = "play" | "loss";

export interface CashbackPanelMock {
  titleKey: CashbackMessageKey;
  subtitleKey: CashbackMessageKey;
  claimableThb: number;
  statusHintKey: CashbackMessageKey;
  ratePercent: number;
  minThb: number;
  maxPerClaimThb: number;
  cycleLabelKey: CashbackMessageKey;
  canClaim: boolean;
  claimButtonLabelKey: CashbackMessageKey;
}

/* ── จาก app/data/lossRebateMockData.ts ── */

export interface LossRebateSummaryMock {
  rebateReadyThb: number;
  exampleRatePercent: number;
  calculationPeriodLabel: string;
  statusLabelKey: CashbackMessageKey;
  eligibleNetLossThb: number;
  rebateRatePercent: number;
  rebateBonusThb: number;
  isReadyToClaim: boolean;
}

export interface LossRebateMonthOption {
  id: string;
  label: string;
}

export interface LossRebateHistoryRow {
  id: string;
  monthId: string;
  periodLabel: string;
  netLossThb: number;
  bonusThb: number;
  receivedAt: string;
}
