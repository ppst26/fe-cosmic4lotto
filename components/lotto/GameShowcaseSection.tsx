import Image from "next/image";
import Link from "@/lib/i18n/navigation";
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
  /** ปลายทางปุ่ม «ดูทั้งหมด» */
  viewAllHref?: string;
};

/** ปลายทางปุ่ม «ดูทั้งหมด» เริ่มต้นตามหัวข้อ section (LottoHomeContent ไม่ส่ง viewAllHref) */
const DEFAULT_VIEW_ALL_HREF: Record<string, string> = {
  "คาสิโนออนไลน์": "/casino",
  "สล็อตออนไลน์": "/slots",
};

export function GameShowcaseSection({
  title,
  iconSrc,
  items,
  cardVariant = "wide",
  cardWidth,
  carousel = false,
  showViewAll,
  viewAllHref,
}: Props) {
  if (items.length === 0) return null;
  const allHref = viewAllHref ?? DEFAULT_VIEW_ALL_HREF[title];

  const cards = items.map((item, index) => (
    <LottoCarouselSlide key={item.id}>
      <LobbyGameCard
        index={index}
        item={item}
        variant={cardVariant}
        layout={carousel ? "carousel" : "fixed"}
      />
    </LottoCarouselSlide>
  ));

  return (
    <section className={`${styles.section} motion-reveal`}>
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
          allHref ? (
            <Link href={allHref} className={styles.viewAll} style={{ textDecoration: "none" }}>
              ดูทั้งหมด
            </Link>
          ) : (
            <button type="button" className={styles.viewAll}>
              ดูทั้งหมด
            </button>
          )
        ) : null}
      </div>
      {carousel ? (
        <LottoPeekCarousel ariaLabel={title} mode="7grid">
          {cards}
        </LottoPeekCarousel>
      ) : (
        <div className={styles.track}>{items.map((item, index) => (
          <LobbyGameCard
            key={item.id}
            index={index}
            item={item}
            variant={cardVariant}
            width={cardWidth ?? "22%"}
          />
        ))}</div>
      )}
    </section>
  );
}
