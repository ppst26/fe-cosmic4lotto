import { NextResponse } from "next/server";
import { createUser, toSessionUser } from "@/lib/auth/userStore";
import { attachSessionCookie } from "@/lib/auth/session";
import type { AuthActionResponse } from "@/app/types/auth";
import { getSignUpBankById, getSignUpChannelById } from "@/app/data/signupMockData";
import {
  isBankAccountNumber,
  isPasswordLengthOk,
  isPersonName,
  isThaiMobilePhone,
  sanitizeBankAccount,
  sanitizePhone,
} from "@/lib/fieldInput";
import { clientIp, readJsonObject, readString } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/rateLimit";

function fail(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json<AuthActionResponse>({ ok: false, error }, { status, headers });
}

/**
 * POST /api/auth/register — สมัครสมาชิก + ตั้ง session cookie
 * จำกัด 5 ครั้ง / 10 นาที ต่อ IP · ทุก field ตรวจชนิดก่อนใช้
 */
export async function POST(request: Request) {
  const limit = rateLimit(`register:ip:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return fail("สมัครบ่อยเกินไป กรุณารอสักครู่", 429, { "Retry-After": String(limit.retryAfterSec) });
  }

  const body = await readJsonObject(request);
  if (!body) return fail("ข้อมูลไม่ถูกต้อง", 400);

  const phone = sanitizePhone(readString(body.phone, 20) ?? "");
  const password = typeof body.password === "string" ? body.password : "";
  const firstName = readString(body.firstName, 60) ?? "";
  const lastName = readString(body.lastName, 60) ?? "";
  const bankAccountNumber = sanitizeBankAccount(readString(body.bankAccountNumber, 20) ?? "");
  const bankId = readString(body.bankId, 40);
  const channelId = readString(body.channelId, 40);

  if (!isThaiMobilePhone(phone)) {
    return fail("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0", 400);
  }
  if (!isPasswordLengthOk(password)) {
    return fail("รหัสผ่านต้องมี 6–32 ตัวอักษร", 400);
  }
  if (!isPersonName(firstName) || !isPersonName(lastName)) {
    return fail("ชื่อและนามสกุลต้องเป็นตัวอักษร", 400);
  }
  if (!isBankAccountNumber(bankAccountNumber)) {
    return fail("เลขบัญชีต้องเป็นตัวเลข 10–12 หลัก", 400);
  }
  /** ธนาคาร / ช่องทางต้องอยู่ในตัวเลือกที่ระบบมี (ไม่รับค่าอิสระจาก client) */
  if (!bankId || !getSignUpBankById(bankId) || !channelId || !getSignUpChannelById(channelId)) {
    return fail("กรุณาเลือกธนาคารและช่องทางที่รู้จักเรา", 400);
  }

  try {
    const user = await createUser({
      phone,
      password,
      firstName,
      lastName,
      bankAccountNumber,
      bankId,
      channelId,
    });
    const response = NextResponse.json<AuthActionResponse>({ ok: true, user: toSessionUser(user) });
    attachSessionCookie(response, user.id);
    return response;
  } catch (err) {
    if (err instanceof Error && err.message === "PHONE_TAKEN") {
      // หมายเหตุ: บอกว่าเบอร์ถูกใช้แล้ว (UX) แลกกับการเดาได้ว่าเบอร์ไหนสมัคร — rate limit ช่วยจำกัดการไล่เดา
      return fail("เบอร์นี้มีบัญชีอยู่แล้ว", 409);
    }
    console.error("[api/auth/register]", err);
    return fail("ไม่สามารถสมัครได้ ลองใหม่อีกครั้ง", 500);
  }
}
