import { LOTTERY_GRID_ITEMS } from "./lotteryHubMockData";
import type { LotteryMarketConfig } from "@/app/types/lottery";

/** แปลง "03:29:01" (ชม:นาที:วินาที) เป็นจำนวนนาที — ใช้แปลง countdownLabel ของ hub เป็นเวลาปิดรับจริงในหน้าแทง */
function parseCountdownToMinutes(label?: string): number {
  if (!label) return 0;
  const parts = label.split(":").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return 0;
  const [hours, minutes, seconds] = parts;
  return hours * 60 + minutes + seconds / 60;
}

/** สร้างจาก LOTTERY_GRID_ITEMS โดยตรง — แก้ข้อมูลหวยที่จุดเดียวใน lotteryHubMockData.ts */
export const LOTTERY_MARKETS: LotteryMarketConfig[] = LOTTERY_GRID_ITEMS.map((item) => ({
  slug: item.href.replace("/lottery/", ""),
  titleKey: item.titleKey,
  flagLabel: item.flagLabel,
  flagTone: item.flagTone,
  status: item.status,
  closesInMinutes: item.status === "closed" ? -1 : parseCountdownToMinutes(item.countdownLabel),
}));

/** หาตลาดหวยจาก slug ใน URL — ใช้ใน app/lottery/[marketId]/page.tsx */
export function getLotteryMarketBySlug(slug: string): LotteryMarketConfig | undefined {
  return LOTTERY_MARKETS.find((market) => market.slug === slug);
}
