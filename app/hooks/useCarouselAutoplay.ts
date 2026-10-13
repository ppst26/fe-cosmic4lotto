"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

const DEFAULT_INTERVAL_MS = 5500;

/** ช่วงรอระหว่างสไลด์แบนเนอร์ hero (มือถือ + desktop peek) */
export const HERO_CAROUSEL_AUTOPLAY_MS = 4000;

type UseCarouselAutoplayOptions = {
  intervalMs?: number;
  /** หยุดชั่วคราวเมื่อ hover / focus ภายในโซน carousel */
  rootRef?: RefObject<HTMLElement | null>;
};

/**
 * เลื่อนสไลด์อัตโนมัติวนลูป — ใช้ใน WelcomeBanner และ HomeDesktopPeekCarousel
 */
export function useCarouselAutoplay(
  enabled: boolean,
  onAdvance: () => void,
  options?: UseCarouselAutoplayOptions,
) {
  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const rootRef = options?.rootRef;
  const onAdvanceRef = useRef(onAdvance);
  onAdvanceRef.current = onAdvance;

  const pausedUntilRef = useRef(0);
  const hoverPausedRef = useRef(false);

  const pauseFor = useCallback((ms: number) => {
    pausedUntilRef.current = Date.now() + ms;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMq.matches) return;

    const root = rootRef?.current ?? null;
    const hoverPause =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches && root;

    const pauseHover = () => {
      hoverPausedRef.current = true;
    };
    const resumeHover = () => {
      hoverPausedRef.current = false;
    };

    if (hoverPause) {
      root.addEventListener("pointerenter", pauseHover);
      root.addEventListener("pointerleave", resumeHover);
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        pauseFor(800);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      if (hoverPausedRef.current) return;
      if (Date.now() < pausedUntilRef.current) return;
      if (reducedMq.matches) return;
      onAdvanceRef.current();
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      if (hoverPause) {
        root.removeEventListener("pointerenter", pauseHover);
        root.removeEventListener("pointerleave", resumeHover);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, intervalMs, pauseFor, rootRef]);

  return { pauseFor };
}
