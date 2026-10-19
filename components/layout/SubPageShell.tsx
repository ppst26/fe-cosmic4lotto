"use client";

import Link from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { LottoShellFrame } from "./LottoShellChrome";
import { useT } from "@/lib/i18n/I18nProvider";

export type MemberSessionMode = "none" | "default" | "gems" | "tickets" | "referral";

type SubPageShellProps = {
  title: string;
  children: ReactNode;
  nav?: "promo" | "events" | "home" | "wallet" | "live";
  /** deprecated — การกั้นหน้าที่ต้อง login ทำที่ proxy / ResourceGate */
  requiresAuth?: boolean;
  /** deprecated */
  sessionMode?: MemberSessionMode;
  breadcrumbLabel?: string;
  backHref?: string;
  /** มือถือ: ล็อกความสูงเท่าจอ + หัวแบบกะทัดรัด (หวย step 2/3 เหมือน glass) */
  fit?: boolean;
  /** ซ่อน bottom nav (มือถือ) เช่น หวย step ใส่ราคา */
  hideBottomNav?: boolean;
  /** มือถือ: ใช้แถบหัวกะทัดรัด (ลูกศร + ชื่อ) แทน breadcrumb/h1 โดยไม่ล็อกความสูง */
  compactBar?: boolean;
  /** ซ่อน h1 ใต้ breadcrumb (หน้าที่มี hero ของตัวเอง) */
  hideTitle?: boolean;
};

/**
 * เปลือกหน้าย่อย (ธีมมืด-ทองของ lotto) — ใช้ header / sidebar / bottom nav ชุดเดียวกับหน้าแรก
 */
export function SubPageShell({ title, children, breadcrumbLabel, backHref = "/", fit = false, hideBottomNav = false, compactBar = false, hideTitle = false }: SubPageShellProps) {
  const t = useT("nav");
  const crumb = breadcrumbLabel ?? title;
  /** fit: มือถือซ่อน breadcrumb + h1 ใช้แถบหัวกะทัดรัดแทน (desktop เหมือนเดิม) */
  const showBar = fit || compactBar;
  const desktopOnly = showBar ? "max-lg:hidden " : "";
  return (
    <LottoShellFrame fit={fit} bottomNav={!hideBottomNav}>
      <div className={`${fit ? `lotto-fit__content${hideBottomNav ? " lotto-fit__content--no-nav" : ""} ` : ""}mx-auto w-full max-w-[1240px]`}>
        {showBar ? (
          <div className="lotto-fit__bar lg:hidden">
            <Link href={backHref} aria-label="back" className="lotto-fit__back">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="lotto-fit__title">{title}</span>
          </div>
        ) : null}
        {/* breadcrumb แสดงเฉพาะมือถือ (PC ไม่ใช้) — พื้นอ่อนกว่าพื้นหลักเล็กน้อย ปุ่มย้อนกลับไม่มีพื้น */}
        <div className={`${desktopOnly}relative z-[1] -mx-3 mb-3 flex items-center gap-2 bg-white/[0.06] px-4 py-1.5 text-xs text-[var(--text-muted)] lg:hidden`}>
          <Link
            href={backHref}
            aria-label="back"
            className="inline-flex shrink-0 items-center gap-1.5 py-1.5 pr-1 font-semibold text-[var(--text-on-light)] no-underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <nav aria-label="breadcrumb" className="flex min-w-0 items-center gap-1.5">
            <Link href="/" className="shrink-0 text-[var(--text-muted)] no-underline hover:text-[var(--brand)]">
              {t("header.home")}
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate text-[var(--text-on-light)]">{crumb}</span>
          </nav>
        </div>
        <h1 className={`${fit || hideTitle ? "hidden " : desktopOnly}mb-4 text-xl font-semibold text-[var(--text-on-light)] sm:text-2xl`}>{title}</h1>
        {fit ? <div className="lotto-fit__body">{children}</div> : children}
      </div>
    </LottoShellFrame>
  );
}
