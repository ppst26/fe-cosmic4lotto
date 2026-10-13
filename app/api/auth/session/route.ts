import { NextResponse } from "next/server";
import { findUserById, toSessionUser } from "@/lib/auth/userStore";
import { getSessionUserId } from "@/lib/auth/session";
import type { AuthSessionResponse } from "@/app/types/auth";

/**
 * GET /api/auth/session — อ่านผู้ใช้จาก cookie ปัจจุบัน (ไม่ login = 200 { user: null })
 */
export async function GET() {
  const userId = await getSessionUserId();
  const user = userId ? await findUserById(userId) : undefined;
  return NextResponse.json<AuthSessionResponse>({ user: user ? toSessionUser(user) : null });
}
