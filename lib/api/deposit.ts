import {
  DEPOSIT_BANK_ACCOUNT_MOCK,
  DEPOSIT_DEFAULT_AMOUNT,
  DEPOSIT_METHOD_OPTIONS,
  DEPOSIT_QUICK_AMOUNTS,
} from "@/app/data/depositMockData";
import type { DepositBankAccountMock, DepositMethodId, DepositMethodOption } from "@/app/types/wallet";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

/** ยอดด่วน + ยอดเริ่มต้นของแผงฝาก/ถอน — สัญญา GET .../quick-amounts */
export interface QuickAmounts {
  amounts: number[];
  defaultAmount: number;
}

/** ช่องทางฝาก — GET /api/deposit/methods */
export function fetchDepositMethods(): Promise<ApiResult<DepositMethodOption[]>> {
  return mockResult(DEPOSIT_METHOD_OPTIONS);
}

/** บัญชีรับโอน — GET /api/deposit/bank-account */
export function fetchDepositBankAccount(): Promise<ApiResult<DepositBankAccountMock>> {
  return mockResult(DEPOSIT_BANK_ACCOUNT_MOCK);
}

/** ยอดด่วนและยอดเริ่มต้นของแผงฝาก — GET /api/deposit/quick-amounts */
export function fetchDepositQuickAmounts(): Promise<ApiResult<QuickAmounts>> {
  return mockResult({ amounts: [...DEPOSIT_QUICK_AMOUNTS], defaultAmount: DEPOSIT_DEFAULT_AMOUNT });
}

/** ผลส่งรายการฝาก/ถอน — ok:false พร้อมข้อความพร้อมแสดงผู้ใช้ */
export type MoneySubmitResult = { ok: true } | { ok: false; error: string };

/**
 * ยืนยันฝาก — mock หน่วง 500ms แล้วสำเร็จเสมอ · ชื่อสลิปยังไม่เข้าฟังก์ชันนี้
 * ต่อ backend: apiFetch POST /api/deposit (FormData พร้อมไฟล์สลิป) แล้ว map เป็น MoneySubmitResult
 */
export function submitDeposit(_input: { amount: number; methodId: DepositMethodId }) {
  return new Promise<MoneySubmitResult>((resolve) => {
    setTimeout(() => resolve({ ok: true }), 500);
  });
}
