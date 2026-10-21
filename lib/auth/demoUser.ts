import type { StoredUser } from "@/app/types/auth";
import { resolveDemoLoginPassword, resolveDemoLoginPhone } from "./demoCredentials";
import { hashPassword } from "./password";

/**
 * เปิดบัญชีเดโมไหม — dev เปิดเสมอ · production ต้องตั้ง AUTH_ENABLE_DEMO_USER=1 เอง (ค่าเริ่มต้นปิด)
 */
export function isDemoUserEnabled(): boolean {
  const flag = process.env.AUTH_ENABLE_DEMO_USER?.trim();
  return (
    process.env.NODE_ENV !== "production" ||
    flag === "1" ||
    flag?.toLowerCase() === "true"
  );
}

let demoUserCache: StoredUser | undefined;

/** สร้าง/คืน demo user ตอน runtime (อ่าน env ตอน cold start บน Vercel) */
function getDemoUserRecord(): StoredUser {
  if (!demoUserCache) {
    const phone = resolveDemoLoginPhone();
    demoUserCache = {
      id: `demo-user-${phone}`,
      phone,
      firstName: "Demo",
      lastName: "Player",
      bankAccountNumber: "1234567890",
      bankId: "scb",
      channelId: "facebook",
      passwordHash: hashPassword(resolveDemoLoginPassword()),
      createdAt: "2026-10-01T00:00:00.000Z",
      avatarPresetId: "avatar-1",
    };
  }
  return demoUserCache;
}

/**
 * อัปเดต preset avatar บัญชีเดโม (in-memory — ใช้ตอน dev / ไม่มี .data)
 */
export function setDemoUserAvatarPreset(avatarPresetId: string): void {
  getDemoUserRecord().avatarPresetId = avatarPresetId;
}

/**
 * คืนบัญชีเดโมเมื่อเบอร์ตรงชุดที่ฝังไว้
 */
export function findDemoUserByPhone(phone: string): StoredUser | undefined {
  if (!isDemoUserEnabled()) return undefined;
  const user = getDemoUserRecord();
  const digits = phone.replace(/\D/g, "");
  if (digits !== user.phone) return undefined;
  return user;
}

/**
 * คืนบัญชีเดโมเมื่อ session ชี้มาที่ id คงที่
 */
export function findDemoUserById(id: string): StoredUser | undefined {
  if (!isDemoUserEnabled()) return undefined;
  const user = getDemoUserRecord();
  if (id !== user.id) return undefined;
  return user;
}
