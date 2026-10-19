"use client";

import { useEffect, useState } from "react";

/** เท่ากับ --motion-sheet-out (styles/motion-glass.css) — เวลาที่แอนิเมชันปิดของ dialog/sheet ใช้ */
export const PRESENCE_EXIT_MS = 520;

/**
 * ค้าง DOM ไว้จนแอนิเมชันปิดจบ — คืน rendered (ควร render ไหม) + state ("open"/"closed" สำหรับ data-state)
 * ใช้คู่กับ .lotto-overlay-scrim / .lotto-overlay-panel ใน motion-glass.css
 */
export function usePresence(open: boolean, exitMs: number = PRESENCE_EXIT_MS) {
  const [prevOpen, setPrevOpen] = useState(open);
  const [lingering, setLingering] = useState(false);

  if (prevOpen !== open) {
    setPrevOpen(open);
    setLingering(!open);
  }

  useEffect(() => {
    if (!lingering) return;
    const timer = window.setTimeout(() => setLingering(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [lingering, exitMs]);

  return { rendered: open || lingering, state: open ? ("open" as const) : ("closed" as const) };
}

/** เก็บค่าล่าสุดที่ไม่ใช่ null — ให้ dialog ที่รับ payload ยังมีเนื้อหาให้วาดระหว่างแอนิเมชันปิด */
export function useLastValue<T>(value: T | null): T | null {
  const [kept, setKept] = useState<T | null>(value);
  if (value !== null && value !== kept) setKept(value);
  return value ?? kept;
}
