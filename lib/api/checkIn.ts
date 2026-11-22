import {
  CUMULATIVE_CHECKIN_MILESTONES,
  DAILY_CHECKIN_INITIAL,
  DAILY_CHECKIN_TERMS,
} from "@/app/data/dailyCheckInMockData";
import type { ApiResult } from "./http";
import { mockAction, mockResult, type ActionResult } from "./mock";

function checkInMock() {
  return {
    days: DAILY_CHECKIN_INITIAL,
    milestones: CUMULATIVE_CHECKIN_MILESTONES,
    terms: DAILY_CHECKIN_TERMS,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/missions/check-in (ตอนนี้อนุมานจาก mock) */
export type CheckInData = ReturnType<typeof checkInMock>;

/**
 * ต่อ backend: return apiFetch<CheckInData>("/api/missions/check-in")
 */
export function fetchCheckIn(): Promise<ApiResult<CheckInData>> {
  return mockResult(checkInMock());
}

export interface CheckInClaimData {
  day: number;
  credits: number;
}

/**
 * รับรางวัลเช็กอินรายวัน — POST /api/missions/check-in/claim { day }
 * ต่อ backend: apiFetch<CheckInClaimData>(...) แล้ว toActionResult
 */
export function claimCheckInDay(input: { day: number; credits: number }): Promise<ActionResult<CheckInClaimData>> {
  return mockAction({ day: input.day, credits: input.credits }, 300);
}

export interface CheckInMilestoneClaimData {
  milestoneDay: number;
  gemsReward: number;
}

/**
 * รับรางวัลสะสมเช็กอิน — POST /api/missions/check-in/milestones/claim { milestoneDay }
 */
export function claimCheckInMilestone(input: {
  milestoneDay: number;
  gemsReward: number;
}): Promise<ActionResult<CheckInMilestoneClaimData>> {
  return mockAction({ milestoneDay: input.milestoneDay, gemsReward: input.gemsReward }, 300);
}
