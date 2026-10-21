/**
 * บัญชีเดโมสำหรับทดสอบ login — ใช้ใน lib/auth/demoUser.ts
 * production: ตั้ง AUTH_ENABLE_DEMO_USER=1 และ AUTH_DEMO_LOGIN_PHONE / AUTH_DEMO_LOGIN_PASSWORD
 * (ไม่ใส่ NEXT_PUBLIC — รหัสผ่านอยู่ฝั่ง server เท่านั้น)
 */
export const DEMO_LOGIN_PHONE = "0999999999";
export const DEMO_LOGIN_PASSWORD = "demo1234";

/** เบอร์เดโมที่ใช้ตรวจ login ฝั่ง server (override ได้ด้วย AUTH_DEMO_LOGIN_PHONE) */
export function resolveDemoLoginPhone(): string {
  const raw = process.env.AUTH_DEMO_LOGIN_PHONE?.trim();
  if (!raw) return DEMO_LOGIN_PHONE;
  return raw.replace(/\D/g, "");
}

/** รหัสผ่านเดโมฝั่ง server (override ได้ด้วย AUTH_DEMO_LOGIN_PASSWORD) */
export function resolveDemoLoginPassword(): string {
  const fromEnv = process.env.AUTH_DEMO_LOGIN_PASSWORD;
  if (typeof fromEnv === "string" && fromEnv.length > 0) return fromEnv;
  return DEMO_LOGIN_PASSWORD;
}
