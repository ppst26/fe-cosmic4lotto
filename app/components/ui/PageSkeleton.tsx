import { ViewTransition } from "react";

/**
 * Skeleton ระหว่างเปลี่ยนหน้า (ใช้ใน app/[lang]/loading.tsx) — โครง header + แบนเนอร์ + การ์ด
 * พัลส์เบา ๆ (ปิดเมื่อ reduced-motion) และ fade ออกเมื่อเนื้อหาจริงมาถึง
 */
export function PageSkeleton() {
  return (
    <ViewTransition exit="page-exit" default="none">
      <main className="w-full" aria-busy="true" aria-live="polite">
        <span className="sr-only">กำลังโหลด...</span>
        <div className="motion-skeleton h-[56px]" aria-hidden />
        <div className="motion-skeleton mt-3 h-[150px] sm:h-[220px]" aria-hidden />
        <div className="motion-skeleton mt-3 h-[44px]" aria-hidden />
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3" aria-hidden>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="motion-skeleton h-[92px]" style={{ animationDelay: `${i * 90}ms` }} />
          ))}
        </div>
      </main>
    </ViewTransition>
  );
}
