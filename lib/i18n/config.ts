/**
 * ภาษาที่รองรับ — ลำดับนี้ใช้แสดงในตัวสลับภาษา
 * เพิ่มภาษา: เพิ่ม code ที่นี่ + FALLBACK_CHAIN + LOCALE_LABELS + lib/i18n/messages/<code>.json
 */
export const LOCALES = ["th", "en", "lo", "my", "vi", "zh", "id", "fil", "km"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "th";

/** cookie จำภาษา — ตั้งตอนผู้ใช้เลือกภาษา และตอน login จาก profile */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

/** คีย์ที่ขาดจะไล่ตามลำดับนี้ — th ต้องครบเสมอจึงเป็นปลายทางสุดท้าย */
export const FALLBACK_CHAIN: Record<Locale, readonly Locale[]> = {
  th: [],
  en: ["th"],
  lo: ["th", "en"],
  my: ["en", "th"],
  vi: ["en", "th"],
  zh: ["en", "th"],
  id: ["en", "th"],
  fil: ["en", "th"],
  km: ["en", "th"],
};

/** ชื่อภาษาในภาษานั้นเอง + ตัวย่อบนปุ่ม desktop */
export const LOCALE_LABELS: Record<Locale, { native: string; short: string }> = {
  th: { native: "ไทย", short: "TH" },
  en: { native: "English", short: "EN" },
  lo: { native: "ລາວ", short: "LO" },
  my: { native: "မြန်မာ", short: "MY" },
  vi: { native: "Tiếng Việt", short: "VI" },
  zh: { native: "简体中文", short: "ZH" },
  id: { native: "Bahasa Indonesia", short: "ID" },
  fil: { native: "Filipino", short: "FIL" },
  km: { native: "ខ្មែរ", short: "KM" },
};

export function hasLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
