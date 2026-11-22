import {
  DEPOSIT_BANK_ACCOUNT_MOCK,
  DEPOSIT_DEFAULT_AMOUNT,
  DEPOSIT_METHOD_OPTIONS,
  DEPOSIT_QUICK_AMOUNTS,
} from "@/app/data/depositMockData";
import type { DepositBankAccountMock, DepositMethodId, DepositMethodOption } from "@/app/types/wallet";
import { ENDPOINTS } from "./endpoints";
import { apiFetch, type ApiResult } from "./http";
import { isMockMode, mockResult } from "./mock";

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

/** แปลงผล apiFetch ของฝาก/ถอน เป็น MoneySubmitResult (error = ข้อความพร้อมแสดงผู้ใช้) */
export function toMoneySubmitResult(res: ApiResult<unknown>): MoneySubmitResult {
  return res.ok ? { ok: true } : { ok: false, error: res.error.message };
}

export interface SubmitDepositInput {
  amount: number;
  methodId: DepositMethodId;
  /** ไฟล์สลิปโอนเงิน (ถ้ามี) — ส่งเป็น multipart field "slip" */
  slip?: File | null;
}

/**
 * ยืนยันฝาก — POST /api/deposit (multipart: amount · methodId · slip)
 * โหมด mock (ไม่ตั้ง NEXT_PUBLIC_API_BASE_URL): หน่วง 500ms แล้วสำเร็จเสมอ
 */
export async function submitDeposit(input: SubmitDepositInput): Promise<MoneySubmitResult> {
  if (isMockMode()) {
    return new Promise<MoneySubmitResult>((resolve) => {
      setTimeout(() => resolve({ ok: true }), 500);
    });
  }
  const form = new FormData();
  form.set("amount", String(input.amount));
  form.set("methodId", input.methodId);
  if (input.slip) form.set("slip", input.slip);
  return toMoneySubmitResult(await apiFetch<unknown>(ENDPOINTS.submitDeposit.path, { method: "POST", body: form }));
}
