import Image from "next/image";
import layout from "./lobby-layout.module.css";
import styles from "./lotto-mobile-quick.module.css";

/** แถบแทงหวย / ผลหวย / เกม — มือถือเท่านั้น (desktop ใช้ sidebar) */
export function LottoMobileQuickMenu() {
  return (
    <div className={`${layout.hideDesktop} ${styles.row}`}>
      <div className={styles.menuGroup}>
        <button type="button" className={`${styles.menuItem} ${styles.menuActive}`}>
          <Image
            src="/_nuxt/png/lotto.C5PH2443.png"
            alt=""
            width={28}
            height={28}
          />
          <span className={styles.textGold}>แทงหวย</span>
        </button>
        <button type="button" className={styles.menuItem}>
          <Image
            src="/_nuxt/png/golotto.i1Wnq1XM.png"
            alt=""
            width={28}
            height={28}
          />
          <span>ผลหวย</span>
        </button>
        <button type="button" className={styles.menuItem}>
          <Image
            src="/_nuxt/png/games.Br3sScDj.png"
            alt=""
            width={28}
            height={28}
          />
          <span>เกมอื่นๆ</span>
        </button>
      </div>
      <div className={styles.depositCol}>
        <button type="button" className={styles.btnPrimary}>
          ฝากเงิน
        </button>
        <button type="button" className={styles.btnSecondary}>
          ถอนเงิน
        </button>
      </div>
    </div>
  );
}
