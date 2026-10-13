import type { SignUpCoverTone, SignUpBankOption, SignUpChannelOption } from "@/app/types/signup";

const COVER_TONES: SignUpCoverTone[] = [
  "indigo",
  "rose",
  "emerald",
  "amber",
  "sky",
  "violet",
];

function coverToneAt(index: number): SignUpCoverTone {
  return COVER_TONES[index % COVER_TONES.length]!;
}

const BANK_LABELS = [
  "SCB",
  "KBANK",
  "KTB",
  "BAY",
  "CIMBT",
  "TTB",
  "BBL",
  "UOBT",
  "LHFG",
  "SCBT",
  "GSB",
  "KKP",
  "CITI",
  "GHB",
  "BAAC",
  "ISBT",
  "TISCO",
  "CREDIT",
  "TRUEWALLET",
] as const;

const CHANNEL_LABELS = [
  "Facebook",
  "Google",
  "TikTok",
  "Line",
  "YouTube",
  "Instagram",
  "X",
  "Telegram",
  "เว็บแบนเนอร์",
] as const;

/** รายการธนาคาร — โทนปกจาก design tokens ไม่ใช่สีแบรนด์ธนาคาร */
export const SIGNUP_BANKS: SignUpBankOption[] = BANK_LABELS.map((label, index) => ({
  id: label.toLowerCase().replace(/\s+/g, "-"),
  label,
  coverTone: coverToneAt(index),
}));

/** ช่องทางอ้างอิง — โทนปกจาก design tokens */
export const SIGNUP_CHANNELS: SignUpChannelOption[] = CHANNEL_LABELS.map((label, index) => ({
  id: label.toLowerCase().replace(/\s+/g, "-"),
  label,
  coverTone: coverToneAt(index + 2),
}));

export function getSignUpBankById(id: string | null): SignUpBankOption | undefined {
  if (!id) return undefined;
  return SIGNUP_BANKS.find((b) => b.id === id);
}

export function getSignUpChannelById(id: string | null): SignUpChannelOption | undefined {
  if (!id) return undefined;
  return SIGNUP_CHANNELS.find((c) => c.id === id);
}

/** class ปกสำหรับ grid picker — ต้องครบ string เพื่อ Tailwind */
export function signUpCoverToneClass(tone: SignUpCoverTone): string {
  const map: Record<SignUpCoverTone, string> = {
    indigo: "cover-tone-indigo",
    rose: "cover-tone-rose",
    emerald: "cover-tone-emerald",
    amber: "cover-tone-amber",
    sky: "cover-tone-sky",
    violet: "cover-tone-violet",
  };
  return map[tone];
}
