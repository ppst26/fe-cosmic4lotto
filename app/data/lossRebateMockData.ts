/** ข้อมูล mock ส่วนคืนยอดเสียใน /cashback (ตาราง + สูตร + เงื่อนไข) */

import type {
  LossRebateSummaryMock,
  LossRebateMonthOption,
  LossRebateHistoryRow,
  CashbackMessageKey,
} from "@/app/types/cashback";

export const LOSS_REBATE_SUMMARY_MOCK: LossRebateSummaryMock = {
  rebateReadyThb: 640,
  exampleRatePercent: 8,
  calculationPeriodLabel: "14 ก.ย. 2569",
  statusLabelKey: "lossRebate.statusCalculated",
  eligibleNetLossThb: 8000,
  rebateRatePercent: 8,
  rebateBonusThb: 640,
  isReadyToClaim: true,
};

export const LOSS_REBATE_MONTH_OPTIONS: LossRebateMonthOption[] = [
  { id: "2026-09", label: "กันยายน 2569" },
  { id: "2026-08", label: "สิงหาคม 2569" },
];

export const LOSS_REBATE_TERMS: CashbackMessageKey[] = [
  "lossRebate.terms.basis",
  "lossRebate.terms.claimWindow",
  "lossRebate.terms.subjectToChange",
  "lossRebate.terms.sampleData",
];

function buildLossRebateHistoryMock(): LossRebateHistoryRow[] {
  const septemberRows: Omit<LossRebateHistoryRow, "id" | "monthId">[] = [
    { periodLabel: "1–7 ก.ย. 2569", netLossThb: 5200, bonusThb: 416, receivedAt: "2026-09-08T10:15:00+07:00" },
    { periodLabel: "8–14 ก.ย. 2569", netLossThb: 8000, bonusThb: 640, receivedAt: "2026-09-15T09:30:00+07:00" },
    { periodLabel: "15–21 ก.ย. 2569", netLossThb: 6100, bonusThb: 488, receivedAt: "2026-09-22T11:05:00+07:00" },
    { periodLabel: "22–28 ก.ย. 2569", netLossThb: 4500, bonusThb: 360, receivedAt: "2026-09-29T16:20:00+07:00" },
    { periodLabel: "29 ก.ย. – 5 ต.ค. 2569", netLossThb: 3900, bonusThb: 312, receivedAt: "2026-10-06T08:45:00+07:00" },
    { periodLabel: "6–12 ต.ค. 2569", netLossThb: 7200, bonusThb: 576, receivedAt: "2026-10-13T14:10:00+07:00" },
    { periodLabel: "13–19 ต.ค. 2569", netLossThb: 2800, bonusThb: 224, receivedAt: "2026-10-20T12:00:00+07:00" },
  ];
  const augustRows: Omit<LossRebateHistoryRow, "id" | "monthId">[] = [
    { periodLabel: "1–7 ส.ค. 2569", netLossThb: 6600, bonusThb: 528, receivedAt: "2026-08-08T09:00:00+07:00" },
    { periodLabel: "8–14 ส.ค. 2569", netLossThb: 5400, bonusThb: 432, receivedAt: "2026-08-15T10:30:00+07:00" },
    { periodLabel: "15–21 ส.ค. 2569", netLossThb: 4100, bonusThb: 328, receivedAt: "2026-08-22T15:45:00+07:00" },
    { periodLabel: "22–28 ส.ค. 2569", netLossThb: 3700, bonusThb: 296, receivedAt: "2026-08-29T11:20:00+07:00" },
    { periodLabel: "29 ส.ค. – 4 ก.ย. 2569", netLossThb: 4900, bonusThb: 392, receivedAt: "2026-09-05T13:55:00+07:00" },
  ];

  const rows: LossRebateHistoryRow[] = [];
  septemberRows.forEach((row, index) => {
    rows.push({ id: `loss-sep-${index + 1}`, monthId: "2026-09", ...row });
  });
  augustRows.forEach((row, index) => {
    rows.push({ id: `loss-aug-${index + 1}`, monthId: "2026-08", ...row });
  });
  return rows;
}

export const LOSS_REBATE_HISTORY_MOCK: LossRebateHistoryRow[] = buildLossRebateHistoryMock();

