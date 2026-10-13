import type { StoredUser } from "@/app/types/auth";
import { DEMO_LOGIN_PHONE } from "./demoCredentials";

const DEMO_PHONE = DEMO_LOGIN_PHONE;

/**
 * เปิดบัญชีเดโมไหม — dev เปิดเสมอ · production ต้องตั้ง AUTH_ENABLE_DEMO_USER=1 เอง (ค่าเริ่มต้นปิด)
 */
export function isDemoUserEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.AUTH_ENABLE_DEMO_USER === "1";
}

/**
 * บัญชีเดโมที่มากับโค้ด (เบอร์ 0999999999) — ใช้ทดสอบตอน dev แม้ไม่มีไฟล์ .data/users.json
 * production ปิดไว้ (ดู isDemoUserEnabled) · ใช้จาก findUserByPhone / findUserById ใน lib/auth/userStore.ts
 */
export const DEMO_USER: StoredUser = {
  id: "demo-user-0999999999",
  phone: DEMO_PHONE,
  firstName: "Demo",
  lastName: "Player",
  bankAccountNumber: "1234567890",
  bankId: "scb",
  channelId: "facebook",
  /** hash ของ DEMO_LOGIN_PASSWORD (demo1234) — scrypt salt:hash */
  passwordHash:
    "35d232d831f80bda204063593b4214f0:0d4b3fd191c31dc420c6f701fa511bd8c1df974defb94c30438f4eb7d24e4b595573b50f41e950a3488bfc4bfb8cfc8c30b95a193153ae3457cd9dd5dc18b669",
  createdAt: "2026-10-01T00:00:00.000Z",
  avatarPresetId: "avatar-1",
};

/**
 * อัปเดต preset avatar บัญชีเดโม (in-memory — ใช้ตอน dev / ไม่มี .data)
 */
export function setDemoUserAvatarPreset(avatarPresetId: string): void {
  DEMO_USER.avatarPresetId = avatarPresetId;
}

/**
 * คืนบัญชีเดโมเมื่อเบอร์ตรงชุดที่ฝังไว้
 */
export function findDemoUserByPhone(phone: string): StoredUser | undefined {
  if (!isDemoUserEnabled()) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits !== DEMO_PHONE) return undefined;
  return DEMO_USER;
}

/**
 * คืนบัญชีเดโมเมื่อ session ชี้มาที่ id คงที่
 */
export function findDemoUserById(id: string): StoredUser | undefined {
  if (!isDemoUserEnabled() || id !== DEMO_USER.id) return undefined;
  return DEMO_USER;
}
