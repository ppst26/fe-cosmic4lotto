import type { DailyCheckInDayReward } from "@/app/types/checkIn";

/** จำนวนวันที่เช็คอินแล้วในรอบ — ใช้ใน DailyCheckInCard */
export function countCheckedInDays(days: DailyCheckInDayReward[]): number {
  return days.filter((d) => d.status === "claimed").length;
}
