import type { LottoCardData } from "@/lib/lotto/mock-home-data";
import { LottoResultCard } from "./LottoResultCard";
import styles from "./lotto-cards.module.css";

type Props = {
  bank: LottoCardData[];
  dashboard: LottoCardData[];
};

export function LottoForeignResults({ bank, dashboard }: Props) {
  return (
    <>
      {bank.length > 0 ? (
        <div className={styles.bankLottoContainer}>
          <div className={styles.bankLottoGrid}>
            {bank.map((item) => (
              <LottoResultCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : null}
      {dashboard.length > 0 ? (
        <div className={styles.lottoDashboard}>
          <div className={styles.lottoGrid}>
            {dashboard.map((item) => (
              <LottoResultCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
