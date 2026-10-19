"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface OverlayPanelProps {
  /** ค่าเริ่มต้น true — ส่ง false เพื่อให้เล่นแอนิเมชันปิดก่อนถอด DOM */
  open?: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  /** aria-label ของปุ่มปิด (ค่าเริ่มต้น common.close) */
  closeLabel?: string;
  /** ซ่อนหัวข้อ + ปุ่มปิด (ผู้เรียกวาดเอง) */
  hideHeader?: boolean;
  /** ชั้นซ้อน เช่น "z-[60]" */
  zClassName?: string;
  /** ความกว้างสูงสุดบนจอ md ขึ้นไป */
  maxWidthClassName?: string;
  className?: string;
  /** role="alertdialog" สำหรับ confirm */
  role?: "dialog" | "alertdialog";
  /** ปิดด้วย backdrop / Esc ไม่ได้ (เช่นระหว่างส่งข้อมูล) */
  dismissible?: boolean;
  children: React.ReactNode;
}

/** เท่ากับ --motion-sheet-out (styles/motion-glass.css) — รอให้แอนิเมชันปิดจบก่อนถอด DOM */
const EXIT_MS = 520;

/**
 * กรอบ overlay กลาง ๆ สไตล์ sport — bottom sheet บนมือถือ · กล่องกลางจอ md ขึ้นไป
 * มี backdrop · Esc · แอนิเมชันเข้า/ออก (opacity + translate) ใช้ซ้ำใน sheet/modal ทั้งแอป
 */
export function OverlayPanel({
  open = true,
  onClose,
  title,
  closeLabel,
  hideHeader = false,
  zClassName = "z-[60]",
  maxWidthClassName = "md:max-w-md",
  className,
  role = "dialog",
  dismissible = true,
  children,
}: OverlayPanelProps) {
  const t = useT("common");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    // mount/unmount ตามแอนิเมชันเข้า-ออก (ต้องตั้ง state ใน effect เพื่อรอ frame / timer)
    /* eslint-disable react-hooks/set-state-in-effect */
    if (open) {
      setMounted(true);
      setVisible(true);
      return;
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible) {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, dismissible, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={cn("fixed inset-0 flex items-end justify-center md:items-center md:p-4", zClassName)}
      role="presentation"
    >
      <div
        className="lotto-overlay-scrim absolute inset-0 bg-black/50"
        data-state={visible ? "open" : "closed"}
        onClick={() => dismissible && onClose()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role={role}
        aria-modal="true"
        aria-labelledby={title && !hideHeader ? titleId : undefined}
        data-state={visible ? "open" : "closed"}
        className={cn(
          "lotto-overlay-panel overlay-theme relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[var(--radius-soft-xl)] modal-surface-bg p-4 text-[var(--text-on-light)] shadow-[var(--shadow-soft)] outline-none md:max-h-[85dvh] md:rounded-[var(--radius-soft-xl)]",
          maxWidthClassName,
          className,
        )}
      >
        {hideHeader ? null : (
          <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
            <h2 id={titleId} className="text-base font-semibold text-[var(--text-on-light)]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={!dismissible}
              aria-label={closeLabel ?? t("close")}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[var(--text-muted)] hover:text-[var(--text-on-light)] disabled:opacity-50"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
