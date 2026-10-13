import { getLotteryPlayRoundById } from "@/app/data/lotteryRoundsMockData";
import type { LotteryFlagTone, LotteryMessageKey, LotteryRoundLabel } from "@/app/types/lottery";
import { getLotteryMarketBySlug } from "@/app/data/lotteryMarketsMockData";

export interface LotteryPlayRoundView {
  id: string;
  label: LotteryRoundLabel;
  closeAt: string;
  minBet: number;
  maxBet: number;
}

const YIKI_MARKET_TITLE_KEYS: Record<string, LotteryMessageKey> = {
  "yiki-5": "markets.yiki5",
  "yiki-15": "markets.yiki15",
  "yiki-30": "markets.yiki30",
};

/**
 * โหลดรอบแทงจาก slug + roundId — ใช้ทุกหน้า .../[roundId]
 */
export function resolveLotteryPlayRound(
  marketSlug: string,
  roundId: string,
): LotteryPlayRoundView | null {
  const playRound = getLotteryPlayRoundById(marketSlug, roundId);
  if (!playRound) return null;
  return {
    id: playRound.id,
    label: playRound.drawLabel,
    closeAt: playRound.closeAt,
    minBet: playRound.minBet,
    maxBet: playRound.maxBet,
  };
}

/** key ชื่อ + ธงสำหรับการ์ดหัวงวด */
export function lotteryPlayMarketMeta(marketSlug: string): {
  titleKey: LotteryMessageKey;
  flagLabel: string;
  flagTone: LotteryFlagTone;
} {
  if (marketSlug === "thai-government") {
    return { titleKey: "markets.thaiGovernment", flagLabel: "TH", flagTone: "th" };
  }
  const yikiTitleKey = YIKI_MARKET_TITLE_KEYS[marketSlug];
  if (yikiTitleKey) {
    return { titleKey: yikiTitleKey, flagLabel: "YK", flagTone: "gold" };
  }
  const market = getLotteryMarketBySlug(marketSlug);
  if (market) {
    return { titleKey: market.titleKey, flagLabel: market.flagLabel, flagTone: market.flagTone };
  }
  return { titleKey: "hub.title", flagLabel: "TH", flagTone: "th" };
}
