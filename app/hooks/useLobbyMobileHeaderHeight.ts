"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * วัดความสูงแถบ header lobby มือถือ — ตั้ง --lobby-mobile-header-h ให้ fixed chrome + CategoryNav
 * ใช้ใน HomeLobbyPage · LobbyDesktopPageShell
 */
export function useLobbyMobileHeaderHeight() {
  const headerMeasureRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerMeasureRef.current;
    if (!el) return;

    const updateHeight = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setHeaderHeight(Math.ceil(h));
    };

    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shellStyle: CSSProperties | undefined =
    headerHeight > 0
      ? ({ "--lobby-mobile-header-h": `${headerHeight}px` } as CSSProperties)
      : undefined;

  return { headerMeasureRef, headerHeight, shellStyle };
}
