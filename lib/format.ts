import type { VipMission } from "@/app/types/vip";

/**
 * รูปแบบตัวเลข เงิน และวันที่ — ใช้ร่วมทั้งแอป (ย้ายมาจาก app/data/*MockData.ts)
 * ส่วนบน = ฟังก์ชันพื้นฐาน · ส่วนล่าง = ชื่อเดิมตามโดเมน ที่ component ใช้อยู่ (ผลลัพธ์เหมือนเดิมทุกตัว)
 */

const NUMBER_LOCALE = "th-TH";

/** ตัวเลขคั่นหลักพัน — locale ไทย (เลขอารบิก) */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(NUMBER_LOCALE, options).format(value);
}

/** จำนวนเงินทศนิยม 2 ตำแหน่ง ไม่มีสัญลักษณ์ เช่น 1,234.50 */
export function formatMoney(value: number): string {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** เงินบาทแบบ Intl currency เช่น ฿1,234.50 */
export function formatBaht(value: number): string {
  return formatNumber(value, { style: "currency", currency: "THB", minimumFractionDigits: 2 });
}

/** เปอร์เซ็นต์ ทศนิยมไม่เกิน 2 ตำแหน่ง เช่น 0.5% */
export function formatPercent(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: 2 })}%`;
}

/* ตัวเลข + หน่วย (คน / รายการ / เครดิต / เพชร) → useFormat() ใน lib/i18n/useFormat.ts (หน่วยตามภาษา) */

/** วันที่-เวลาแบบสั้น dd/mm/yyyy{separator}HH:mm (ปี ค.ศ. 24 ชม.) */
export function formatDateTimeShort(iso: string, separator: string): string {
  const date = new Date(iso);
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${datePart}${separator}${timePart}`;
}

/* ── กระเป๋าเงิน / ฝาก / ถอน ── */

/** ยอดบน Header — ปัดเป็นจำนวนเต็ม คั่นหลักพัน */
export function formatHeaderWalletBalance(amount: number): string {
  return formatNumber(Math.round(amount));
}

export const formatDepositAmount = (value: number) => formatNumber(value);
export const formatDepositTransferAmount = formatMoney;
export const formatWithdrawAmount = (value: number) => formatNumber(value);
export const formatWithdrawMoney = formatMoney;

/* ── cashback / คืนยอดเสีย ── */

/** ฿ นำหน้าแบบเว้นวรรค เช่น ฿ 1,234.00 */
export function formatCashbackCurrency(amountThb: number): string {
  return `฿ ${formatMoney(amountThb)}`;
}

export const formatCashbackPercent = formatPercent;
export const formatLossRebateCurrency = formatBaht;
export const formatLossRebatePercent = formatPercent;
export const formatLossRebateDateTime = (iso: string) => formatDateTimeShort(iso, " • ");

/* ── แนะนำเพื่อน ── */

export const formatReferralCurrency = formatBaht;
export const formatReferralRegisteredAt = (iso: string) => formatDateTimeShort(iso, " · ");
export const formatReferralEarningDateTime = (iso: string) => formatDateTimeShort(iso, " • ");

/* ── รางวัล / เพชร / เช็คอิน / กิจกรรม ── */

export const formatRewardPoints = formatMoney;
export const formatGemsBalance = (value: number) => formatNumber(value);
export const formatGemsAmount = (value: number) => `${formatNumber(value)} Gems`;
export const formatActivityNumber = (value: number) => formatNumber(value);

/* ── VIP ── */

export const formatVipAmount = (value: number) => formatNumber(value);
export const formatVipExp = formatVipAmount;

/**
 * ยอดย่อหน่วยล้าน เช่น 1.5 ล้าน / 1.5M · ต่ำกว่าล้านแสดงเต็ม
 * million = หน่วยที่แปลแล้วจากผู้เรียก (useFormat → common.units.million)
 */
export function formatVipCompactAmount(value: number, million: (n: string) => string): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return million(formatNumber(millions, { maximumFractionDigits: millions >= 10 ? 0 : 1 }));
  }
  return formatVipAmount(value);
}

/** ความคืบหน้าภารกิจ เช่น 1,200 / 5,000 เทิร์น — unit แปลแล้วจากผู้เรียก: t(mission.unitKey) */
export function formatVipMissionStatus(mission: Pick<VipMission, "progress" | "target">, unit: string): string {
  return `${formatVipAmount(mission.progress)} / ${formatVipAmount(mission.target)} ${unit}`;
}

/* ── Hall of Fame ── */

/** เวลาที่ชนะ dd/mm/yyyy HH:mm:ss ตามเวลาเครื่อง */
export function formatWonAt(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(date.getDate())}/${p(date.getMonth() + 1)}/${date.getFullYear()} ${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}
