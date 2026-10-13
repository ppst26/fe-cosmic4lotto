import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";
import type { AuthActionResponse } from "@/app/types/auth";

/**
 * POST /api/auth/logout — ล้าง session cookie
 */
export async function POST() {
  const response = NextResponse.json<AuthActionResponse>({ ok: true });
  clearSessionCookie(response);
  return response;
}
