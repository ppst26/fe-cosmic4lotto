import Image from "next/image";
import type { LobbyGameItem } from "@/lib/lotto/load-lobby-games";
import { LobbyGameCard } from "./LobbyGameCard";
import {
  LottoCarouselSlide,
  LottoPeekCarousel,
} from "./LottoPeekCarousel";
import styles from "./showcase.module.css";

type Props = {
  title: string;
  iconSrc: string;
  items: LobbyGameItem[];
  cardVariant?: "tall" | "wide";
  cardWidth?: string;
  /** carousel 7 ใบ + เลื่อนดูเพิ่ม */
  carousel?: boolean;
  showViewAll?: boolean;
};

export function GameShowcaseSection({
  title,
  iconSrc,
  items,
  cardVariant = "wide",
  cardWidth,
  carousel = false,
  showViewAll,
}: Props) {
  if (items.length === 0) return null;

  const cards = items.map((item) => (
    <LottoCarouselSlide key={item.id}>
      <LobbyGameCard
        item={item}
        variant={cardVariant}
        layout={carousel ? "carousel" : "fixed"}
      />
    </LottoCarouselSlide>
  ));

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Image
            src={iconSrc}
            alt=""
            width={40}
            height={40}
            className={styles.headerIcon}
          />
          <h2 className={styles.title}>{title}</h2>
        </div>
        {showViewAll ? (
          <button type="button" className={styles.viewAll}>
            ดูทั้งหมด
          </button>
        ) : null}
      </div>
      {carousel ? (
        <LottoPeekCarousel ariaLabel={title} mode="7grid">
          {cards}
        </LottoPeekCarousel>
      ) : (
        <div className={styles.track}>{items.map((item) => (
          <LobbyGameCard
            key={item.id}
            item={item}
            variant={cardVariant}
            width={cardWidth ?? "22%"}
          />
        ))}</div>
      )}
    </section>
  );
}
