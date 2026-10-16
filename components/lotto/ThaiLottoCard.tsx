import Image from "next/image";
import type { ThaiLottoResults } from "@/lib/lotto/mock-home-data";
import { getLotteryArtSrc } from "./lottery-art";
import styles from "./lotto-cards.module.css";

type Props = { data: ThaiLottoResults };

export function ThaiLottoCard({ data }: Props) {
  return (
    <section className={styles.thaiLotto} aria-label="หวยรัฐบาลไทย">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span aria-hidden>🇹🇭</span>
          <h2 className={styles.title}>หวยรัฐบาลไทย</h2>
          <Image
            src={getLotteryArtSrc("thailotto")!}
            alt=""
            width={40}
            height={40}
            className={styles.titleArt}
            aria-hidden
          />
        </div>
        <p className={styles.date}>({data.dateLabel})</p>
      </div>
      <div className={styles.rowMain}>
        <Image
          src="/_nuxt/png/mascot.BBO-U5sD.png"
          alt=""
          width={80}
          height={120}
          className={styles.mascot}
        />
        <div className={styles.right}>
          <div className={styles.card}>
            <div className={styles.label}>รางวัลที่ 1</div>
            <div className={styles.resultXl}>{data.prizeFirst}</div>
          </div>
          <div className={styles.rowGap}>
            <div className={styles.col}>
              <div className={styles.card}>
                <div className={styles.label}>เลขหน้า 3 ตัว</div>
                <div className={styles.resultGroup}>
                  {data.frontThree.map((n) => (
                    <span key={n} className={styles.resultMd}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.card}>
                <div className={styles.label}>เลขท้าย 3 ตัว</div>
                <div className={styles.resultGroup}>
                  {data.backThree.map((n) => (
                    <span key={n} className={styles.resultMd}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.label}>เลขท้าย 2 ตัว</div>
            <div className={styles.resultXl}>{data.backTwo}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
