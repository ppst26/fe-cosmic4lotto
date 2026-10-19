import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { buildGamePlayHref } from "@/lib/gamePlayPaths";
import type { LobbyGameItem } from "@/lib/lotto/load-lobby-games";
import { gameCardEnterClassName, gameCardEnterStyle } from "@/lib/gameCardEnterMotion";
import styles from "./game-card.module.css";

type Props = {
  item: LobbyGameItem;
  variant?: "tall" | "wide";
  width?: string;
  layout?: "fixed" | "carousel";
  /** ลำดับในแถว — ใช้หน่วง stagger ตอนการ์ดเข้า (motion-game-card-enter) */
  index?: number;
};

export function LobbyGameCard({
  item,
  variant = "tall",
  width,
  layout = "fixed",
  index = 0,
}: Props) {
  const href = item.href ?? buildGamePlayHref({ id: item.id, title: item.title });
  const style = { ...(width ? ({ "--card-width": width } as React.CSSProperties) : null), ...gameCardEnterStyle(index) };

  return (
    <article
      className={`${gameCardEnterClassName("motion-lift")} ${styles.card} ${variant === "wide" ? styles.cardWide : ""} ${layout === "carousel" ? styles.cardCarousel : ""}`}
      style={style}
    >
      <Link href={href} aria-label={item.title} style={{ display: "block", color: "inherit", textDecoration: "none" }}>
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
      </Link>
    </article>
  );
}
