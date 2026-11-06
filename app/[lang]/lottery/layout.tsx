import type { ReactNode } from "react";
import { ApiSeed, type ApiSeedEntry } from "@/app/components/ApiSeed";
import { LotteryMarketsLayout } from "@/components/lottery/rounds/LotteryMarketsLayout";
import { fetchLotteryCatalog, fetchThaiLottoBoard } from "@/lib/api/lotteryContent";

/** /lottery/* — seed ข้อมูลสาธารณะ + shell หน้ารายการรอบที่คงอยู่ข้ามการเปลี่ยนตลาด */
export default async function Layout({ children }: { children: ReactNode }) {
  const entries: ApiSeedEntry[] = [];
  const [thai, catalog] = await Promise.all([fetchThaiLottoBoard(), fetchLotteryCatalog()]);
  if (catalog.ok) entries.push({ key: ["lottery-catalog"], data: catalog.data });
  if (thai.ok) entries.push({ key: ["thai-lotto-board"], data: thai.data });
  return (
    <ApiSeed entries={entries}>
      <LotteryMarketsLayout>{children}</LotteryMarketsLayout>
    </ApiSeed>
  );
}
