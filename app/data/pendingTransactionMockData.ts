/** ข้อมูล mock dialog รายการรอดำเนินการ (ฝาก/ถอน) */

import { WITHDRAW_USER_BANK_MOCK } from "@/app/data/withdrawMockData";
import { formatDepositTransferAmount } from "@/lib/format";
import type { PendingTransactionPayload } from "@/app/types/transaction";

/** เวลา mock (Bangkok) — format ตาม locale ตอน render */
const PENDING_TRANSACTION_AT_DEPOSIT = "2026-09-15T14:30:00+07:00";
const PENDING_TRANSACTION_AT_WITHDRAW = "2026-09-15T14:35:00+07:00";

export function buildPendingDepositPayload(amount: number): PendingTransactionPayload {
  return {
    kind: "deposit",
    amount,
    titleKey: "pending.deposit.title",
    subtitleKey: "pending.deposit.subtitle",
    amountDisplay: formatDepositTransferAmount(amount),
    referenceId: "DEP-DEMO-001",
    referenceCopyValue: "DEP-DEMO-001",
    transactionAt: PENDING_TRANSACTION_AT_DEPOSIT,
    rows: [
      { labelKey: "pending.rows.channel", valueKey: "deposit.methods.bank.title" },
      { labelKey: "pending.rows.reference", value: "DEP-DEMO-001" },
      { labelKey: "pending.rows.transactionAt", dateTime: PENDING_TRANSACTION_AT_DEPOSIT },
    ],
    historyHref: "/transactions",
  };
}

export function buildPendingWithdrawPayload(amount: number): PendingTransactionPayload {
  const accountLabel = `${WITHDRAW_USER_BANK_MOCK.bankShortName} ••••7890`;
  return {
    kind: "withdraw",
    amount,
    titleKey: "pending.withdraw.title",
    subtitleKey: "pending.withdraw.subtitle",
    amountDisplay: formatDepositTransferAmount(amount),
    referenceId: "WTH-DEMO-001",
    referenceCopyValue: "WTH-DEMO-001",
    transactionAt: PENDING_TRANSACTION_AT_WITHDRAW,
    rows: [
      { labelKey: "pending.rows.receivingAccount", value: accountLabel },
      { labelKey: "pending.rows.reference", value: "WTH-DEMO-001" },
      { labelKey: "pending.rows.transactionAt", dateTime: PENDING_TRANSACTION_AT_WITHDRAW },
    ],
    historyHref: "/transactions?kind=withdraw",
  };
}
