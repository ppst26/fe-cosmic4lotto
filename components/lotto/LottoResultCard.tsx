import Image from "next/image";
import type { LottoCardData } from "@/lib/lotto/mock-home-data";
import { getLotteryArtSrc } from "./lottery-art";
import styles from "./lotto-cards.module.css";

export function LottoResultCard({ item }: { item: LottoCardData }) {
  const art = getLotteryArtSrc(item.id);
  return (
    <article className={styles.lottoCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.flag} aria-hidden>
            {item.flagEmoji}
          </span>
          <h3 className={styles.cardTitle}>{item.name}</h3>
          {art ? (
            <Image src={art} alt="" width={40} height={40} className={styles.titleArt} aria-hidden />
          ) : null}
        </div>
        <p className={styles.cardPeriod}>{item.periodLabel}</p>
      </div>
      <div className={styles.awardsRow}>
        <div className={`${styles.prizeBox} ${styles.awardHalf}`}>
          <span className={styles.awardLabel}>3 ตัวบน</span>
          <span className={styles.awardNumber}>{item.top3}</span>
        </div>
        <div className={`${styles.prizeBox} ${styles.awardHalf}`}>
          <span className={styles.awardLabel}>2 ตัวล่าง</span>
          <span className={styles.awardNumber}>{item.bottom2}</span>
        </div>
      </div>
    </article>
  );
}
