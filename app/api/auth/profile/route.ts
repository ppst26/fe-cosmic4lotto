import { NextResponse } from "next/server";
import { findUserById, toProfileUser, updateUserAvatarPreset } from "@/lib/auth/userStore";
import { getSessionUserId } from "@/lib/auth/session";
import type { ProfileResponse, UpdateProfileAvatarResponse } from "@/app/types/auth";
import { readJsonObject, readString } from "@/lib/server/request";

/**
 * GET /api/auth/profile — ข้อมูลโปรไฟล์ผู้ใช้ที่ล็อกอิน
 */
export async function GET() {
  const userId = await getSessionUserId();
  const user = userId ? await findUserById(userId) : undefined;
  if (!user) {
    return NextResponse.json<ProfileResponse>({ profile: null }, { status: 401 });
  }
  return NextResponse.json<ProfileResponse>({ profile: toProfileUser(user) });
}

/**
 * PATCH /api/auth/profile — อัปเดต preset avatar
 */
export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json<UpdateProfileAvatarResponse>({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json<UpdateProfileAvatarResponse>({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const presetId = readString(body.avatarPresetId, 64);
  if (!presetId) {
    return NextResponse.json<UpdateProfileAvatarResponse>({ ok: false, error: "MISSING_PRESET" }, { status: 400 });
  }

  try {
    const user = await updateUserAvatarPreset(userId, presetId);
    return NextResponse.json<UpdateProfileAvatarResponse>({ ok: true, profile: toProfileUser(user) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "INVALID_PRESET") {
      return NextResponse.json<UpdateProfileAvatarResponse>({ ok: false, error: message }, { status: 400 });
    }
    if (message === "USER_NOT_FOUND") {
      return NextResponse.json<UpdateProfileAvatarResponse>({ ok: false, error: message }, { status: 404 });
    }
    console.error("[api/auth/profile]", error);
    return NextResponse.json<UpdateProfileAvatarResponse>({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
