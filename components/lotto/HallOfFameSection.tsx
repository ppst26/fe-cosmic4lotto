import Image from "next/image";
import { Clover } from "lucide-react";
import { HALL_OF_FAME } from "@/lib/lotto/mock-hall-of-fame";
import showcase from "./showcase.module.css";
import styles from "./hall-of-fame.module.css";

/** Hall of Fame — ผู้ถูกรางวัลล่าสุด (mock) เป็นแถวแบบ live feed · ใต้ section ผู้ชนะสูงสุด */
export function HallOfFameSection() {
  return (
    <section className={`${showcase.section} motion-reveal`} aria-label="ผู้โชคดี">
      <div className={showcase.header}>
        <div className={showcase.headerLeft}>
          <Clover className={styles.headIcon} strokeWidth={1.75} aria-hidden />
          <div>
            <h2 className={showcase.title}>ผู้โชคดี</h2>
            <p className={styles.subtitle}>ผู้โชคดีที่ถูกรางวัลล่าสุด</p>
          </div>
        </div>
        <button type="button" className={showcase.viewAll}>
          ดูทั้งหมด
        </button>
      </div>

      <div className={styles.table} role="table" aria-label="ผู้ถูกรางวัลล่าสุด">
        <div className={`${styles.row} ${styles.headRow}`} role="row">
          <span role="columnheader">ผู้เล่น</span>
          <span role="columnheader" className={styles.colType}>ประเภทหวย</span>
          <span role="columnheader" className={styles.colRound}>รอบ</span>
          <span role="columnheader" className={styles.colNumbers}>เลขที่ถูกรางวัล</span>
        </div>
        {HALL_OF_FAME.map((item) => (
          <div key={item.id} className={styles.row} role="row">
            <span className={styles.player} role="cell">
              <Image src={`/Avartar/${item.avatar}.webp`} alt="" width={32} height={32} className={styles.avatar} unoptimized />
              <span className={styles.name}>{item.name}</span>
            </span>
            <span className={`${styles.cell} ${styles.colType}`} role="cell">
              <span aria-hidden>{item.flagEmoji}</span> {item.lottoType}
            </span>
            <span className={`${styles.cell} ${styles.colRound}`} role="cell">
              {item.round}
            </span>
            <span className={`${styles.numbers} ${styles.colNumbers}`} role="cell">
              {item.numbers.split("").map((digit, i) => (
                <span key={i} className={styles.digit}>
                  {digit}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
