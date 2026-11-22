import type { NotificationFeedData } from "@/app/types/notifications";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

/**
 * รายการแจ้งเตือนของผู้ใช้ — GET /api/notifications
 * mock ว่าง (ยังไม่มีข้อความ) เหมือนที่หน้าแสดงอยู่ · unreadCount ใช้กับตัวเลขบนไอคอนกระดิ่ง
 *
 * ต่อ backend: return apiFetch<NotificationFeedData>(ENDPOINTS.fetchNotifications.path)
 */
export function fetchNotifications(): Promise<ApiResult<NotificationFeedData>> {
  return mockResult({ unreadCount: 0, items: [] });
}
