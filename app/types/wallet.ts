import type { MessageKey } from "@/lib/i18n/messages";

/* ── จาก app/data/depositMockData.ts ── */

export type DepositMethodId = "bank" | "gateway" | "truemoney";

export interface DepositMethodOption {
  id: DepositMethodId;
  /** แปลตอน render: useT("wallet")(titleKey) */
  titleKey: MessageKey<"wallet">;
  subtitleKey: MessageKey<"wallet">;
}

/** บัญชีรับโอน mock — step 2 ฝากธนาคาร */
export interface DepositBankAccountMock {
  bankName: string;
  accountNumberDisplay: string;
  accountNumberCopy: string;
  accountName: string;
  sampleBadgeLabel: string;
}

/* ── จาก app/data/withdrawMockData.ts ── */

export interface WithdrawUserBankMock {
  bankShortName: string;
  accountNumberDisplay: string;
  holderLabel: string;
}
