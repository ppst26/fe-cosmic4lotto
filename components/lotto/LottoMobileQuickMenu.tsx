"use client";

import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { useDeposit } from "@/context/DepositContext";
import layout from "./lobby-layout.module.css";
import styles from "./lotto-mobile-quick.module.css";

/** หมวดเกม — mock ปลายทาง: ยังไม่มีหน้ายิงปลา/กีฬา/เกมไพ่ จึงชี้หน้าใกล้เคียงไปก่อน */
const CATEGORIES = [
  { key: "lottery", label: "หวย", icon: "/assets/3d/menuicon/lotto.avif", href: "/lottery" },
  { key: "casino", label: "คาสิโน", icon: "/assets/3d/menuicon/casino.avif", href: "/casino" },
  { key: "slots", label: "สล็อต", icon: "/assets/3d/menuicon/slot.avif", href: "/slots" },
  { key: "fishing", label: "ยิงปลา", icon: "/assets/3d/menuicon/fish.avif", href: "/slots" },
  { key: "sports", label: "กีฬา", icon: "/assets/3d/menuicon/sport.avif", href: "/events" },
  { key: "cards", label: "เกมไพ่", icon: "/assets/3d/menuicon/card.avif", href: "/casino" },
] as const;

/** หมวดเกม + ปุ่มฝาก/ถอน — มือถือเท่านั้น (desktop ใช้ sidebar) */
export function LottoMobileQuickMenu() {
  const { openDeposit, openWithdraw } = useDeposit();

  return (
    <div className={`${layout.hideDesktop} ${styles.root}`}>
      <nav className={styles.categories} aria-label="หมวดเกม">
        {CATEGORIES.map((item, index) => (
          <Link
            key={item.key}
            href={item.href}
            className={`${styles.menuItem} ${index === 0 ? styles.menuActive : ""}`}
          >
            <Image src={item.icon} alt="" width={36} height={36} unoptimized />
            <span className={index === 0 ? styles.textGold : undefined}>{item.label}</span>
          </Link>
        ))}
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
