import Image from "next/image";
import { Trophy } from "lucide-react";
import { TOP_LEADERS, type TopLeaderItem } from "@/lib/lotto/mock-top-leaders";
import showcase from "./showcase.module.css";
import styles from "./top-leaders.module.css";

const RANK_CLASS: Record<number, string> = {
  1: styles.rank1,
  2: styles.rank2,
  3: styles.rank3,
};

function formatPrize(value: number): string {
  return `฿${value.toLocaleString("en-US")}`;
}

function LeaderCard({ item }: { item: TopLeaderItem }) {
  return (
    <article className={`motion-lift ${styles.card} ${RANK_CLASS[item.rank] ?? ""}`}>
      <div className={styles.avatarWrap}>
        <span className={styles.laurel} aria-hidden />
        <span className={styles.avatarRing}>
          <Image src={`/Avartar/${item.avatar}.webp`} alt="" width={56} height={56} className={styles.avatar} unoptimized />
        </span>
        <span className={styles.ribbon}>{item.rank}</span>
      </div>
      <p className={styles.prize}>{formatPrize(item.prize)}</p>
      <p className={styles.name}>{item.name}</p>
      <p className={styles.type}>
        <span aria-hidden>{item.flagEmoji}</span> {item.lottoType}
      </p>
      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <span className={styles.metaLabel}>เลขที่ถูก</span>
          <span className={styles.metaNumber}>{item.number}</span>
        </span>
        <span className={styles.metaItem}>
          <span className={styles.metaLabel}>รอบ</span>
          <span className={styles.metaValue}>{item.round}</span>
        </span>
      </div>
    </article>
  );
}

/** ผู้ชนะรางวัลสูงสุด 5 อันดับ (mock) — ใต้แถบตรวจผลสลากในหน้าแรก */
export function TopLeadersSection() {
  return (
    <section className={`${showcase.section} motion-reveal`} aria-label="ผู้ชนะสูงสุด">
      <div className={showcase.header}>
        <div className={showcase.headerLeft}>
          <Trophy className={styles.headIcon} strokeWidth={1.75} aria-hidden />
          <div>
            <h2 className={showcase.title}>ผู้ชนะสูงสุด</h2>
            <p className={styles.subtitle}>อัปเดตทุกวัน ร่วมแทงหวยแล้วขึ้นอันดับ 1!</p>
          </div>
        </div>
        <button type="button" className={showcase.viewAll}>
          ดูทั้งหมด
        </button>
      </div>
      <div className={styles.grid}>
        {TOP_LEADERS.map((item) => (
          <LeaderCard key={item.rank} item={item} />
        ))}
      </div>
    </section>
  );
}
