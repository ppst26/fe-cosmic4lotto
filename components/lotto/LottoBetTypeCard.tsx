import Link from "next/link";
import type { LottoBetTypeItem } from "@/lib/lotto/lotto-bet-types";
import styles from "./lotto-bet-type-card.module.css";

export function LottoBetTypeCard({ item }: { item: LottoBetTypeItem }) {
  return (
    <article
      className={`${styles.card} ${item.closed ? styles.cardClosed : ""}`}
    >
      <div className={styles.top}>
        <span className={styles.flag} aria-hidden>
          {item.flagEmoji}
        </span>
        <h3 className={styles.name}>{item.name}</h3>
      </div>
      {item.statusLabel ? (
        <p className={styles.status}>{item.statusLabel}</p>
      ) : null}
      {item.closed ? (
        <span className={styles.btnDisabled}>แทงหวย</span>
      ) : (
        <Link href={item.href} className={styles.btnBet}>
          แทงหวย
        </Link>
      )}
    </article>
  );
}
