import { NextResponse } from "next/server";
import { findUserByPhone, toSessionUser } from "@/lib/auth/userStore";
import { verifyPassword } from "@/lib/auth/password";
import { attachSessionCookie } from "@/lib/auth/session";
import type { AuthActionResponse } from "@/app/types/auth";
import { isThaiMobilePhone, sanitizePhone } from "@/lib/fieldInput";
import { clientIp, readJsonObject, readString } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rateLimit";

/** รหัสผ่านยาวเกินนี้ไม่ต้อง hash (กัน scrypt บล็อก event loop) */
const PASSWORD_MAX_LENGTH = 128;

function fail(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json<AuthActionResponse>({ ok: false, error }, { status, headers });
}

/**
 * POST /api/auth/login — เข้าสู่ระบบด้วยเบอร์ + รหัสผ่าน
 * จำกัด 10 ครั้ง / 5 นาที ต่อ IP และต่อเบอร์
 */
export async function POST(request: Request) {
  const ipLimit = rateLimit(`login:ip:${clientIp(request)}`, 10, 5 * 60_000);
  if (!ipLimit.ok) {
    return fail("พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่", 429, { "Retry-After": String(ipLimit.retryAfterSec) });
  }

  const body = await readJsonObject(request);
  if (!body) return fail("ข้อมูลไม่ถูกต้อง", 400);

  const phone = sanitizePhone(readString(body.phone, 20) ?? "");
  const password = typeof body.password === "string" ? body.password : "";

  if (!isThaiMobilePhone(phone) || !password) {
    return fail("กรุณากรอกเบอร์โทร 10 หลักและรหัสผ่าน", 400);
  }

  const phoneLimit = rateLimit(`login:phone:${phone}`, 10, 5 * 60_000);
  if (!phoneLimit.ok) {
    return fail("พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่", 429, { "Retry-After": String(phoneLimit.retryAfterSec) });
  }

  const user = password.length <= PASSWORD_MAX_LENGTH ? await findUserByPhone(phone) : undefined;
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return fail("เบอร์หรือรหัสผ่านไม่ถูกต้อง", 401);
  }

  const response = NextResponse.json<AuthActionResponse>({ ok: true, user: toSessionUser(user) });
  attachSessionCookie(response, user.id);
  return response;
}
