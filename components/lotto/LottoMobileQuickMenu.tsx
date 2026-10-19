"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import Link, { usePathname } from "@/lib/i18n/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useAuthUI } from "@/context/AuthUIContext";
import { useDeposit } from "@/context/DepositContext";
import { LOBBY_CATEGORIES, resolveLobbyCategory } from "./lobby-category";
import layout from "./lobby-layout.module.css";
import styles from "./lotto-mobile-quick.module.css";

/**
 * มือถือ: กล่องพื้นทึบมนครอบ แบนเนอร์ (children) + ปุ่มฝาก/ถอน
 * desktop: ไม่มีกล่อง/ปุ่ม (ใช้ sidebar) — แสดงเฉพาะ children
 */
export function LottoMobileHeroPanel({ children }: { children?: ReactNode }) {
  const { openDeposit, openWithdraw } = useDeposit();
  const { isAuthenticated } = useAuth();
  const { openLogin, openRegister } = useAuthUI();

  return (
    <div className={styles.panel}>
      {children}
      <div className={`${layout.hideDesktop} ${styles.actions}`}>
        <button type="button" className={`${styles.btnPrimary} motion-press`} onClick={isAuthenticated ? openDeposit : openLogin}>
          {isAuthenticated ? "ฝากเงิน" : "เข้าสู่ระบบ"}
        </button>
        <button type="button" className={`${styles.btnSecondary} motion-press`} onClick={isAuthenticated ? openWithdraw : openRegister}>
          {isAuthenticated ? "ถอนเงิน" : "สมัครสมาชิก"}
        </button>
      </div>
    </div>
  );
}

/** หมวดเกม — มือถือเท่านั้น (desktop ใช้ sidebar) · หมวด active ตาม route */
export function LottoMobileQuickMenu() {
  const active = resolveLobbyCategory(usePathname());

  return (
    <div className={`${layout.hideDesktop} ${styles.root}`}>
      <nav className={styles.categories} aria-label="หมวดเกม">
        {LOBBY_CATEGORIES.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`motion-press ${styles.menuItem} ${isActive ? styles.menuActive : ""}`}
            >
              <Image src={item.icon} alt="" width={28} height={28} unoptimized />
              <span className={isActive ? styles.textGold : undefined}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
