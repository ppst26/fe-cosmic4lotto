import {
  LOTTO_BET_TYPE_SECTIONS,
  type LottoBetTypeSection,
} from "@/lib/lotto/lotto-bet-types";
import { LottoBetTypeCard } from "./LottoBetTypeCard";
import {
  LottoCarouselSlide,
  LottoPeekCarousel,
} from "./LottoPeekCarousel";
import styles from "./lotto-carousel.module.css";

type Props = {
  sections?: LottoBetTypeSection[];
  /** คอลัมน์ขวา topRow — carousel แคบลง */
  compact?: boolean;
};

function LottoBetCarouselBlock({
  section,
  compact,
}: {
  section: LottoBetTypeSection;
  compact?: boolean;
}) {
  return (
    <section
      className={`${styles.section} ${compact ? styles.sectionCompact : ""}`}
      aria-labelledby={`lotto-bet-${section.id}`}
    >
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle} id={`lotto-bet-${section.id}`}>
          {section.title}
        </h2>
      </div>
      <LottoPeekCarousel
        ariaLabel={section.title}
        compact={compact}
        mode={section.carouselMode ?? "4peek"}
      >
        {section.items.map((item) => (
          <LottoCarouselSlide key={item.id}>
            <LottoBetTypeCard item={item} />
          </LottoCarouselSlide>
        ))}
      </LottoPeekCarousel>
    </section>
  );
}

export function LottoBettingCarousels({ sections, compact }: Props) {
  const rows = sections ?? LOTTO_BET_TYPE_SECTIONS;

  return (
    <div
      className={`${styles.stack} ${compact ? styles.stackCompact : ""}`}
    >
      {rows.map((section) => (
        <LottoBetCarouselBlock
          key={section.id}
          section={section}
          compact={compact}
        />
      ))}
    </div>
  );
}
