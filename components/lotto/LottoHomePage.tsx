import { loadBankLottoFromDump, loadDashboardLottoFromDump, loadThaiLottoFromDump } from "@/lib/lotto/load-dump-snapshots";
import { loadCasinoShowcase, loadSlotShowcase, loadSportsShowcase, LOTTO_PROVIDER_SHOWCASE } from "@/lib/lotto/load-lobby-games";
import { bankLottoMock, dashboardLottoMock, thaiLottoMock } from "@/lib/lotto/mock-home-data";
import { LottoHomeContent } from "./LottoHomeContent";

/** เนื้อหาหน้าแรก (เฉพาะส่วนที่เปลี่ยนตามแท็บ) — เปลือก header / sidebar / bottom nav อยู่ใน (tabs)/layout.tsx */
export async function LottoHomePage() {
  const [thaiRaw, bankLotto, dashboardLotto, casino, slots, sports] = await Promise.all([
    loadThaiLottoFromDump(),
    loadBankLottoFromDump(),
    loadDashboardLottoFromDump(),
    loadCasinoShowcase(),
    loadSlotShowcase(),
    loadSportsShowcase(),
  ]);
  const thai = thaiRaw ?? thaiLottoMock;

  return (
    <LottoHomeContent
      thai={thai}
      bankLotto={bankLotto.length > 0 ? bankLotto : bankLottoMock}
      dashboardLotto={dashboardLotto.length > 0 ? dashboardLotto : dashboardLottoMock}
      casino={casino}
      slots={slots}
      sports={sports}
      lottoShowcase={LOTTO_PROVIDER_SHOWCASE}
    />
  );
}
