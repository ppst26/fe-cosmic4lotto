import {
  LUCKY_WHEEL_BENEFITS,
  LUCKY_WHEEL_GEMS_PER_SPIN,
  LUCKY_WHEEL_HISTORY,
  LUCKY_WHEEL_HISTORY_TOTAL_PAGES,
  LUCKY_WHEEL_INITIAL_GEMS,
  LUCKY_WHEEL_INITIAL_TICKETS,
  LUCKY_WHEEL_INTRO_LEAD,
  LUCKY_WHEEL_LIVE_WINNERS,
  LUCKY_WHEEL_PRIZE_HISTORY,
  LUCKY_WHEEL_SEGMENTS,
  LUCKY_WHEEL_THEME,
  LUCKY_WHEEL_TAGLINE,
  LUCKY_WHEEL_TERMS,
  LUCKY_WHEEL_TICKETS_PER_SPIN,
} from "@/app/data/luckyWheelMockData";
import { LUCKY_WHEEL_HISTORY_PAGE_SIZE } from "@/lib/uiConstants";
import type { ApiResult } from "./http";
import { mockAction, mockResult, type ActionResult } from "./mock";

function wheelMock() {
  return {
    segments: LUCKY_WHEEL_SEGMENTS,
    /** ธีมวงล้อ (ไม่บังคับ) — ดู app/types/wheelTheme.ts · docs/api/wheel-theme.md */
    theme: LUCKY_WHEEL_THEME,
    benefits: LUCKY_WHEEL_BENEFITS,
    introLead: LUCKY_WHEEL_INTRO_LEAD,
    tagline: LUCKY_WHEEL_TAGLINE,
    terms: LUCKY_WHEEL_TERMS,
    liveWinners: LUCKY_WHEEL_LIVE_WINNERS,
    prizeHistory: LUCKY_WHEEL_PRIZE_HISTORY,
    history: LUCKY_WHEEL_HISTORY,
    historyPageSize: LUCKY_WHEEL_HISTORY_PAGE_SIZE,
    historyTotalPages: LUCKY_WHEEL_HISTORY_TOTAL_PAGES,
    gemsPerSpin: LUCKY_WHEEL_GEMS_PER_SPIN,
    ticketsPerSpin: LUCKY_WHEEL_TICKETS_PER_SPIN,
    initialGems: LUCKY_WHEEL_INITIAL_GEMS,
    initialTickets: LUCKY_WHEEL_INITIAL_TICKETS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/wheel (ตอนนี้อนุมานจาก mock) */
export type WheelData = ReturnType<typeof wheelMock>;

/**
 * ต่อ backend: return apiFetch<WheelData>("/api/wheel")
 */
export function fetchWheel(): Promise<ApiResult<WheelData>> {
  return mockResult(wheelMock());
}

export type WheelSpinMethodInput = "gems" | "ticket";

export interface WheelSpinData {
  /** ช่องที่ได้ (ผลสุ่มจากฝั่ง server) — UI หมุนวงไปหยุดที่ช่องนี้ */
  segmentIndex: number;
  method: WheelSpinMethodInput;
}

/**
 * หมุนวงล้อ — POST /api/wheel/spin { method }
 * mock สุ่มช่องฝั่งนี้แทน server · ต่อ backend: ให้ server สุ่มและตัดยอด Gems/ตั๋ว แล้วคืน segmentIndex
 */
export function spinWheel(input: { method: WheelSpinMethodInput; segmentCount: number }): Promise<ActionResult<WheelSpinData>> {
  const segmentIndex = Math.floor(Math.random() * input.segmentCount);
  return mockAction({ segmentIndex, method: input.method }, 150);
}
