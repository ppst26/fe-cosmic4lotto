import {
  WITHDRAW_AVAILABLE_BALANCE,
  WITHDRAW_DEFAULT_AMOUNT,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_USER_BANK_MOCK,
} from "@/app/data/withdrawMockData";
import type { WithdrawUserBankMock } from "@/app/types/wallet";
import { toMoneySubmitResult, type MoneySubmitResult, type QuickAmounts } from "./deposit";
import { ENDPOINTS } from "./endpoints";
import { apiFetch, type ApiResult } from "./http";
import { isMockMode, mockResult } from "./mock";

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
 * ยืนยันถอน — POST /api/withdraw { amount }
 * โหมด mock (ไม่ตั้ง NEXT_PUBLIC_API_BASE_URL): หน่วง 500ms แล้วสำเร็จเสมอ
 */
export async function submitWithdraw(input: { amount: number }): Promise<MoneySubmitResult> {
  if (isMockMode()) {
    return new Promise<MoneySubmitResult>((resolve) => {
      setTimeout(() => resolve({ ok: true }), 500);
    });
  }
  return toMoneySubmitResult(
    await apiFetch<unknown>(ENDPOINTS.submitWithdraw.path, { method: "POST", body: { amount: input.amount } }),
  );
}
