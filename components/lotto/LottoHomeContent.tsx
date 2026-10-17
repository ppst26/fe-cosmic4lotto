import type { LottoCardData, ThaiLottoResults } from "@/lib/lotto/mock-home-data";
import type { LobbyGameItem } from "@/lib/lotto/load-lobby-games";
import { DesktopFeatureCards } from "./DesktopFeatureCards";
import { GameShowcaseSection } from "./GameShowcaseSection";
import { HeroBanner } from "./HeroBanner";
import { LottoBettingCarousels } from "./LottoBettingCarousels";
import { LottoForeignResults } from "./LottoForeignResults";
import { LottoMobileQuickMenu } from "./LottoMobileQuickMenu";
import styles from "./lotto-cards.module.css";
import { ThaiLottoCard } from "./ThaiLottoCard";
import { TicketCheckBar } from "./TicketCheckBar";

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
  lottoShowcase,
}: LottoHomeContentProps) {
  return (
    <div className="flex flex-col gap-3">
      <HeroBanner />
      <DesktopFeatureCards />
      <LottoMobileQuickMenu />
      <div className={styles.lottoResultsWrap}>
        <div className={styles.betCarouselFull}>
          <LottoBettingCarousels />
        </div>
        <ThaiLottoCard data={thai} />
        <LottoForeignResults bank={bankLotto} dashboard={dashboardLotto} />
      </div>
      <TicketCheckBar />
      <GameShowcaseSection
        title="ค่ายหวยสุดปัง"
        iconSrc="/_nuxt/png/lottoSwiper.DzDKFnRj.png"
        items={lottoShowcase}
        cardVariant="tall"
        cardWidth="22%"
      />
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
    </div>
  );
}
