"use client";

import type { ReactNode } from "react";

type SheetFrameProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function SheetFrame({ title, onClose, children }: SheetFrameProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-3 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-[var(--radius-soft-xl)] bg-[var(--BG-Surface-Darker)] p-4 shadow-[var(--shadow-soft)]"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--text-on-light)]">{title}</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 rounded-full bg-[var(--BG-Surface-Normal)] text-lg">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
