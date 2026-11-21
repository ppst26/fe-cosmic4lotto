"use client";

import Link from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

type PageSubHeaderProps = {
  title: string;
  backHref?: string;
  className?: string;
};

/**
 * แถบหัวหน้าย่อย — ปุ่มย้อนกลับวงกลม + ชื่อหน้ากึ่งกลาง (หน้าตาเดียวกับ glass: StandaloneSubHeader)
 * ใช้กับหน้าที่ไม่ใช่หน้าเกม เช่น โปรไฟล์ · แนะนำเพื่อน · VIP · ธุรกรรม
 */
export function PageSubHeader({ title, backHref = "/", className = "" }: PageSubHeaderProps) {
  return (
    <header className={`page-sub-header min-w-0 ${className}`}>
      <div className="relative mx-auto flex min-h-14 w-full max-w-[var(--content-max,1240px)] items-center justify-between px-4 py-2.5 sm:px-5">
        <Link href={backHref} className="cosmic-back-btn relative z-10" aria-label="back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="page-sub-header__title pointer-events-none absolute left-1/2 max-w-[70%] -translate-x-1/2 select-none truncate text-center text-white">
          {title}
        </h1>
        <div className="h-8 w-8 shrink-0" aria-hidden="true" />
      </div>
    </header>
  );
}
