/**
 * Mock แท็บและข้อความว่าง — NotificationCenterPanel (ป้ายเป็น key ของ dictionary common)
 */

import type { NotificationTabId } from "@/app/types/notifications";
import type { MessageKey } from "@/lib/i18n/messages";

export const NOTIFICATION_TABS: { id: NotificationTabId; labelKey: MessageKey<"common"> }[] = [
  { id: "all", labelKey: "notifications.tabs.all" },
  { id: "privileges", labelKey: "notifications.tabs.privileges" },
  { id: "messages", labelKey: "notifications.tabs.messages" },
];

export const NOTIFICATION_EMPTY_MESSAGE_KEY: MessageKey<"common"> = "notifications.empty";

/** ไอคอนล่าง popover desktop — ช่องทางติดต่อ */
export const NOTIFICATION_POPOVER_SOCIAL: {
  label: string;
  href: string;
  icon: "line" | "telegram";
}[] = [
  { label: "LINE", href: "/support", icon: "line" },
  { label: "Telegram", href: "/support", icon: "telegram" },
];
