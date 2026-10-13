/** ข้อมูล mock ถอนเงิน — step 1 */

import type { WithdrawUserBankMock } from "@/app/types/wallet";

export const WITHDRAW_USER_BANK_MOCK: WithdrawUserBankMock = {
  bankShortName: "กสิกรไทย",
  accountNumberDisplay: "XXX-X-XXXXX-X",
  holderLabel: "ผู้ใช้ ตัวอย่าง",
};

export const WITHDRAW_AVAILABLE_BALANCE = 12450;

export const WITHDRAW_DEFAULT_AMOUNT = 500;

export const WITHDRAW_QUICK_AMOUNTS: number[] = [100, 300, 500, 1000, 5000];

