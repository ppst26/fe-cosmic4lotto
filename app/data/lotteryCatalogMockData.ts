import type { LotteryCatalogEntry } from "@/app/types/lottery";
import { LOTTERY_FEATURED_ITEMS, LOTTERY_GRID_ITEMS } from "./lotteryHubMockData";

/**
 * รายการประเภทหวยใน sidebar step 2 — รวม feature + grid (ยี่กี 5/15/30 จาก hub ถ้ามีในอนาคต)
 * ใช้ใน LotteryMarketShell
 */
export const LOTTERY_CATALOG_ENTRIES: LotteryCatalogEntry[] = [
  ...LOTTERY_FEATURED_ITEMS.map((item) => ({
    slug: item.href.replace(/^\/lottery\//, ""),
    titleKey: item.titleKey,
    flagLabel: item.visual === "thai-gov" ? "TH" : "YK",
    flagTone: item.visual === "thai-gov" ? "th" as const : "gold" as const,
    roundsHref: item.href,
    status: "open" as const,
    statusLabel: item.countdownLabel,
  })),
  ...LOTTERY_GRID_ITEMS.map((item) => ({
    slug: item.href.replace(/^\/lottery\//, ""),
    titleKey: item.titleKey,
    flagLabel: item.flagLabel,
    flagTone: item.flagTone,
    roundsHref: item.href,
    status: item.status,
    statusLabel:
      item.status === "closed"
        ? { key: "status.closed" as const }
        : (item.countdownLabel ?? { key: "status.open" as const }),
  })),
];

/** หา catalog จาก slug URL — ใช้ในหน้ารายการรอบ */
export function getLotteryCatalogEntry(slug: string): LotteryCatalogEntry | undefined {
  return LOTTERY_CATALOG_ENTRIES.find((entry) => entry.slug === slug);
}
