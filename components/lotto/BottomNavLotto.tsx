"use client";

import Image from "next/image";
import { Banknote, MessageCircle, RotateCcw, Wallet, type LucideIcon } from "lucide-react";
import Link, { usePathname } from "@/lib/i18n/navigation";
import { useDeposit } from "@/context/DepositContext";
import { useToast } from "@/context/ToastContext";
import { useT } from "@/lib/i18n/I18nProvider";
import styles from "./bottom-nav.module.css";

/**
 * เมนูล่างมือถือ: ฝาก · ถอน · [แทงหวย กลาง] · คืนยอด · ติดต่อ
 * ฝาก/ถอน เปิดหน้าต่างเดียวกับ sidebar (ถ้ายังไม่ล็อกอิน DepositProvider เปิดหน้าล็อกอินให้) · ติดต่อ = live chat ยังไม่เชื่อมต่อ → toast
 */
export function BottomNavLotto({ loggedIn }: { loggedIn?: boolean }) {
  void loggedIn;
  const t = useT("nav");
  const tCommon = useT("common");
  const { openDeposit, openWithdraw } = useDeposit();
  const { showToast } = useToast();
  const pathname = usePathname();

  const sideItem = (Icon: LucideIcon, label: string) => (
    <>
      <span className={styles.icon} data-nav-icon aria-hidden>
        <Icon size={24} strokeWidth={1.75} />
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );

  return (
    <nav className={`${styles.wrapper} lotto-bottom-nav`} aria-label={t("bottomNav.label")}>
      <div className={styles.footer}>
        <div className={styles.menu}>
          <button type="button" className={`${styles.item} motion-press`} onClick={openDeposit}>
            {sideItem(Wallet, t("bottomNav.deposit"))}
          </button>
          <button type="button" className={`${styles.item} motion-press`} onClick={openWithdraw}>
            {sideItem(Banknote, t("bottomNav.withdraw"))}
          </button>

          <Link href="/enterlotto" data-active={pathname.startsWith("/enterlotto")} className={`${styles.item} ${styles.center} motion-press`}>
            <div className={styles.badge}>
              <Image
                src="/_nuxt/png/lottoFooter.D-kpI84T.png"
                alt=""
                width={70}
                height={80}
                className={styles.badgeImg}
              />
            </div>
            <span className={styles.label}>แทงหวย</span>
          </Link>

          <Link href="/cashback" data-active={pathname.startsWith("/cashback")} className={`${styles.item} motion-press`}>
            {sideItem(RotateCcw, t("bottomNav.cashback"))}
          </Link>
          <button
            type="button"
            className={`${styles.item} motion-press`}
            onClick={() => showToast(tCommon("theme.chatUnavailable"), "info")}
          >
            {sideItem(MessageCircle, t("bottomNav.contact"))}
          </button>
        </div>
      </div>
    </nav>
  );
}
