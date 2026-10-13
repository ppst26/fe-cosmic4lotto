import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const COOKIE_NAME = "cm_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30;
/** ยอมให้นาฬิกา server คลาดกันได้เล็กน้อย (token ที่มาจากอนาคตเกินนี้ = ปลอม) */
const CLOCK_SKEW_MS = 5 * 60 * 1000;
const DEV_FALLBACK_SECRET = "cosmicbet-dev-session-secret-change-me";

/**
 * secret เซ็น cookie — production ต้องตั้ง AUTH_SESSION_SECRET (≥ 32 ตัวอักษร) ไม่งั้น throw
 * dev ใช้ค่า fallback เพื่อให้รันได้ทันที
 */
function getSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET ต้องตั้งค่า (อย่างน้อย 32 ตัวอักษร) ก่อนรัน production");
  }
  return secret || DEV_FALLBACK_SECRET;
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

/**
 * สร้าง token session แบบ signed (userId.timestamp.sig)
 */
export function createSessionToken(userId: string, now = Date.now()): string {
  const payload = `${userId}.${now}`;
  return `${payload}.${sign(payload)}`;
}

/**
 * ตรวจ token และคืน userId ถ้าลายเซ็นถูกและยังไม่หมดอายุ (อายุเท่า cookie 30 วัน)
 * ใช้ใน route handler และ proxy.ts
 */
export function parseSessionToken(token: string | undefined, now = Date.now()): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, timestamp, sig] = parts;
  /** sig ต้องเป็น hex 64 ตัวพอดี — Buffer.from(hex) ข้ามอักขระแปลกท้ายสตริง ถ้าไม่เช็กจะรับ token ที่ต่อท้ายขยะ */
  if (!userId || !/^\d{1,16}$/.test(timestamp ?? "") || !/^[a-f0-9]{64}$/.test(sig ?? "")) return null;

  const issuedAt = Number(timestamp);
  if (issuedAt > now + CLOCK_SKEW_MS || now - issuedAt > MAX_AGE_SEC * 1000) return null;

  try {
    const ok = timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(sign(`${userId}.${timestamp}`), "hex"));
    return ok ? userId : null;
  } catch {
    return null;
  }
}

/**
 * userId จาก cookie ของ request ปัจจุบัน — null ถ้าไม่ได้ login / token ไม่ถูกต้อง
 * ใช้ใน route handler แทนการอ่าน cookies() เองทุกไฟล์
 */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return parseSessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/**
 * ตั้ง cookie session บน response
 */
export function attachSessionCookie(response: NextResponse, userId: string): void {
  response.cookies.set(COOKIE_NAME, createSessionToken(userId), { ...cookieOptions, maxAge: MAX_AGE_SEC });
}

/**
 * ลบ cookie session — token เดิมยังใช้ได้จนหมดอายุ (mock ไม่มี store เพิกถอน · backend จริงต้องทำ)
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
}

export { COOKIE_NAME, MAX_AGE_SEC };
