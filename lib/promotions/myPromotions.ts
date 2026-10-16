"use client";

import { useSyncExternalStore } from "react";
import type { PromotionDetailId } from "@/app/types/promotions";

/**
 * โปรโมชั่นที่ผู้ใช้กดรับ — mock เก็บใน localStorage (เชื่อม back office ภายหลัง)
 * progress ฝาก/เทิร์นโอเวอร์ยังไม่มีแหล่งข้อมูลจริง → ใช้ค่า demo ตาม MOCK_PROGRESS_RATIO
 */
export interface ClaimedPromotion {
  id: PromotionDetailId;
  title: string;
  claimedAt: string;
}

export interface PromotionTargets {
  /** ยอดฝากที่กำหนด (บาท) · undefined = ไม่มีเงื่อนไขฝาก */
  deposit?: number;
  /** ยอดเทิร์นโอเวอร์ที่กำหนด (บาท) */
  turnover?: number;
  /** อายุโปรหลังรับ (วัน) */
  validDays: number;
}

const STORAGE_KEY = "cosmic-my-promotions";
const EVENT = "cosmic-my-promotions-change";

/** เงื่อนไข mock ต่อโปร — welcome อิงข้อความในรายละเอียด (ฝากขั้นต่ำ 100 · เทิร์น 15 เท่าของโบนัสสูงสุด 1,000) */
const MOCK_TARGETS: Record<string, PromotionTargets> = {
  welcome: { deposit: 100, turnover: 15000, validDays: 30 },
  "promo-cashback": { turnover: 5000, validDays: 7 },
  "promo-vip": { deposit: 1000, turnover: 10000, validDays: 30 },
};
const DEFAULT_TARGETS: PromotionTargets = { deposit: 500, turnover: 5000, validDays: 14 };

/** ค่า demo: ฝากไปแล้ว 100% · เทิร์นไปแล้ว 35% */
export const MOCK_PROGRESS_RATIO = { deposit: 1, turnover: 0.35 } as const;

export function getPromotionTargets(id: PromotionDetailId): PromotionTargets {
  return MOCK_TARGETS[id] ?? DEFAULT_TARGETS;
}

let cache: { raw: string | null; list: ClaimedPromotion[] } = { raw: null, list: [] };
const EMPTY: ClaimedPromotion[] = [];

function read(): ClaimedPromotion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cache.raw) return cache.list;
    const parsed = raw ? (JSON.parse(raw) as ClaimedPromotion[]) : [];
    cache = { raw, list: Array.isArray(parsed) ? parsed : [] };
    return cache.list;
  } catch {
    return EMPTY;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function claimPromotion(id: PromotionDetailId, title: string) {
  const current = read();
  if (current.some((item) => item.id === id)) return;
  const next: ClaimedPromotion[] = [{ id, title, claimedAt: new Date().toISOString() }, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage ปิด — ใช้ไม่ได้ข้าม session */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useMyPromotions(): ClaimedPromotion[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
