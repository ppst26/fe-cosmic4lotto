import type { MessageKey } from "@/lib/i18n/messages";

/* ── จาก app/data/dailyCheckInMockData.ts ── */

export type DailyCheckInDayStatus = "claimed" | "today" | "locked";

export interface DailyCheckInDayReward {
  day: number;
  /** ชื่อย่อวัน — key ใน namespace rewards แปลตอน render */
  labelKey: MessageKey<"rewards">;
  credits: number;
  status: DailyCheckInDayStatus;
  isBigReward?: boolean;
}

export interface CumulativeCheckInMilestone {
  milestoneDay: number;
  gemsReward: number;
  isUnlocked: boolean;
}
