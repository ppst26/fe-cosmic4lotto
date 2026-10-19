"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useT } from "@/lib/i18n/I18nProvider";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  /** อายุ toast (ms) — ใช้กำหนดความยาวแถบเวลา auto-dismiss */
  durationMs: number;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { box: string; icon: string }> = {
  success: {
    box: "bg-emerald-950 border-emerald-500/40 text-emerald-50",
    icon: "✓",
  },
  error: {
    box: "bg-red-950 border-red-500/40 text-red-50",
    icon: "!",
  },
  info: {
    box: "bg-[var(--Card-Normal)] border-[var(--brand)]/50 text-white",
    icon: "i",
  },
};

function ToastHost({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }) {
  const t = useT("common");
  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-[250] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      {items.map((toast) => {
        const style = VARIANT_STYLES[toast.variant];
        return (
          <div
            key={toast.id}
            role="alert"
            style={{ "--toast-duration": `${toast.durationMs}ms` } as React.CSSProperties}
            className={`motion-toast pointer-events-auto flex w-full max-w-md items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-[var(--shadow-soft)] ${style.box}`}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-xs font-bold" aria-hidden>
              {style.icon}
            </span>
            <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded-full px-1 text-xs opacity-70 hover:opacity-100 cursor-pointer border-0 bg-transparent"
              aria-label={t("close")}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (t) clearTimeout(t);
    timersRef.current.delete(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info", durationMs = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [...prev.slice(-2), { id, message, variant, durationMs }]);
      const timer = setTimeout(() => dismiss(id), durationMs);
      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastHost items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast ต้องใช้ภายใน ToastProvider");
  }
  return ctx;
}
