"use client";

import type { ReactNode } from "react";
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
export function LottoShellFrame({ children, bottomNav = true }: { children: ReactNode; bottomNav?: boolean }) {
  const { isAuthenticated } = useAuth();
  const wallet = useLottoWalletSnapshot();
  return (
    <div className="lotto-page">
      <LottoShellHeader />
      <div className={layout.pageShell}>
        {isAuthenticated ? (
          <div className={layout.sidebarSlot}>
            <LobbySidebar wallet={wallet} />
          </div>
        ) : null}
        <div className={layout.mainColumn}>
          <div className={layout.mainStack}>{children}</div>
        </div>
      </div>
      {bottomNav ? (
        <div className={layout.bottomNavSlot}>
          <BottomNavLotto loggedIn={isAuthenticated} />
        </div>
      ) : null}
    </div>
  );
}
