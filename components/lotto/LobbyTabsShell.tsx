"use client";

import type { ReactNode } from "react";
import { LottoShellFrame } from "@/components/layout/LottoShellChrome";
import { usePathname } from "@/lib/i18n/navigation";
import { DesktopFeatureCards } from "./DesktopFeatureCards";
import { HeroBanner } from "./HeroBanner";
import { LottoMobileHeroPanel, LottoMobileQuickMenu } from "./LottoMobileQuickMenu";

/**
 * เปลือกถาวรของหน้าแท็บหมวดเกม (/ · /casino · /slots · /fishing · /sport · /cards)
 * อยู่ใน layout จึงไม่ถูกสร้างใหม่เมื่อสลับแท็บ — header / แบนเนอร์ / ปุ่มฝากถอน / เมนูหมวด / bottom nav คงที่
 * เปลี่ยนเฉพาะ {children}; แถบผลหวยขวา (desktop) แสดงเฉพาะหน้าแรก
 */
export function LobbyTabsShell({ rail, children }: { rail: ReactNode; children: ReactNode }) {
  const isHome = usePathname() === "/";
  return (
    <LottoShellFrame rail={isHome ? rail : null}>
      <div className="lg:hidden">
        <LottoMobileHeroPanel>
          <HeroBanner />
        </LottoMobileHeroPanel>
      </div>
      {isHome ? (
        <div className="lg:hidden">
          <DesktopFeatureCards mobile />
        </div>
      ) : null}
      <LottoMobileQuickMenu />
      {children}
    </LottoShellFrame>
  );
}
