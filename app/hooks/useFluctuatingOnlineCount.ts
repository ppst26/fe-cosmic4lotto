"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getMostOnlineDisplayCount,
  getMostOnlineFluctuationBounds,
  hashMostOnlineId,
} from "@/lib/mostOnlineDisplayCount";

const TICK_MS_MIN = 4_200;
const TICK_MS_SPREAD = 2_800;

/**
 * ตัวเลขคนออนไลน์บนการ์ด — ค่าเริ่มจาก getMostOnlineDisplayCount แล้วขยับขึ้นลงช้า ๆ ไม่ซิงก์ทุกการ์ด
 * ใช้ใน MostOnlineProviderCard.tsx
 */
export function useFluctuatingOnlineCount(item: { id: string; onlineCount: number }): number {
  const base = useMemo(
    () => getMostOnlineDisplayCount(item),
    [item.id, item.onlineCount],
  );
  const bounds = useMemo(() => getMostOnlineFluctuationBounds(base), [base]);
  const [count, setCount] = useState(base);
  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;

  useEffect(() => {
    setCount(base);
  }, [base]);

  useEffect(() => {
    const hash = hashMostOnlineId(item.id);
    const intervalMs = TICK_MS_MIN + (hash % TICK_MS_SPREAD);
    const initialDelay = 600 + (hash % 1_400);

    const tick = () => {
      const { min, max } = boundsRef.current;
      setCount((prev) => {
        const direction = Math.random() > 0.46 ? 1 : -1;
        const step = Math.floor(Math.random() * 58) + 12;
        const next = prev + direction * step;
        if (next < min) return min + Math.floor(Math.random() * 24);
        if (next > max) return max - Math.floor(Math.random() * 24);
        return next;
      });
    };

    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, intervalMs);
    }, initialDelay);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [item.id]);

  return count;
}
