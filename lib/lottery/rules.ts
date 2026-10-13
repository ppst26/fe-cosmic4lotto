import { getLotteryMarketBySlug } from "@/app/data/lotteryMarketsMockData";
import { getLotteryPlayRounds } from "@/app/data/lotteryRoundsMockData";
import { THAI_LOTTO_BET_TYPES } from "@/app/data/thaiLottoMockData";
import { YIKI_SETTLEMENT_TYPES } from "@/app/data/yikiMockData";
import type { LotteryFlagTone, LotteryMessageKey } from "@/app/types/lottery";
import { lotteryPlayMarketMeta } from "./resolvePlayRound";

/** แถวอัตราจ่ายในหน้ากติกา — อัตราจ่ายต่อ 1 บาท */
export interface LotteryRulesRow {
  id: string;
  labelKey: LotteryMessageKey;
  payoutRate: number;
}

export interface LotteryRules {
  slug: string;
  titleKey: LotteryMessageKey;
  flagLabel: string;
  flagTone: LotteryFlagTone;
  rows: LotteryRulesRow[];
  /** ยอดแทงต่อรายการ (จากรอบปัจจุบัน) — null เมื่อไม่มีรอบ */
  minBet: number | null;
  maxBet: number | null;
}

const YIKI_SLUGS = ["yiki-5", "yiki-15", "yiki-30"] as const;

/**
 * ข้อมูลหน้ากติกา / อัตราการจ่ายของตลาดหวย (mock — รอค่าจริงจาก API)
 * หวยรัฐบาลไทยใช้ตารางของตัวเอง · ยี่กี + หวยรายวันใช้ตารางผลการจ่ายแบบยี่กี · slug ไม่รู้จัก → null
 */
export function getLotteryRules(slug: string, from = new Date()): LotteryRules | null {
  const isThai = slug === "thai-government";
  const isYiki = (YIKI_SLUGS as readonly string[]).includes(slug);
  if (!isThai && !isYiki && !getLotteryMarketBySlug(slug)) return null;

  const meta = lotteryPlayMarketMeta(slug);
  const rows: LotteryRulesRow[] = isThai
    ? THAI_LOTTO_BET_TYPES.map((type) => ({ id: type.id, labelKey: type.labelKey, payoutRate: type.payoutRate }))
    : Object.values(YIKI_SETTLEMENT_TYPES).map((type) => ({
        id: type.id,
        labelKey: type.labelKey,
        payoutRate: type.payoutRate,
      }));

  const round = getLotteryPlayRounds(slug, from)[0];
  return {
    slug,
    titleKey: meta.titleKey,
    flagLabel: meta.flagLabel,
    flagTone: meta.flagTone,
    rows,
    minBet: round?.minBet ?? null,
    maxBet: round?.maxBet ?? null,
  };
}

/** path หน้ากติกา — ไม่มี prefix ภาษา (Link/useRouter เติมให้) */
export function lotteryRulesHref(slug: string): string {
  return `/lottery/rules/${encodeURIComponent(slug)}`;
}
