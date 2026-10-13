const VALID_CODES = new Set(["COSMIC100", "FREEGEMS", "WELCOME50"]);

const SUCCESS_MESSAGE = "แลกเครดิตฟรีสำเร็จ — ยอดจะเข้ากระเป๋าในไม่กี่นาที (mock)";
const ERROR_MESSAGE = "รหัสคูปองไม่ถูกต้องหรือหมดอายุแล้ว";

/** แลกคูปอง — หน่วง 600ms แล้วคืนข้อความชุดเดิม */
export function submitCoupon(code: string) {
  return new Promise<{ ok: true; message: string } | { ok: false; error: string }>((resolve) => {
    setTimeout(() => {
      if (VALID_CODES.has(code)) {
        resolve({ ok: true, message: SUCCESS_MESSAGE });
        return;
      }
      resolve({ ok: false, error: ERROR_MESSAGE });
    }, 600);
  });
}
