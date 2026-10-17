import Image from "next/image";
import type { LottoCardData, ThaiLottoResults } from "@/lib/lotto/mock-home-data";
import { getLotteryArtSrc } from "./lottery-art";
import styles from "./results-rail.module.css";

type Props = {
  thai: ThaiLottoResults;
  bank: LottoCardData[];
  dashboard: LottoCardData[];
};

function MarketIcon({ id, fallback }: { id: string; fallback: string }) {
  const art = getLotteryArtSrc(id);
  return art ? (
    <Image src={art} alt="" width={28} height={28} className={styles.icon} aria-hidden unoptimized />
  ) : (
    <span className={styles.iconEmoji} aria-hidden>
      {fallback}
    </span>
  );
}

function ThaiRow({ data }: { data: ThaiLottoResults }) {
  return (
    <li className={styles.item}>
      <div className={styles.head}>
        <MarketIcon id="thailotto" fallback="🇹🇭" />
        <span className={styles.name}>หวยรัฐบาลไทย</span>
        <span className={styles.date}>{data.dateLabel}</span>
      </div>
      <div className={styles.first}>
        <span className={styles.label}>รางวัลที่ 1</span>
        <span className={styles.firstNumber}>{data.prizeFirst}</span>
      </div>
      <dl className={styles.lines}>
        <div>
          <dt>เลขหน้า 3 ตัว</dt>
          <dd>{data.frontThree.join("  ")}</dd>
        </div>
        <div>
          <dt>เลขท้าย 3 ตัว</dt>
          <dd>{data.backThree.join("  ")}</dd>
        </div>
        <div>
          <dt>เลขท้าย 2 ตัว</dt>
          <dd>{data.backTwo}</dd>
        </div>
      </dl>
    </li>
  );
}

function MarketRow({ item }: { item: LottoCardData }) {
  return (
    <li className={styles.item}>
      <div className={styles.head}>
        <MarketIcon id={item.id} fallback={item.flagEmoji} />
        <span className={styles.name}>{item.name}</span>
        <span className={styles.date}>{item.periodLabel}</span>
      </div>
      <div className={styles.pair}>
        <div className={styles.cell}>
          <span className={styles.label}>3 ตัวบน</span>
          <span className={styles.number}>{item.top3}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.label}>2 ตัวล่าง</span>
          <span className={styles.number}>{item.bottom2}</span>
        </div>
      </div>
    </li>
  );
}

/**
 * ผลหวยล่าสุดแบบแถวเรียงลง — แถบขวาของหน้าแรก (desktop กว้าง ≥1280)
 * minimal: หัวแถว (ไอคอน · ชื่อ · งวด) + ตัวเลขรางวัล ไม่ใช้การ์ดซ้อน
 */
export function ResultsRail({ thai, bank, dashboard }: Props) {
  return (
    <section className={styles.root} aria-label="ผลหวยล่าสุด">
      <h2 className={styles.title}>ผลหวยล่าสุด</h2>
      <ul className={styles.list}>
        <ThaiRow data={thai} />
        {[...bank, ...dashboard].map((item) => (
          <MarketRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
