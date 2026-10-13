"use client";

import React, { useState } from "react";
import Link from "@/lib/i18n/navigation";
import { Share2, Check, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showShare?: boolean;
  shareTitle?: string;
  className?: string;
  customAction?: React.ReactNode;
}

export function Breadcrumb({
  items,
  showShare = true,
  shareTitle,
  className = "",
  customAction,
}: BreadcrumbProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = shareTitle || (items[items.length - 1]?.label ?? "CMB-Jupiter");

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard if user cancels or not allowed
      }
    }

    if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // Ignore fallback
      }
    }
  };

  return (
    <div
      className={`w-full flex items-center justify-between py-2 sm:py-2.5 text-xs sm:text-[13px] ${className}`}
    >
      {/* 1. Breadcrumbs Trail (หน้าหลัก / ชื่อหน้า) */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 sm:space-x-2 font-bold min-w-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="font-normal text-[var(--text-muted)] select-none">/</span>
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="truncate font-extrabold text-[var(--text-on-light)]"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="truncate text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="truncate text-[var(--text-muted)]">{item.label}</span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* 2. Right Side: ปุ่มแชร์ (แชร์ + Share icon) หรือ Custom Action */}
      <div className="flex items-center gap-2 shrink-0">
        {customAction}

        {showShare && (
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 border-0 bg-transparent text-xs font-bold text-[var(--text-muted)] transition-colors hover:text-[var(--brand)] active:scale-95 sm:text-[13px] cursor-pointer"
            title="แชร์หน้านี้"
          >
            <span>{copied ? "คัดลอกแล้ว!" : "แชร์"}</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
