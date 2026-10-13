import {
  loadBankLottoFromDump,
  loadDashboardLottoFromDump,
  loadThaiLottoFromDump,
} from "@/lib/lotto/load-dump-snapshots";
import {
  loadCasinoShowcase,
  loadSlotShowcase,
  loadSportsShowcase,
  LOTTO_PROVIDER_SHOWCASE,
} from "@/lib/lotto/load-lobby-games";
import { loadWalletFromDump } from "@/lib/lotto/load-wallet-snapshot";
import {
  bankLottoMock,
  dashboardLottoMock,
  thaiLottoMock,
} from "@/lib/lotto/mock-home-data";
import { BottomNavLotto } from "./BottomNavLotto";
import { LobbySidebar } from "./LobbySidebar";
import { LottoHomeContent } from "./LottoHomeContent";
import { LottoSiteHeader } from "./LottoSiteHeader";
import layout from "./lobby-layout.module.css";

type Props = { loggedIn?: boolean };

/** หน้าแรก — component ชุดเดียวกันทุก viewport; ต่างแค่ shell (sidebar / header / bottom nav) */
export async function LottoHomePage({ loggedIn = true }: Props) {
  const thai = (await loadThaiLottoFromDump()) ?? thaiLottoMock;
  const bankLotto = await loadBankLottoFromDump();
  const dashboardLotto = await loadDashboardLottoFromDump();
  const wallet = await loadWalletFromDump();
  const casino = await loadCasinoShowcase();
  const slots = await loadSlotShowcase();
  const sports = await loadSportsShowcase();

  const contentProps = {
    thai,
    bankLotto: bankLotto.length > 0 ? bankLotto : bankLottoMock,
    dashboardLotto:
      dashboardLotto.length > 0 ? dashboardLotto : dashboardLottoMock,
    casino,
    slots,
    sports,
    lottoShowcase: LOTTO_PROVIDER_SHOWCASE,
  };

  return (
    <div className="lotto-page">
      <LottoSiteHeader
        loggedIn={loggedIn}
        wallet={wallet}
        hideWalletOnDesktop={loggedIn}
      />
      <div className={layout.pageShell}>
        {loggedIn ? (
          <div className={layout.sidebarSlot}>
            <LobbySidebar wallet={wallet} />
          </div>
        ) : null}

        <div className={layout.mainColumn}>
          <div className={layout.mainStack}>
            <LottoHomeContent {...contentProps} />
          </div>
        </div>
      </div>

      <div className={layout.bottomNavSlot}>
        <BottomNavLotto loggedIn={loggedIn} />
      </div>
    </div>
  );
}
