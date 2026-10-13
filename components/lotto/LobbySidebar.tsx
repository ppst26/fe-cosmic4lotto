import Image from "next/image";
import Link from "next/link";
import type { WalletSnapshot } from "@/lib/lotto/load-wallet-snapshot";
import styles from "./lobby-sidebar.module.css";

const NAV = [
  { href: "/", label: "หน้าแรก", icon: "🏠", active: true },
  { href: "/promotion", label: "โปรโมชั่น", icon: "📣" },
  { href: "/events", label: "กิจกรรม", icon: "🎁" },
];

type Props = { wallet: WalletSnapshot };

export function LobbySidebar({ wallet }: Props) {
  return (
    <aside className={styles.aside} aria-label="เมนูบัญชี">
      <div className={styles.wallet}>
        <div className={styles.walletRow}>
          <span className={styles.walletLabel}>เงิน</span>
          <span className={styles.walletValue}>
            <span className={styles.coin}>$</span> {wallet.money}
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.walletRow}>
          <span className={styles.walletLabel}>เครดิต</span>
          <span className={styles.walletValue}>{wallet.credit}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary}>
          ฝากเงิน
        </button>
        <button type="button" className={styles.btnSecondary}>
          ถอนเงิน
        </button>
      </div>

      <div className={styles.quick}>
        <button type="button" className={`${styles.quickItem} ${styles.quickActive}`}>
          <Image
            src="/_nuxt/png/lotto.C5PH2443.png"
            alt=""
            width={32}
            height={32}
          />
          <span>แทงหวย</span>
        </button>
        <button type="button" className={styles.quickItem}>
          <Image
            src="/_nuxt/png/golotto.i1Wnq1XM.png"
            alt=""
            width={32}
            height={32}
          />
          <span>ผลหวย</span>
        </button>
        <button type="button" className={styles.quickItem}>
          <Image
            src="/_nuxt/png/games.Br3sScDj.png"
            alt=""
            width={32}
            height={32}
          />
          <span>เกมอื่นๆ</span>
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${item.active ? styles.navActive : ""}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
