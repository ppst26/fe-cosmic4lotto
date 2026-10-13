/** ช่องทางฝากเงิน — step 1 ของ flow ฝาก (mock) */

import type { DepositMethodOption, DepositBankAccountMock } from "@/app/types/wallet";

export const DEPOSIT_METHOD_OPTIONS: DepositMethodOption[] = [
  {
    id: "bank",
    titleKey: "deposit.methods.bank.title",
    subtitleKey: "deposit.methods.bank.subtitle",
  },
  {
    id: "gateway",
    titleKey: "deposit.methods.gateway.title",
    subtitleKey: "deposit.methods.gateway.subtitle",
  },
  {
    id: "truemoney",
    titleKey: "deposit.methods.truemoney.title",
    subtitleKey: "deposit.methods.truemoney.subtitle",
  },
];

export const DEPOSIT_BANK_ACCOUNT_MOCK: DepositBankAccountMock = {
  bankName: "ธนาคารกสิกรไทย",
  accountNumberDisplay: "XXX-X-XXXXX-X",
  accountNumberCopy: "1234567890",
  accountName: "บริษัท ตัวอย่าง จำกัด",
  sampleBadgeLabel: "บัญชีตัวอย่าง",
};

export const DEPOSIT_QUICK_AMOUNTS: number[] = [100, 300, 500, 1000, 3000, 5000];

export const DEPOSIT_DEFAULT_AMOUNT = 500;

