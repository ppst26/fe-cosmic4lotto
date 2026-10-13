import { ACTIVITIES_HUB_ITEMS } from "@/app/data/activitiesHubMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

function activitiesMock() {
  return ACTIVITIES_HUB_ITEMS;
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/activities (ตอนนี้อนุมานจาก mock) */
export type ActivitiesData = ReturnType<typeof activitiesMock>;

/**
 * ต่อ backend: return apiFetch<ActivitiesData>("/api/activities")
 */
export function fetchActivities(): Promise<ApiResult<ActivitiesData>> {
  return mockResult(activitiesMock());
}
