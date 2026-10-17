import { NextResponse } from "next/server";
import { findUserByPhone, toSessionUser } from "@/lib/auth/userStore";
import { verifyPassword } from "@/lib/auth/password";
import { attachSessionCookie } from "@/lib/auth/session";
import type { AuthActionResponse } from "@/app/types/auth";
import { isThaiMobilePhone, sanitizePhone } from "@/lib/fieldInput";
import { readJsonObject, readString } from "@/lib/server/request";

/** รหัสผ่านยาวเกินนี้ไม่ต้อง hash (กัน scrypt บล็อก event loop) */
const PASSWORD_MAX_LENGTH = 128;

function fail(error: string, status: number) {
  return NextResponse.json<AuthActionResponse>({ ok: false, error }, { status });
}

/**
 * POST /api/auth/login — เข้าสู่ระบบด้วยเบอร์ + รหัสผ่าน
 */
export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) return fail("ข้อมูลไม่ถูกต้อง", 400);

  const phone = sanitizePhone(readString(body.phone, 20) ?? "");
  const password = typeof body.password === "string" ? body.password : "";

  if (!isThaiMobilePhone(phone) || !password) {
    return fail("กรุณากรอกเบอร์โทร 10 หลักและรหัสผ่าน", 400);
  }

  const user = password.length <= PASSWORD_MAX_LENGTH ? await findUserByPhone(phone) : undefined;
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return fail("เบอร์หรือรหัสผ่านไม่ถูกต้อง", 401);
  }

  const response = NextResponse.json<AuthActionResponse>({ ok: true, user: toSessionUser(user) });
  attachSessionCookie(response, user.id);
  return response;
}
