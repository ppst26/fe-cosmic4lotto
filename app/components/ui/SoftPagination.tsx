"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

interface SoftPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  "aria-label"?: string;
}

/** เลขหน้าตาราง — ปุ่มกลมสไตล์ sport (soft-card + brand เมื่อ active) */
export function SoftPagination({
  page,
  totalPages,
  onPageChange,
  className,
  "aria-label": ariaLabel,
}: SoftPaginationProps) {
  const tc = useT("common");
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}
      aria-label={ariaLabel ?? tc("pagination.label")}
    >
      <PageBtn label={tc("pagination.prev")} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        ‹
      </PageBtn>
      {pages.map((num) => (
        <PageBtn
          key={num}
          label={tc("pagination.page", { page: num })}
          active={num === page}
          onClick={() => onPageChange(num)}
        >
          {num}
        </PageBtn>
      ))}
      <PageBtn label={tc("pagination.next")} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        ›
      </PageBtn>
    </nav>
  );
}

function PageBtn({
  children,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "soft-pagination-btn flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full border-0 px-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "is-active bg-[var(--brand)] text-white"
          : "soft-panel-bg text-[var(--text-on-light)] hover:bg-[var(--brand-soft)]",
      )}
    >
      {children}
    </button>
  );
}
