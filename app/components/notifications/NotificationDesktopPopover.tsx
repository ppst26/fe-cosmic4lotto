"use client";

import React, { useEffect, useRef, useState } from "react";
import { NotificationCenterPanel } from "./NotificationCenterPanel";
import { NotificationBellButton } from "./NotificationBellButton";

/** กล่องแจ้งเตือน desktop — popover ชิดปุ่มกระดิ่งใน Header (ปิดเมื่อคลิกนอก / Esc) */
export function NotificationDesktopPopover() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <NotificationBellButton
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      />
      {open ? (
        <div
          role="dialog"
          className="absolute right-0 top-full z-50 mt-2 w-[340px] animate-scale-up rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)] p-3 text-[var(--text-on-light)] shadow-[var(--shadow-soft)]"
        >
          <NotificationCenterPanel variant="popover" />
        </div>
      ) : null}
    </div>
  );
}
