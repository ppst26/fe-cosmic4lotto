import {
  WITHDRAW_AVAILABLE_BALANCE,
  WITHDRAW_DEFAULT_AMOUNT,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_USER_BANK_MOCK,
} from "@/app/data/withdrawMockData";
import type { WithdrawUserBankMock } from "@/app/types/wallet";
import type { MoneySubmitResult, QuickAmounts } from "./deposit";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

/** บัญชีรับเงินถอนของผู้ใช้ — GET /api/withdraw/account */
export function fetchWithdrawAccount(): Promise<ApiResult<WithdrawUserBankMock>> {
  return mockResult(WITHDRAW_USER_BANK_MOCK);
}

/** ยอดที่ถอนได้ (บาท) — GET /api/withdraw/balance */
export function fetchWithdrawBalance(): Promise<ApiResult<number>> {
  return mockResult(WITHDRAW_AVAILABLE_BALANCE);
}

/** ยอดด่วนและยอดเริ่มต้นของแผงถอน — GET /api/withdraw/quick-amounts */
export function fetchWithdrawQuickAmounts(): Promise<ApiResult<QuickAmounts>> {
  return mockResult({ amounts: [...WITHDRAW_QUICK_AMOUNTS], defaultAmount: WITHDRAW_DEFAULT_AMOUNT });
}

/**
 * ยืนยันถอน — mock หน่วง 500ms แล้วสำเร็จเสมอ
 * ต่อ backend: apiFetch POST /api/withdraw แล้ว map เป็น MoneySubmitResult
 */
export function submitWithdraw(_input: { amount: number }) {
  return new Promise<MoneySubmitResult>((resolve) => {
    setTimeout(() => resolve({ ok: true }), 500);
  });
}
