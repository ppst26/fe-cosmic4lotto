/** ขั้นตอนสมัครสมาชิกแบบหลาย step */
export type SignUpStep = 1 | 2;

/** ข้อมูล step 1 (mock / client state ก่อนต่อ API) */
export interface SignUpStepOneData {
  phone: string;
  password: string;
  confirmPassword: string;
}

/** ข้อมูล step 2 — ข้อมูลส่วนตัวและบัญชีธนาคาร */
export interface SignUpStepTwoData {
  firstName: string;
  lastName: string;
  bankAccountNumber: string;
  bankId: string | null;
  channelId: string | null;
}

/** รวมข้อมูลทั้ง flow ก่อนส่ง API */
export interface SignUpFormData extends SignUpStepOneData, SignUpStepTwoData {}

/* ── จาก app/data/signupMockData.ts ── */

/** โทนปก placeholder ตาม globals.css (.cover-tone-*) */
export type SignUpCoverTone =
  | "indigo"
  | "rose"
  | "emerald"
  | "amber"
  | "sky"
  | "violet";

/** ตัวเลือกธนาคารใน flow สมัครสมาชิก (mock) */
export interface SignUpBankOption {
  id: string;
  label: string;
  coverTone: SignUpCoverTone;
}

/** ตัวเลือกช่องทางที่รู้จัก (mock) */
export interface SignUpChannelOption {
  id: string;
  label: string;
  coverTone: SignUpCoverTone;
}
