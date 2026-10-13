"use client";

import { useMemo } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale } from "@/lib/i18n/navigation";
import type { LotteryLabel, LotteryRoundLabel } from "@/app/types/lottery";
import {
  formatLotteryCountdown,
  formatLotteryDateTime,
  formatLotteryRoundLabel,
  formatLotteryShortDate,
  resolveLotteryLabel,
} from "@/lib/lottery/labels";

/**
 * t ของ namespace lottery + ตัวจัดรูปแบบที่ขึ้นกับภาษา (ป้ายรอบ · countdown · วันที่)
 * ใช้ในคอมโพเนนต์หวยฝั่ง client ทั้งหมด
 */
export function useLotteryI18n() {
  const t = useT("lottery");
  const locale = useLocale();
  return useMemo(
    () => ({
      t,
      locale,
      label: (label: LotteryLabel) => resolveLotteryLabel(label, t),
      roundLabel: (label: LotteryRoundLabel) => formatLotteryRoundLabel(label, t, locale),
      countdown: (ms: number) => formatLotteryCountdown(ms, t),
      dateTime: (iso: string) => formatLotteryDateTime(iso, locale),
      shortDate: (iso: string, buddhistYear?: boolean) => formatLotteryShortDate(iso, locale, buddhistYear),
    }),
    [t, locale],
  );
}
