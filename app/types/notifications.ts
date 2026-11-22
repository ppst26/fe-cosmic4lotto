/* ── จาก app/data/notificationsMockData.ts ── */

export type NotificationTabId = "all" | "privileges" | "messages";

/** แท็บที่รายการแจ้งเตือนอยู่ (all = แสดงทุกประเภท จึงไม่ใช้เป็นประเภทของรายการ) */
export type NotificationKind = Exclude<NotificationTabId, "all">;

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** เวลาที่ส่ง (ISO) */
  createdAt: string;
  read: boolean;
}

export interface NotificationFeedData {
  unreadCount: number;
  items: NotificationItem[];
}
