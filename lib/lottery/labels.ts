import type { Locale } from "@/lib/i18n/config";
import type { MessageKey } from "@/lib/i18n/messages";
import type { MessageVars } from "@/lib/i18n/translate";
import type { LotteryLabel, LotteryRoundLabel } from "@/app/types/lottery";

/** t ของ namespace lottery — ได้จาก useT("lottery") หรือ getT("lottery") */
export type LotteryT = (key: MessageKey<"lottery">, vars?: MessageVars) => string;

/** locale ของ Intl — th ใช้ปฏิทินพุทธ (ค่าเริ่มต้นของ th-TH) ภาษาอื่นบังคับ ค.ศ. */
function intlLocale(locale: Locale, buddhistYear = true): string {
  if (locale === "th") return buddhistYear ? "th-TH" : "th-TH-u-ca-gregory";
  if (locale === "en") return "en-GB-u-ca-gregory";
  return `${locale}-u-ca-gregory`;
}

/** วันที่แบบสั้น เช่น 1 ต.ค. 2569 (th) · 1 Oct 2026 (en) — โซน Bangkok */
export function formatLotteryShortDate(iso: string, locale: Locale, buddhistYear = true): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlLocale(locale, buddhistYear), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(date);
}

/** วันเวลาแบบสรุปโพย — เช่น 20 ก.ย. 2569 08:52 */
export function formatLotteryDateTime(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  });
}

/** ป้ายงวด/รอบจากข้อมูลโครงสร้าง → ข้อความตามภาษา */
export function formatLotteryRoundLabel(label: LotteryRoundLabel, t: LotteryT, locale: Locale): string {
  switch (label.kind) {
    case "time":
      return t("round.time", { time: label.time });
    case "draw":
      return t("round.draw", { date: formatLotteryShortDate(label.date, locale) });
    case "market":
      return t("round.market", { market: t(label.titleKey), date: formatLotteryShortDate(label.date, locale) });
  }
}

/** ข้อความแสดงตรง (เช่น countdown "03:29:01") หรือ key ที่ต้องแปล */
export function resolveLotteryLabel(label: LotteryLabel, t: LotteryT): string {
  return typeof label === "string" ? label : t(label.key, label.vars);
}

/** แปลงมิลลิวินาทีคงเหลือเป็น "3 วัน 04:12:09" — หมดเวลาแล้วคืน "ปิดรับแทงแล้ว" */
export function formatLotteryCountdown(ms: number, t: LotteryT): string {
  if (ms <= 0) return t("status.closedAlready");
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const hms = [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  return days > 0 ? t("status.countdownDays", { days, time: hms }) : hms;
}
