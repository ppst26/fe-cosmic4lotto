"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

interface NotificationBellButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** glass ไม่มีแหล่งจำนวนที่ยังไม่อ่าน — ค่าเริ่มต้นจึงซ่อนจุดแดง */
  showBadge?: boolean;
}

/** ปุ่มกระดิ่งแจ้งเตือนใน HeaderBar (พื้นเข้ม) */
export const NotificationBellButton = React.forwardRef<
  HTMLButtonElement,
  NotificationBellButtonProps
>(function NotificationBellButton(
  { className, showBadge = false, type = "button", ...props },
  ref,
) {
  const t = useT("common");
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-white/90 hover:text-[var(--brand)] active:scale-95 md:h-11 md:w-11",
        className,
      )}
      aria-label={props["aria-label"] ?? t("notifications.title")}
      {...props}
    >
      <NotificationBellIcon />
      {showBadge ? (
        <span
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--brand)]"
          aria-hidden
        />
      ) : null}
    </button>
  );
});

function NotificationBellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M12 3a4.5 4.5 0 0 0-4.5 4.5v2.1c0 .5-.2 1-.55 1.35L5.8 13.2A1.2 1.2 0 0 0 6.75 15h10.5a1.2 1.2 0 0 0 .95-1.8l-1.15-2.25a2 2 0 0 1-.55-1.35V7.5A4.5 4.5 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 17a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
