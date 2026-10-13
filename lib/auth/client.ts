import type {
  AuthActionResponse,
  AuthSessionResponse,
  LoginRequestBody,
  ProfileResponse,
  ProfileUser,
  RegisterRequestBody,
  SessionUser,
  UpdateProfileAvatarResponse,
} from "@/app/types/auth";
import { apiFetch, type ApiResult } from "@/lib/api/http";

/**
 * เรียก API auth ฝั่ง client ผ่าน apiFetch (ส่ง cookie อัตโนมัติ · ไม่ throw)
 * ใช้ใน AuthProvider · Login/SignUp drawer · หน้าโปรไฟล์
 */
export async function fetchSession(): Promise<SessionUser | null> {
  const res = await apiFetch<AuthSessionResponse>("/api/auth/session");
  return res.ok ? (res.data?.user ?? null) : null;
}

/** สมัครสมาชิก — error จาก server / network กลายเป็น { ok: false, error } */
export async function registerUser(body: RegisterRequestBody): Promise<AuthActionResponse> {
  const res = await apiFetch<AuthActionResponse>("/api/auth/register", { method: "POST", body });
  return res.ok ? res.data : { ok: false, error: res.error.message };
}

/** เข้าสู่ระบบ — error จาก server / network กลายเป็น { ok: false, error } */
export async function loginUser(body: LoginRequestBody): Promise<AuthActionResponse> {
  const res = await apiFetch<AuthActionResponse>("/api/auth/login", { method: "POST", body });
  return res.ok ? res.data : { ok: false, error: res.error.message };
}

/** โปรไฟล์เต็ม — อ่านผ่าน useProfile() (app/hooks/api/account.ts) · ok:false เมื่อยังไม่ login / โหลดไม่ได้ / ไม่พบ */
export async function fetchProfile(): Promise<ApiResult<ProfileUser>> {
  const res = await apiFetch<ProfileResponse>("/api/auth/profile");
  if (!res.ok) return res;
  if (!res.data?.profile) {
    return { ok: false, error: { code: "HTTP", status: 404, message: "ไม่พบข้อมูลบัญชี" } };
  }
  return { ok: true, status: res.status, data: res.data.profile };
}

/** บันทึก preset avatar — คืนโปรไฟล์ล่าสุดเมื่อสำเร็จ */
export async function updateProfileAvatarPreset(
  avatarPresetId: string,
): Promise<ProfileUser | null> {
  const res = await apiFetch<UpdateProfileAvatarResponse>("/api/auth/profile", {
    method: "PATCH",
    body: { avatarPresetId },
  });
  if (!res.ok || !res.data?.ok || !res.data.profile) return null;
  return res.data.profile;
}

/** ออกจากระบบ — ไม่ throw แม้ network พัง เพื่อให้ฝั่ง UI ล้าง state ได้เสมอ */
export async function logoutUser(): Promise<void> {
  await apiFetch<unknown>("/api/auth/logout", { method: "POST" });
}
