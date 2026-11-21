"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./desktop-feature-cards.module.css";

/**
 * Carousel การ์ดหวยเด่น — เลื่อนแบบ scroll-snap · จุดบอกตำแหน่ง · ปุ่มซ้าย/ขวา (desktop)
 * mobile + desktop ใช้ตัวเดียวกัน
 */
export function FeatureHeroCarousel({ children, label }: { children: ReactNode; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return;
    const step = first.offsetWidth + 8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setActive(atEnd ? count - 1 : Math.round(el.scrollLeft / step));
  }, [count]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    return () => el.removeEventListener("scroll", sync);
  }, [sync]);

  const goTo = (index: number) => {
    const el = trackRef.current;
    const target = el?.children[Math.max(0, Math.min(count - 1, index))] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={trackRef} className={styles.heroRow}>
        {children}
      </div>
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navPrev}`}
        onClick={() => goTo(active - 1)}
        aria-label="ก่อนหน้า"
        disabled={active <= 0}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navNext}`}
        onClick={() => goTo(active + 1)}
        aria-label="ถัดไป"
        disabled={active >= count - 1}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className={styles.dots}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`สไลด์ ${i + 1}`}
            aria-current={i === active}
          />
        ))}
      </div>
    </div>
  );
}
