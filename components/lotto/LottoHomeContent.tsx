import type { LottoCardData, ThaiLottoResults } from "@/lib/lotto/mock-home-data";
import type { LobbyGameItem } from "@/lib/lotto/load-lobby-games";
import { DesktopFeatureCards } from "./DesktopFeatureCards";
import { GameShowcaseSection } from "./GameShowcaseSection";
import { HallOfFameSection } from "./HallOfFameSection";
import { HeroBanner } from "./HeroBanner";
import { LottoBettingCarousels } from "./LottoBettingCarousels";
import { ProviderLogoMarquee } from "./ProviderLogoMarquee";
import { LottoForeignResults } from "./LottoForeignResults";
import styles from "./lotto-cards.module.css";
import layout from "./lobby-layout.module.css";
import { ThaiLottoCard } from "./ThaiLottoCard";
import { TicketCheckBar } from "./TicketCheckBar";
import { TopLeadersSection } from "./TopLeadersSection";

export type LottoHomeContentProps = {
  thai: ThaiLottoResults;
  bankLotto: LottoCardData[];
  dashboardLotto: LottoCardData[];
  casino: LobbyGameItem[];
  slots: LobbyGameItem[];
  sports: LobbyGameItem[];
  lottoShowcase: LobbyGameItem[];
};

export function LottoHomeContent({
  thai,
  bankLotto,
  dashboardLotto,
  casino,
  slots,
  sports,
}: LottoHomeContentProps) {
  return (
    <div className="flex flex-col gap-1 lg:gap-3">
      {/* แบนเนอร์มือถืออยู่ใน (tabs) layout — ที่นี่เฉพาะ desktop */}
      <div className="hidden lg:block">
        <HeroBanner />
      </div>
      <DesktopFeatureCards />
      <div className={styles.lottoResultsWrap}>
        <div className={styles.betCarouselFull}>
          <LottoBettingCarousels />
        </div>
        <div className={layout.resultsInline}>
          <ThaiLottoCard data={thai} />
          <LottoForeignResults bank={bankLotto} dashboard={dashboardLotto} />
        </div>
      </div>
      <TicketCheckBar />
      <TopLeadersSection />
      <HallOfFameSection />
      <GameShowcaseSection
        title="คาสิโนออนไลน์"
        iconSrc="/_nuxt/png/casino-icon.DHi208DR.png"
        items={casino}
        cardVariant="wide"
        carousel
        showViewAll
      />
      <GameShowcaseSection
        title="สล็อตออนไลน์"
        iconSrc="/_nuxt/png/games.Br3sScDj.png"
        items={slots}
        cardVariant="wide"
        carousel
        showViewAll
      />
      <GameShowcaseSection
        title="กีฬาออนไลน์"
        iconSrc="/_nuxt/png/golotto.i1Wnq1XM.png"
        items={sports}
        cardVariant="wide"
        carousel
        showViewAll
      />
      <ProviderLogoMarquee />
    </div>
  );
}
