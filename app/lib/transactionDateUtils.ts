/** ช่วงวันที่สำหรับกรองรายการธุรกรรม */

import type { Locale } from "@/lib/i18n/config";
import { formatBangkokTimeHHmm } from "./bangkokTime";

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** ค่าเริ่มต้น — 45 วันที่ผ่านมาถึงวันนี้ */
export function getDefaultTransactionDateRange(): { from: Date; to: Date } {
  const to = startOfDay(new Date());
  const from = new Date(to);
  from.setDate(from.getDate() - 44);
  return { from, to };
}

/** locale ของแอป → tag ของ Intl (th → th-TH = ปฏิทินพุทธ ตามที่แสดงเดิม) */
export function intlDateLocale(locale: Locale): string {
  return locale === "th" ? "th-TH" : locale;
}

export function formatTransactionDateShort(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlDateLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatTransactionDateRangeLabel(from: Date, to: Date, locale: Locale): string {
  return `${formatTransactionDateShort(from, locale)} - ${formatTransactionDateShort(to, locale)}`;
}

/** วันเวลาแบบย่อโซน Bangkok — th: "15 ก.ย. 2569 • 14:30" */
export function formatTransactionDateTimeMedium(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const day = new Intl.DateTimeFormat(intlDateLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(date);
  return `${day} • ${formatBangkokTimeHHmm(date)}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isDateInRange(date: Date, from: Date, to: Date): boolean {
  const t = date.getTime();
  return t >= startOfDay(from).getTime() && t <= endOfDay(to).getTime();
}

/** วันในเดือนที่แสดงในปฏิทิน (รวม padding สัปดาห์) */
export function getCalendarMonthCells(viewMonth: Date): { date: Date; inMonth: boolean }[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const cells: { date: Date; inMonth: boolean }[] = [];
  const start = new Date(year, month, 1 - startOffset);

  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    cells.push({ date, inMonth: date.getMonth() === month });
  }

  return cells;
}

/** หัวคอลัมน์ปฏิทิน อาทิตย์ → เสาร์ (th: อา จ อ พ พฤ ศ ส) */
export function getWeekdayShortLabels(locale: Locale): string[] {
  const format = new Intl.DateTimeFormat(intlDateLocale(locale), { weekday: "narrow", timeZone: "UTC" });
  /* 1 ม.ค. 2023 เป็นวันอาทิตย์ */
  return Array.from({ length: 7 }, (_, i) => format.format(new Date(Date.UTC(2023, 0, 1 + i))));
}

/** ชื่อเดือนเต็ม ม.ค. → ธ.ค. สำหรับ select */
export function getMonthOptionLabels(locale: Locale): string[] {
  const format = new Intl.DateTimeFormat(intlDateLocale(locale), { month: "long", timeZone: "UTC" });
  return Array.from({ length: 12 }, (_, i) => format.format(new Date(Date.UTC(2023, i, 1))));
}
