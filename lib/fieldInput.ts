/**
 * มาตรฐานช่องกรอก — ใช้ในฟอร์มสมัคร/ล็อกอิน, ฝาก-ถอน, คูปอง และ API auth
 */

export const PHONE_DIGIT_LENGTH = 10;
export const BANK_ACCOUNT_MIN_DIGITS = 10;
export const BANK_ACCOUNT_MAX_DIGITS = 12;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 32;
export const PERSON_NAME_MAX_LENGTH = 40;
export const MONEY_AMOUNT_MAX_DIGITS = 9;
export const COUPON_CODE_MAX_LENGTH = 20;

/** ตัดให้เหลือตัวเลข ไม่เกิน maxDigits */
export function digitsOnly(raw: string, maxDigits: number): string {
  return raw.replace(/\D/g, "").slice(0, maxDigits);
}

/** เบอร์มือถือไทย — ตัวเลขอย่างเดียว ไม่เกิน 10 หลัก */
export function sanitizePhone(raw: string): string {
  return digitsOnly(raw, PHONE_DIGIT_LENGTH);
}

/** ครบ 10 หลัก และขึ้นต้นด้วย 0 */
export function isThaiMobilePhone(value: string): boolean {
  return /^0\d{9}$/.test(value);
}

/** เลขบัญชี — ตัวเลขอย่างเดียว ไม่เกิน 12 หลัก */
export function sanitizeBankAccount(raw: string): string {
  return digitsOnly(raw, BANK_ACCOUNT_MAX_DIGITS);
}

/** เลขบัญชี 10–12 หลัก */
export function isBankAccountNumber(value: string): boolean {
  return new RegExp(`^\\d{${BANK_ACCOUNT_MIN_DIGITS},${BANK_ACCOUNT_MAX_DIGITS}}$`).test(value);
}

/** รหัสผ่าน — จำกัดความยาวสูงสุด */
export function sanitizePassword(raw: string): string {
  return raw.slice(0, PASSWORD_MAX_LENGTH);
}

export function isPasswordLengthOk(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH;
}

const PERSON_NAME_DISALLOWED = /[^\u0E00-\u0E7Fa-zA-Z .'-]/;

/** ชื่อ-นามสกุล — ไทย/อังกฤษ ช่องว่าง จุด ขีด ไม่มีตัวเลข */
export function sanitizePersonName(raw: string): string {
  return raw.replace(/[^\u0E00-\u0E7Fa-zA-Z .'-]/g, "").slice(0, PERSON_NAME_MAX_LENGTH);
}

export function isPersonName(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > PERSON_NAME_MAX_LENGTH) return false;
  return !PERSON_NAME_DISALLOWED.test(trimmed);
}

/** จำนวนเงินเป็นจำนวนเต็มบาท — ไม่มีตัวอักษร ไม่มีศูนย์นำหน้า */
export function sanitizeMoneyAmount(raw: string): string {
  const digits = digitsOnly(raw, MONEY_AMOUNT_MAX_DIGITS);
  return digits.replace(/^0+(?=\d)/, "");
}

/** รหัสคูปอง — A–Z กับตัวเลข พิมพ์ใหญ่ */
export function sanitizeCouponCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, COUPON_CODE_MAX_LENGTH);
}
