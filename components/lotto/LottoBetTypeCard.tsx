import Image from "next/image";
import Link from "next/link";
import type { LottoBetTypeItem } from "@/lib/lotto/lotto-bet-types";
import styles from "./lotto-bet-type-card.module.css";

/** id ประเภทหวย (lotto-bet-types) → รูปใน public/lottery — ไม่มีรูป (เช่น สลากออมสิน) ใช้ธง emoji เดิม */
const LOTTERY_ART: Record<string, string> = {
  thailotto: "ic-government-effect",
  baaclotto: "ic-baac-effect",
  yeekee5: "ic-stock_yk5-effect",
  yeekee15: "ic-stock_yk15-effect",
  yeekee30: "ic-stock_yk15-effect",
  laoslotto: "ic-laos-effect",
  hanoylotto: "ic-hanoi-effect",
  malaylotto: "ic-malay-effect",
  dowjoneslotto: "ic-stock_dow_jones-effect",
  chinalotto: "ic-stock_china-effect",
  germanlotto: "ic-stock_germany-effect",
  russialotto: "ic-stock_russia-effect",
  korealotto: "ic-stock_korea-effect",
  nikkeilotto: "ic-stock_japan-effect",
  englandlotto: "ic-stock_england-effect",
  hangsenlotto: "ic-stock_hongkong-effect",
  taiwanlotto: "ic-stock_taiwan-effect",
  singaporelotto: "ic-stock_singapore-effect",
  indialotto: "ic-stock_india-effect",
  egyptlotto: "ic-stock_egypt-effect",
};

export function LottoBetTypeCard({ item }: { item: LottoBetTypeItem }) {
  const art = LOTTERY_ART[item.id];
  return (
    <article
      className={`${styles.card} ${item.closed ? styles.cardClosed : ""} ${art ? styles.cardArt : ""}`}
    >
      {art ? (
        <span className={styles.art} aria-hidden>
          <Image
            src={`/lottery/${art}.webp`}
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
        <Link href={item.href} className={styles.btnBet}>
          แทงหวย
        </Link>
      )}
    </article>
  );
}
