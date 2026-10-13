"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type SoftDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** ห้ามปิดด้วย overlay / Esc (เช่นระหว่างกำลังดำเนินการ) */
  locked?: boolean;
  closeLabel?: string;
  children: ReactNode;
};

/**
 * dialog กลางจอแบบ sport (soft-card ทึบ) — portal ไป document.body เสมอ ที่ z-[100]
 * จึงอยู่เหนือ hub modal (z-[85]) เมื่อเนื้อหาถูก embed
 */
export function SoftDialog({ open, onClose, title, locked = false, closeLabel = "Close", children }: SoftDialogProps) {
  useEffect(() => {
    if (!open || locked) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, locked, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex animate-fade-in select-none items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={() => {
        if (!locked) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal-surface relative w-full max-w-[380px] animate-scale-up p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          disabled={locked}
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 soft-panel-bg text-[var(--text-muted)] transition-colors hover:text-[var(--text-on-light)] disabled:opacity-50"
          aria-label={closeLabel}
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
