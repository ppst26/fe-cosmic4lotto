import { ENDPOINTS } from "./endpoints";
import { apiFetch, type ApiResult } from "./http";
import { isMockMode } from "./mock";

const VALID_CODES = new Set(["COSMIC100", "FREEGEMS", "WELCOME50"]);

const SUCCESS_MESSAGE = "แลกเครดิตฟรีสำเร็จ — ยอดจะเข้ากระเป๋าในไม่กี่นาที (mock)";
const ERROR_MESSAGE = "รหัสคูปองไม่ถูกต้องหรือหมดอายุแล้ว";

export type CouponResult = { ok: true; message: string } | { ok: false; error: string };

/** ข้อความสำเร็จเมื่อ backend ไม่ส่ง message มา */
const DEFAULT_REAL_SUCCESS_MESSAGE = "แลกเครดิตฟรีสำเร็จ";

/** แปลงผล apiFetch ของแลกคูปองเป็น CouponResult — สำเร็จใช้ message จาก server ถ้ามี */
export function toCouponResult(res: ApiResult<{ message?: unknown } | null>): CouponResult {
  if (!res.ok) return { ok: false, error: res.error.message };
  const message = typeof res.data?.message === "string" ? res.data.message.trim() : "";
  return { ok: true, message: message || DEFAULT_REAL_SUCCESS_MESSAGE };
}

/**
 * แลกคูปอง — POST /api/coupons/redeem { code } → 200 { message? } · 4xx { error }
 * โหมด mock (ไม่ตั้ง NEXT_PUBLIC_API_BASE_URL): หน่วง 600ms แล้วคืนข้อความชุดเดิม
 */
export async function submitCoupon(code: string): Promise<CouponResult> {
  if (!isMockMode()) {
    return toCouponResult(
      await apiFetch<{ message?: unknown } | null>(ENDPOINTS.submitCoupon.path, { method: "POST", body: { code } }),
    );
  }
  return new Promise<CouponResult>((resolve) => {
    setTimeout(() => {
      if (VALID_CODES.has(code)) {
        resolve({ ok: true, message: SUCCESS_MESSAGE });
        return;
      }
      resolve({ ok: false, error: ERROR_MESSAGE });
    }, 600);
  });
}
