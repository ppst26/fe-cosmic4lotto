import { API_BASE_URL, type ApiResult } from "./http";

/**
 * โหมด mock = ยังไม่ตั้ง NEXT_PUBLIC_API_BASE_URL — ฟังก์ชันที่ยังไม่มี mock route ใน app/api
 * (ฝาก · ถอน · คูปอง) ใช้เช็กตัวนี้: โหมด mock คืนผลจำลอง · ตั้ง base URL แล้วยิง backend จริงทันที (ไม่ต้องแก้โค้ด)
 */
export function isMockMode(): boolean {
  return API_BASE_URL === "";
}

/**
 * ห่อ mock ให้มีรูปเดียวกับ apiFetch — ใช้ใน lib/api/* ระหว่างยังไม่มี backend
 * ต่อ backend: แทน `return mockResult(X)` ด้วย `return apiFetch<T>(ENDPOINTS.<name>.path, ...)`
 */
export function mockResult<T>(data: T): Promise<ApiResult<T>> {
  return Promise.resolve({ ok: true, status: 200, data });
}

/**
 * ผลของ "การกระทำ" (POST) ที่หน้า UI ใช้ — ok:false พร้อมข้อความพร้อมแสดงผู้ใช้
 * ต่อ backend: apiFetch POST แล้ว map ApiResult → ActionResult ด้วย toActionResult()
 */
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

/** แปลง ApiResult เป็น ActionResult (ใช้ตอนเปลี่ยน mockAction เป็น apiFetch) */
export function toActionResult<T>(res: ApiResult<T>): ActionResult<T> {
  return res.ok ? { ok: true, data: res.data } : { ok: false, error: res.error.message };
}

/** mock การกระทำ — หน่วงเวลาเล็กน้อยให้เห็นสถานะกำลังส่ง แล้วคืนผลสำเร็จ */
export function mockAction<T>(data: T, delayMs = 400): Promise<ActionResult<T>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, data }), delayMs);
  });
}
