import Image from "next/image";
import type { LobbyGameItem } from "@/lib/lotto/load-lobby-games";
import styles from "./game-card.module.css";

type Props = {
  item: LobbyGameItem;
  variant?: "tall" | "wide";
  width?: string;
  layout?: "fixed" | "carousel";
};

export function LobbyGameCard({
  item,
  variant = "tall",
  width,
  layout = "fixed",
}: Props) {
  const style = width
    ? ({ "--card-width": width } as React.CSSProperties)
    : undefined;

  return (
    <article
      className={`${styles.card} ${variant === "wide" ? styles.cardWide : ""} ${layout === "carousel" ? styles.cardCarousel : ""}`}
      style={style}
    >
      <div
        className={`${styles.wrapper} ${variant === "wide" ? styles.wrapperWide : ""}`}
      >
        <Image
          src={item.image}
          alt={item.title}
          width={280}
          height={380}
          className={styles.image}
          unoptimized
        />
        <div className={styles.tags}>
          {item.live ? <span className={styles.tagLive}>สด</span> : null}
          {item.isHot ? <span className={styles.tagHot}>ฮิต</span> : null}
          {item.isNew ? <span className={styles.tagNew}>ใหม่</span> : null}
        </div>
        <span className={styles.favorite} aria-hidden>
          ♡
        </span>
        <div className={styles.players}>
          <span aria-hidden>👥</span>
          <span>{item.players.toLocaleString("en-US")}</span>
        </div>
      </div>
    </article>
  );
}
