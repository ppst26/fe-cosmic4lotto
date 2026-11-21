"use client";

import Link from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useContext, type ReactNode } from "react";
import { LottoShellFrame } from "./LottoShellChrome";
import { ShellProvidedContext } from "./shell-context";
import { PageSubHeader } from "./PageSubHeader";

export type MemberSessionMode = "none" | "default" | "gems" | "tickets" | "referral";

type SubPageShellProps = {
  title: string;
  children: ReactNode;
  nav?: "promo" | "events" | "home" | "wallet" | "live";
  /** deprecated — การกั้นหน้าที่ต้อง login ทำที่ proxy / ResourceGate */
  requiresAuth?: boolean;
  /** deprecated */
  sessionMode?: MemberSessionMode;
  /** deprecated — แถบหัวใช้ title (แบบ glass) ไม่แสดง breadcrumb แล้ว */
  breadcrumbLabel?: string;
  /** deprecated — ไม่แสดง breadcrumb แล้ว */
  parentLabel?: string;
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
export function SubPageShell({ title, children, backHref = "/", fit = false, hideBottomNav = false, compactBar = false, hideTitle = false }: SubPageShellProps) {
  const shellProvided = useContext(ShellProvidedContext);
  /** fit: มือถือซ่อน breadcrumb + h1 ใช้แถบหัวกะทัดรัดแทน (desktop เหมือนเดิม) */
  const showBar = fit || compactBar;
  const content = (
    <>
      <div className={`${fit ? `lotto-fit__content${hideBottomNav ? " lotto-fit__content--no-nav" : ""} ` : ""}mx-auto w-full max-w-[1240px]`}>
        {showBar ? (
          <div className="lotto-fit__bar lg:hidden">
            <Link href={backHref} aria-label="back" className="lotto-fit__back">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="lotto-fit__title">{title}</span>
          </div>
        ) : null}
        {/* มือถือ: แถบหัวหน้าย่อยแบบ glass (ปุ่มย้อนกลับวงกลม + ชื่อหน้ากึ่งกลาง) — หน้ากะทัดรัด/fit ใช้ lotto-fit__bar ด้านบนแทน */}
        {showBar ? null : <PageSubHeader title={title} backHref={backHref} className="-mx-3 mb-3 lg:hidden" />}
        <h1 className={`${fit || hideTitle ? "hidden " : "max-lg:hidden "}mb-4 text-xl font-semibold text-[var(--text-on-light)] sm:text-2xl`}>{title}</h1>
        {fit ? <div className="lotto-fit__body">{children}</div> : children}
      </div>
    </>
  );
  return shellProvided ? content : <LottoShellFrame fit={fit} bottomNav={!hideBottomNav}>{content}</LottoShellFrame>;
}
