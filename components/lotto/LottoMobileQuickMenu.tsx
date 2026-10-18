"use client";

import Image from "next/image";
import Link, { usePathname } from "@/lib/i18n/navigation";
import { useDeposit } from "@/context/DepositContext";
import { LOBBY_CATEGORIES, resolveLobbyCategory } from "./lobby-category";
import layout from "./lobby-layout.module.css";
import styles from "./lotto-mobile-quick.module.css";

/** หมวดเกม + ปุ่มฝาก/ถอน — มือถือเท่านั้น (desktop ใช้ sidebar) · หมวด active ตาม route */
export function LottoMobileQuickMenu() {
  const { openDeposit, openWithdraw } = useDeposit();
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
              className={`${styles.menuItem} ${isActive ? styles.menuActive : ""}`}
            >
              <Image src={item.icon} alt="" width={36} height={36} unoptimized />
              <span className={isActive ? styles.textGold : undefined}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={openDeposit}>
          ฝากเงิน
        </button>
        <button type="button" className={styles.btnSecondary} onClick={openWithdraw}>
          ถอนเงิน
        </button>
      </div>
    </div>
  );
}
