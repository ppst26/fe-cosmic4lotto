import type { ReactNode } from "react";
import { LobbyTabsShell } from "@/components/lotto/LobbyTabsShell";
import { ResultsRail } from "@/components/lotto/ResultsRail";
import { loadBankLottoFromDump, loadDashboardLottoFromDump, loadThaiLottoFromDump } from "@/lib/lotto/load-dump-snapshots";
import { bankLottoMock, dashboardLottoMock, thaiLottoMock } from "@/lib/lotto/mock-home-data";

/**
 * Layout ของแท็บหมวดเกม — เปลือก (header / แบนเนอร์ / ฝาก-ถอน / เมนูหมวด / bottom nav) อยู่ที่นี่ที่เดียว
 * หน้าในกลุ่มนี้ (page.tsx) render เฉพาะเนื้อหา เพื่อไม่ให้เปลือกถูกสร้างใหม่ตอนสลับแท็บ
 */
export default async function LobbyTabsLayout({ children }: { children: ReactNode }) {
  const [thaiRaw, bankLotto, dashboardLotto] = await Promise.all([
    loadThaiLottoFromDump(),
    loadBankLottoFromDump(),
    loadDashboardLottoFromDump(),
  ]);
  const thai = thaiRaw ?? thaiLottoMock;

  return (
    <LobbyTabsShell
      rail={
        <ResultsRail
          thai={thai}
          bank={bankLotto.length > 0 ? bankLotto : bankLottoMock}
          dashboard={dashboardLotto.length > 0 ? dashboardLotto : dashboardLottoMock}
        />
      }
    >
      {children}
    </LobbyTabsShell>
  );
}
