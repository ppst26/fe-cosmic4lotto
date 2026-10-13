"use client";

import React, { useState } from "react";
import {
  NOTIFICATION_EMPTY_MESSAGE_KEY,
  NOTIFICATION_TABS,
} from "@/app/data/notificationsMockData";
import { useT } from "@/lib/i18n/I18nProvider";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationPopoverFooter } from "./NotificationPopoverFooter";
import { cn } from "@/lib/utils";
import type { NotificationTabId } from "@/app/types/notifications";

interface NotificationCenterPanelProps {
  /** mobile sheet — ไม่มีแถบติดต่อด้านล่าง */
  variant?: "popover" | "sheet";
}

/** เนื้อหากล่องแจ้งเตือน — แท็บ 3 ช่อง + empty state (desktop popover · mobile sheet) */
export function NotificationCenterPanel({ variant = "popover" }: NotificationCenterPanelProps) {
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");
  const t = useT("common");

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <div
        className="grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-[var(--BG-Surface-Darker)] p-1"
        role="tablist"
        aria-label={t("notifications.tabsLabel")}
      >
        {NOTIFICATION_TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                "min-h-9 cursor-pointer rounded-xl border-0 px-1 py-2 text-xs font-semibold sm:text-[13px]",
                selected
                  ? "bg-[var(--brand)] font-bold text-[#2a0607]"
                  : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-on-light)]",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1" role="tabpanel" aria-live="polite">
        <NotificationEmptyState message={t(NOTIFICATION_EMPTY_MESSAGE_KEY)} />
      </div>

      {variant === "popover" ? <NotificationPopoverFooter /> : null}
    </div>
  );
}
