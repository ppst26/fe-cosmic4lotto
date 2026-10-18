import Image from "next/image";
import Link from "next/link";
import type { LottoBetTypeItem } from "@/lib/lotto/lotto-bet-types";
import { getLotteryArtSrc } from "./lottery-art";
import styles from "./lotto-bet-type-card.module.css";

export function LottoBetTypeCard({ item }: { item: LottoBetTypeItem }) {
  const art = getLotteryArtSrc(item.id);
  return (
    <article
      className={`motion-lift ${styles.card} ${item.closed ? styles.cardClosed : ""} ${art ? styles.cardArt : ""}`}
    >
      {art ? (
        <span className={styles.art} aria-hidden>
          <Image
            src={art}
            alt=""
            fill
            sizes="160px"
            className={styles.artImg}
          />
        </span>
      ) : null}
      <div className={styles.top}>
        {art ? null : (
          <span className={styles.flag} aria-hidden>
            {item.flagEmoji}
          </span>
        )}
        <h3 className={styles.name}>{item.name}</h3>
      </div>
      {item.statusLabel ? (
        <p className={styles.status}>{item.statusLabel}</p>
      ) : null}
      {item.closed ? (
        <span className={styles.btnDisabled}>แทงหวย</span>
      ) : (
        <Link href={item.href} className={`${styles.btnBet} motion-press`}>
          แทงหวย
        </Link>
      )}
    </article>
  );
}
