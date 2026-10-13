"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { HERO_CAROUSEL_AUTOPLAY_MS, useCarouselAutoplay } from "@/app/hooks/useCarouselAutoplay";

/**
 * สร้างรายการสไลด์พร้อม clone หัว–ท้ายสำหรับ infinite horizontal scroll
 */
export function buildLoopedTrack<T extends { id: string }>(
  items: T[],
): Array<{ item: T; key: string; isClone: boolean }> {
  if (items.length <= 1) {
    return items.map((item) => ({ item, key: item.id, isClone: false }));
  }
  const last = items[items.length - 1]!;
  const first = items[0]!;
  return [
    { item: last, key: `${last.id}--clone-prev`, isClone: true },
    ...items.map((item) => ({ item, key: item.id, isClone: false })),
    { item: first, key: `${first.id}--clone-next`, isClone: true },
  ];
}

/**
 * carousel แนวนอน infinite + autoplay — WelcomeBanner · PromoCarousel (มือถือ)
 */
export function useInfiniteSnapCarousel(slideCount: number) {
  const loopEnabled = slideCount > 1;
  const trackLength = loopEnabled ? slideCount + 2 : slideCount;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollJumpLockRef = useRef(false);
  const snapRestoreTimerRef = useRef<number | null>(null);
  const scrollAnimRef = useRef<number | null>(null);

  const [trackIndex, setTrackIndex] = useState(0);

  const logicalIndex = loopEnabled
    ? trackIndex <= 0
      ? slideCount - 1
      : trackIndex >= trackLength - 1
        ? 0
        : trackIndex - 1
    : Math.min(Math.max(trackIndex, 0), slideCount - 1);

  const getSlideStride = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container?.firstElementChild) return 0;
    const first = container.firstElementChild as HTMLElement;
    const second = container.children[1] as HTMLElement | undefined;
    if (second) return second.offsetLeft - first.offsetLeft;
    const styles = getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return first.offsetWidth + gap;
  }, []);

  const getTrackIndexFromScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    const stride = getSlideStride();
    if (!container || stride <= 0) return 0;
    return Math.round(container.scrollLeft / stride);
  }, [getSlideStride]);

  const reconcileLoopScroll = useCallback(() => {
    if (!loopEnabled) return;
    const container = scrollContainerRef.current;
    const stride = getSlideStride();
    if (!container || stride <= 0 || scrollJumpLockRef.current) return;

    const index = getTrackIndexFromScroll();

    if (index <= 0) {
      scrollJumpLockRef.current = true;
      const jumpTo = slideCount;
      container.style.scrollSnapType = "none";
      container.scrollLeft = jumpTo * stride;
      setTrackIndex(jumpTo);
      window.requestAnimationFrame(() => {
        scrollJumpLockRef.current = false;
      });
      return;
    }

    if (index >= trackLength - 1) {
      scrollJumpLockRef.current = true;
      container.style.scrollSnapType = "none";
      container.scrollLeft = stride;
      setTrackIndex(1);
      window.requestAnimationFrame(() => {
        scrollJumpLockRef.current = false;
      });
      return;
    }

    setTrackIndex(index);
  }, [getSlideStride, getTrackIndexFromScroll, loopEnabled, slideCount, trackLength]);

  const reconcileRef = useRef(reconcileLoopScroll);
  reconcileRef.current = reconcileLoopScroll;

  const scrollToTrackIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current;
      const stride = getSlideStride();
      if (!container || stride <= 0) return;
      const clamped = Math.min(Math.max(index, 0), trackLength - 1);
      const left = clamped * stride;

      if (scrollAnimRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
      if (snapRestoreTimerRef.current !== null) {
        window.clearTimeout(snapRestoreTimerRef.current);
      }

      container.style.scrollSnapType = "none";
      container.style.scrollBehavior = "auto";

      const finish = () => {
        reconcileRef.current();
        snapRestoreTimerRef.current = window.setTimeout(() => {
          container.style.scrollSnapType = "";
          container.style.scrollBehavior = "";
          snapRestoreTimerRef.current = null;
        }, 40);
      };

      if (behavior === "auto" || Math.abs(container.scrollLeft - left) < 1) {
        container.scrollLeft = left;
        setTrackIndex(clamped);
        finish();
        return;
      }

      const start = container.scrollLeft;
      const delta = left - start;
      const duration = 420;
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - (1 - t) * (1 - t);
        container.scrollLeft = start + delta * eased;
        if (t < 1) {
          scrollAnimRef.current = window.requestAnimationFrame(step);
          return;
        }
        scrollAnimRef.current = null;
        container.scrollLeft = left;
        finish();
      };
      setTrackIndex(clamped);
      scrollAnimRef.current = window.requestAnimationFrame(step);
    },
    [getSlideStride, trackLength],
  );

  const scrollToLogicalIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const target = loopEnabled ? index + 1 : index;
      scrollToTrackIndex(target, behavior);
    },
    [loopEnabled, scrollToTrackIndex],
  );

  const trackIndexRef = useRef(0);
  trackIndexRef.current = trackIndex;

  const { pauseFor } = useCarouselAutoplay(
    loopEnabled,
    () => {
      scrollToTrackIndex(trackIndexRef.current + 1);
    },
    { intervalMs: HERO_CAROUSEL_AUTOPLAY_MS },
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || trackLength === 0) return;

    const initialIndex = loopEnabled ? 1 : 0;
    scrollToTrackIndex(initialIndex, "auto");

    let settleTimer: number | undefined;
    const onScroll = () => {
      const stride = getSlideStride();
      if (stride > 0 && !scrollJumpLockRef.current) {
        const index = getTrackIndexFromScroll();
        const clamped = Math.min(Math.max(index, 0), trackLength - 1);
        setTrackIndex(clamped);
      }
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        reconcileLoopScroll();
      }, 140);
    };

    const pauseFromUser = () => pauseFor(12_000);
    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("pointerdown", pauseFromUser);

    const observer = new ResizeObserver(() => {
      const index = loopEnabled
        ? Math.min(Math.max(getTrackIndexFromScroll(), 1), slideCount)
        : getTrackIndexFromScroll();
      scrollToTrackIndex(index, "auto");
    });
    observer.observe(container);

    return () => {
      window.clearTimeout(settleTimer);
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("pointerdown", pauseFromUser);
      observer.disconnect();
    };
  }, [
    getSlideStride,
    getTrackIndexFromScroll,
    loopEnabled,
    pauseFor,
    reconcileLoopScroll,
    scrollToTrackIndex,
    slideCount,
    trackLength,
  ]);

  return {
    scrollContainerRef: scrollContainerRef as RefObject<HTMLDivElement | null>,
    logicalIndex,
    loopEnabled,
    pauseFor,
    scrollToLogicalIndex,
  };
}
