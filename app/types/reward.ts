import type { WheelSegmentStyle } from "./wheelTheme";
import type { MessageKey } from "@/lib/i18n/messages";
/* ── จาก app/data/gemsStoreMockData.ts ── */

export interface GemsStorePackage {
  id: string;
  credits: number;
  gemsCost: number;
  /** ไอคองค์เหรียญ — public/assets/coins (coins1 น้อย → coins4 มาก) */
  coinSrc: string;
}

/* ── จาก app/data/rewardFeaturesMockData.ts ── */

export type RewardHubShortcutId = "lucky-box" | "random-card" | "freespins";

export interface RewardHubShortcut {
  id: RewardHubShortcutId;
  /** key ใน namespace rewards — แปลตอน render */
  labelKey: MessageKey<"rewards">;
  href: string;
  iconId: string;
  /** ปิดใช้งานชั่วคราว — แสดง Coming soon */
  comingSoon?: boolean;
}

export interface RewardPromoBanner {
  id: string;
  title: string;
  subtitleKey: MessageKey<"rewards">;
  href: string;
  imageSrc: string;
  termsLabelKey: MessageKey<"rewards">;
}

/** การ์ดรางวัลแสดงผล — 3 บน · 2 ล่าง (อ้างอิง Redeem Card) */
export interface RandomCardDisplayItem {
  id: string;
  imageSrc: string;
  pointsValue: number;
}

export interface ExchangeMoneyPackage {
  id: string;
  credits: number;
  pointsCost: number;
}

export interface FreespinOffer {
  id: string;
  gameName: string;
  providerLabel: string;
  pointsCost: number;
  spins: number;
  thumbSrc: string;
}

/* ── จาก app/data/luckyWheelMockData.ts ── */

export type WheelPrizeKind = "credit" | "gems";

export type WheelSpinMethod = "gems" | "ticket";

/** ช่องรางวัล — สี / สีข้อความ / ไอคอน ปรับรายช่องได้ (WheelSegmentStyle) */
export interface WheelSegment extends WheelSegmentStyle {
  id: string;
  label: string;
  kind: WheelPrizeKind;
}

export interface WheelHistoryEntry {
  id: string;
  label: string;
  kind: WheelPrizeKind;
  timeLabel: string;
}

export interface WheelBenefitCard {
  id: string;
  titleLines: readonly [string, string];
  iconId: "prize" | "check-in" | "crown";
}

export interface WheelLiveWinnerEntry {
  id: string;
  avatarLetter: string;
  maskedName: string;
  gemsAmount: number;
  timeLabel: string;
}

export interface WheelPrizeHistoryRow {
  id: string;
  atLabel: string;
  prizeKind: WheelPrizeKind;
  prizeName: string;
  amount: string;
  method: WheelSpinMethod;
}
