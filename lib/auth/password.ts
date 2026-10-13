import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Hash รหัสผ่านด้วย scrypt + salt (server-only)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * ตรวจรหัสผ่านกับค่าที่เก็บ
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex) return false;
  const actualHex = scryptSync(password, salt, 64).toString("hex");
  try {
    return timingSafeEqual(Buffer.from(expectedHex, "hex"), Buffer.from(actualHex, "hex"));
  } catch {
    return false;
  }
}
