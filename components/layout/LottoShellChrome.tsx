"use client";

import { ViewTransition, type ReactNode } from "react";
import { LobbySidebar } from "@/components/lotto/LobbySidebar";
import { LottoSiteHeader } from "@/components/lotto/LottoSiteHeader";
import { BottomNavLotto } from "@/components/lotto/BottomNavLotto";
import layout from "@/components/lotto/lobby-layout.module.css";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useWallet } from "@/app/hooks/api/account";

/** ยอดกระเป๋าสำหรับ header/sidebar ของหน้าแรก (รูป `{money, credit}` เดิมของ lotto) — glass มียอดเดียว: credit แสดง 0.00 */
export function useLottoWalletSnapshot() {
  const wallet = useWallet();
  return {
    money: (wallet.data?.amount ?? 0).toFixed(2),
    credit: "0.00",
  };
}

/** header ของ lotto ที่ใช้ซ้ำในหน้าย่อยทุกหน้า (ใช้ component หน้าแรกเดิม ไม่แก้ไข) */
export function LottoShellHeader() {
  const { isAuthenticated } = useAuth();
  const wallet = useLottoWalletSnapshot();
  return <LottoSiteHeader loggedIn={isAuthenticated} wallet={wallet} hideWalletOnDesktop={isAuthenticated} />;
}

/**
 * โครงหน้าย่อย: header + (sidebar เมื่อ login บน desktop) + เนื้อหา + bottom nav — เหมือนโครงหน้าแรก
 */
export function LottoShellFrame({
  children,
  bottomNav = true,
  fit = false,
}: {
  children: ReactNode;
  bottomNav?: boolean;
  /** มือถือล็อกความสูงเท่าจอ (หวย step 2/3 แบบ glass) — โซนเนื้อหาเลื่อนเองข้างใน */
  fit?: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const wallet = useLottoWalletSnapshot();
  const fitClass = (name: string) => (fit ? ` ${name}` : "");
  return (
    <div className={`lotto-page${fitClass("lotto-fit")}`}>
      <LottoShellHeader />
      <div className={`${layout.pageShell}${fitClass("lotto-fit__shell")}`}>
        {isAuthenticated ? (
          <div className={layout.sidebarSlot} style={{ viewTransitionName: "site-sidebar" }}>
            <LobbySidebar wallet={wallet} />
          </div>
        ) : null}
        <div className={`${layout.mainColumn}${fitClass("lotto-fit__col")}`}>
          <div className={`${layout.mainStack}${fitClass("lotto-fit__stack")}`}>
            {/* เปลี่ยนหน้า: เนื้อหา crossfade เบา ๆ · header/sidebar/bottom nav ตั้งชื่อไว้ให้อยู่นิ่ง */}
            <ViewTransition enter="page-enter" exit="page-exit" default="none">
              {children}
            </ViewTransition>
          </div>
        </div>
      </div>
      {bottomNav ? (
        <div className={layout.bottomNavSlot} style={{ viewTransitionName: "site-bottom-nav" }}>
          <BottomNavLotto loggedIn={isAuthenticated} />
        </div>
      ) : null}
    </div>
  );
}
