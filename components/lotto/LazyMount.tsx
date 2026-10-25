"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * เลื่อนการ mount (hydrate) section ใต้ fold จนเลื่อนใกล้ถึง — ลดงาน JS ตอนเปิดหน้า
 * ระหว่างรอแสดงกล่องว่างสูง `minHeight` กัน layout เลื่อน
 */
export function LazyMount({
  children,
  minHeight = 360,
  rootMargin = "600px 0px",
}: {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (ready) return <>{children}</>;
  return <div ref={ref} style={{ minHeight }} aria-hidden />;
}
