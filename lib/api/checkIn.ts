import {
  CUMULATIVE_CHECKIN_MILESTONES,
  DAILY_CHECKIN_INITIAL,
  DAILY_CHECKIN_TERMS,
} from "@/app/data/dailyCheckInMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

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
