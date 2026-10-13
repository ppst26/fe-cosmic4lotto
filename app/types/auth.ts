/** ผู้ใช้ที่เก็บในไฟล์ JSON (server) */
export interface StoredUser {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  bankAccountNumber: string;
  bankId: string;
  channelId: string;
  passwordHash: string;
  createdAt: string;
  /** preset avatar ที่ user เลือก — อ้างอิง app/data/avatarPresets.ts */
  avatarPresetId?: string;
}

/** ข้อมูลที่ส่งให้ client หลัง login/register */
export interface SessionUser {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export interface AuthSessionResponse {
  user: SessionUser | null;
}

export interface AuthActionResponse {
  ok: boolean;
  user?: SessionUser;
  error?: string;
}

/** Payload สมัครจาก drawer 2 step */
export interface RegisterRequestBody {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  bankAccountNumber: string;
  bankId: string;
  channelId: string;
}

export interface LoginRequestBody {
  phone: string;
  password: string;
}

/** ข้อมูลโปรไฟล์สำหรับหน้า /profile (ไม่มีรหัสผ่าน) */
export interface ProfileUser {
  id: string;
  memberId: string;
  displayName: string;
  phone: string;
  phoneMasked: string;
  firstName: string;
  lastName: string;
  bankId: string;
  bankLabel: string;
  /** เลขบัญชีเต็ม — แสดงในหัวโปรไฟล์ของเจ้าของบัญชีเท่านั้น */
  bankAccountNumber: string;
  bankAccountMasked: string;
  createdAt: string;
  joinedLabel: string;
  avatarPresetId: string;
  avatarUrl: string;
}

export interface ProfileResponse {
  profile: ProfileUser | null;
}

export interface UpdateProfileAvatarRequest {
  avatarPresetId: string;
}

export interface UpdateProfileAvatarResponse {
  ok: boolean;
  profile?: ProfileUser;
  error?: string;
}
