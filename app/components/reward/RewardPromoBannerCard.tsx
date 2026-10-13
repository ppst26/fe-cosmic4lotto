"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { RewardPromoBanner } from "@/app/types/reward";
import { useT } from "@/lib/i18n/I18nProvider";

/** แบนเนอร์โปรโมใต้ shortcut — ลิงก์ไป lucky-box / random-card */
export function RewardPromoBannerCard({
  banner,
  termsText,
  className,
}: {
  banner: RewardPromoBanner;
  termsText: string;
  className?: string;
}) {
  const t = useT("rewards");
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <article className={cn("flex flex-col gap-2", className)}>
      <Link
        href={banner.href}
        className="soft-panel relative block overflow-hidden border border-[var(--brand)]/25 bg-gradient-to-br from-[var(--Card-Normal)] to-[var(--brand-soft)] transition-transform hover:-translate-y-0.5"
      >
        <div className="flex min-h-[120px] items-center justify-between gap-3 px-4 py-4 sm:min-h-[132px]">
          <div className="min-w-0">
            <p className="text-lg font-bold uppercase tracking-wide text-[var(--brand-strong)] sm:text-xl">
              {banner.title}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-[13px]">{t(banner.subtitleKey)}</p>
          </div>
          <Image
            src={banner.imageSrc}
            alt=""
            width={120}
            height={120}
            className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
          />
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 px-0.5">
        <p className="text-sm font-medium text-[var(--text-on-light)]">{banner.title}</p>
        <button
          type="button"
          onClick={() => setTermsOpen((v) => !v)}
          aria-expanded={termsOpen}
          className="text-xs text-[var(--brand-strong)] underline-offset-2 hover:underline"
        >
          {t(banner.termsLabelKey)}
        </button>
      </div>
      {termsOpen ? (
        <p className="soft-card border border-white/10 px-3 py-2 text-xs leading-relaxed text-[var(--text-muted)]">{termsText}</p>
      ) : null}
    </article>
  );
}
