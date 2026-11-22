import { COOKIE_NAME, parseSessionToken } from "./session";

export interface ProxySessionInput {
  /** NEXT_PUBLIC_API_BASE_URL — ว่าง = โหมด mock (auth ใน app/api) */
  apiBaseUrl: string;
  /** AUTH_SESSION_COOKIE — ชื่อ cookie session ของ backend จริง (ตั้งเมื่อ cookie มองเห็นได้ที่ origin ของเว็บ) */
  sessionCookieName?: string;
  getCookie: (name: string) => string | undefined;
}

/**
 * proxy.ts ถือว่า "มี session" หรือไม่ — ใช้กันหน้า member เป็นด่านแรกเท่านั้น (backend ต้องตรวจสิทธิ์เองเสมอ)
 *
 * - โหมด mock: ตรวจลายเซ็น HMAC ของ cookie cm_session
 * - backend จริง + ตั้ง AUTH_SESSION_COOKIE: ตรวจแค่ว่ามี cookie ชื่อนั้น (ไม่ตรวจเนื้อ token — backend เป็นคนตัดสิน)
 * - backend จริง + ไม่ตั้ง: ไม่กันที่ proxy (cookie ของ API คนละโดเมนอ่านจากเว็บไม่ได้) → ปล่อยผ่าน
 *   หน้า member จัดการผู้ใช้ที่ยังไม่ login เองด้วย ResourceGate/LoginPrompt และ backend ตอบ 401
 */
export function hasProxySession({ apiBaseUrl, sessionCookieName, getCookie }: ProxySessionInput): boolean {
  if (!apiBaseUrl) return Boolean(parseSessionToken(getCookie(COOKIE_NAME)));
  const name = sessionCookieName?.trim();
  if (!name) return true;
  return Boolean(getCookie(name)?.trim());
}
