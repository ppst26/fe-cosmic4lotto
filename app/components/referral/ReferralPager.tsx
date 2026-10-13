"use client";

type ReferralPagerProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  "aria-label": string;
};

/** ตัวเปลี่ยนหน้าแบบเรียบ (ก่อนหน้า / ถัดไป) — ใช้กับตารางเพื่อนและประวัติรายได้ */
export function ReferralPager({ page, totalPages, onPageChange, "aria-label": ariaLabel }: ReferralPagerProps) {
  if (totalPages <= 1) return null;
  const btn =
    "h-9 min-w-9 rounded-[var(--radius-soft-sm)] border border-white/10 bg-[var(--soft-card)] px-3 text-sm font-semibold text-[var(--text-on-light)] disabled:opacity-40";
  return (
    <nav aria-label={ariaLabel} className="flex items-center gap-2">
      <button type="button" className={btn} disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="‹">
        ‹
      </button>
      <span className="text-sm font-semibold tabular-nums">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className={btn}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="›"
      >
        ›
      </button>
    </nav>
  );
}
