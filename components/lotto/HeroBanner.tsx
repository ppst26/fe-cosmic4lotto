"use client";

import { useMemo, useRef } from "react";
import {
  buildLoopedTrack,
  useInfiniteSnapCarousel,
} from "@/app/hooks/useInfiniteSnapCarousel";
import {
  HOME_HERO_BANNER_ASPECT,
  HOME_HERO_BANNER_SLIDES,
} from "@/lib/lotto/home-hero-banners";
import styles from "./hero-banner.module.css";

export function HeroBanner() {
  const slides = HOME_HERO_BANNER_SLIDES;
  const sectionRef = useRef<HTMLElement>(null);
  const trackItems = useMemo(() => buildLoopedTrack(slides), [slides]);

  const { scrollContainerRef, logicalIndex, loopEnabled, scrollToLogicalIndex, pauseFor } =
    useInfiniteSnapCarousel(slides.length);

  if (slides.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="แบนเนอร์โปรโมชัน"
      aria-roledescription="carousel"
    >
      <div
        ref={scrollContainerRef}
        className={styles.track}
        aria-live="polite"
      >
        {trackItems.map(({ item, key }, index) => (
          <div key={key} className={styles.slide}>
            {/* มือถือใช้ไฟล์ -sm (960px) เบากว่า ~85% · รูปแรกเท่านั้นที่ eager + fetchPriority สูง (LCP) */}
            <picture>
              <source media="(max-width: 1023px)" srcSet={item.src.replace(".avif", "-sm.avif")} type="image/avif" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                width={HOME_HERO_BANNER_ASPECT.width}
                height={HOME_HERO_BANNER_ASPECT.height}
                className={styles.image}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            </picture>
          </div>
        ))}
      </div>
      {slides.length > 1 ? (
        <div className={styles.dots} role="tablist" aria-label="เลือกแบนเนอร์">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={logicalIndex === index}
              aria-label={`แบนเนอร์ ${index + 1}`}
              className={`${styles.dot} ${logicalIndex === index ? styles.dotActive : ""}`}
              onClick={() => {
                pauseFor(12_000);
                scrollToLogicalIndex(index);
              }}
            />
          ))}
        </div>
      ) : null}
      <span className="sr-only">
        {loopEnabled
          ? `สไลด์ ${logicalIndex + 1} จาก ${slides.length}`
          : null}
      </span>
    </section>
  );
}
