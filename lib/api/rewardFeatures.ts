import {
  EXCHANGE_MONEY_PACKAGES,
  EXCHANGE_MONEY_RATE_LABEL,
  FREESPIN_OFFERS_MOCK,
  LUCKY_BOX_DRAW_COST_DISPLAY,
  LUCKY_BOX_HERO_IMAGE_SRC,
  REWARD_REDEEM_COMING_SOON_LABEL,
  RANDOM_CARD_COMING_SOON_LABEL,
  RANDOM_CARD_COUNT,
  RANDOM_CARD_DISPLAY_ITEMS,
  RANDOM_CARD_DRAW_COST_DISPLAY,
  REWARD_FEATURE_TERMS,
  REWARD_HUB_PROMO_BANNERS,
  REWARD_HUB_SHORTCUTS,
  REWARD_POINTS_BALANCE_MOCK,
} from "@/app/data/rewardFeaturesMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

function rewardHubMock() {
  return {
    pointsBalance: REWARD_POINTS_BALANCE_MOCK,
    shortcuts: REWARD_HUB_SHORTCUTS,
    banners: REWARD_HUB_PROMO_BANNERS,
    terms: REWARD_FEATURE_TERMS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/reward/hub (ตอนนี้อนุมานจาก mock) */
export type RewardHubData = ReturnType<typeof rewardHubMock>;

/**
 * โหลดข้อมูลศูนย์รางวัล — mock จนกว่าจะมี API
 * ต่อ backend: return apiFetch<RewardHubData>("/api/reward/hub")
 */
export function fetchRewardHub(): Promise<ApiResult<RewardHubData>> {
  return mockResult(rewardHubMock());
}

function luckyBoxMock() {
  return {
    drawCost: LUCKY_BOX_DRAW_COST_DISPLAY,
    heroImageSrc: LUCKY_BOX_HERO_IMAGE_SRC,
    comingSoonLabel: REWARD_REDEEM_COMING_SOON_LABEL,
    terms: REWARD_FEATURE_TERMS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/reward/lucky-box (ตอนนี้อนุมานจาก mock) */
export type LuckyBoxData = ReturnType<typeof luckyBoxMock>;

/**
 * ต่อ backend: return apiFetch<LuckyBoxData>("/api/reward/lucky-box")
 */
export function fetchLuckyBox(): Promise<ApiResult<LuckyBoxData>> {
  return mockResult(luckyBoxMock());
}

function randomCardMock() {
  return {
    cardCount: RANDOM_CARD_COUNT,
    displayCards: RANDOM_CARD_DISPLAY_ITEMS,
    drawCost: RANDOM_CARD_DRAW_COST_DISPLAY,
    comingSoonLabel: RANDOM_CARD_COMING_SOON_LABEL,
    terms: REWARD_FEATURE_TERMS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/reward/random-card (ตอนนี้อนุมานจาก mock) */
export type RandomCardData = ReturnType<typeof randomCardMock>;

/**
 * ต่อ backend: return apiFetch<RandomCardData>("/api/reward/random-card")
 */
export function fetchRandomCard(): Promise<ApiResult<RandomCardData>> {
  return mockResult(randomCardMock());
}

function exchangeMoneyMock() {
  return {
    packages: EXCHANGE_MONEY_PACKAGES,
    rateLabel: EXCHANGE_MONEY_RATE_LABEL,
    terms: REWARD_FEATURE_TERMS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/reward/exchange-money (ตอนนี้อนุมานจาก mock) */
export type ExchangeMoneyData = ReturnType<typeof exchangeMoneyMock>;

/**
 * ต่อ backend: return apiFetch<ExchangeMoneyData>("/api/reward/exchange-money")
 */
export function fetchExchangeMoney(): Promise<ApiResult<ExchangeMoneyData>> {
  return mockResult(exchangeMoneyMock());
}

function freespinsMock() {
  return {
    offers: FREESPIN_OFFERS_MOCK,
    terms: REWARD_FEATURE_TERMS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/reward/freespins (ตอนนี้อนุมานจาก mock) */
export type FreespinsData = ReturnType<typeof freespinsMock>;

/**
 * ต่อ backend: return apiFetch<FreespinsData>("/api/reward/freespins")
 */
export function fetchFreespins(): Promise<ApiResult<FreespinsData>> {
  return mockResult(freespinsMock());
}
