"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";
import { useT } from "@/lib/i18n/I18nProvider";
import { LotteryMarketRoundsView } from "./LotteryMarketRoundsView";

/** segment ชั้นแรกใต้ /lottery ที่ไม่ใช่หน้ารายการรอบ */
const NON_MARKET_SEGMENTS = new Set(["slips", "rules"]);

/**
 * กรอบหน้ารายการรอบ (/lottery/[slug]) ที่คงอยู่ข้ามการเปลี่ยนตลาด — ใช้ใน app/[lang]/lottery/layout.tsx
 * shell + sidebar + banner ไม่ถูก mount ใหม่เมื่อกดเปลี่ยนประเภทหวย (เดิมแต่ละหน้า render shell เอง → กระพริบ)
 * หน้าอื่นใต้ /lottery (รอบแทง / โพย / กติกา) ส่ง children ผ่านตามเดิม
 */
export function LotteryMarketsLayout({ children }: { children: ReactNode }) {
  const t = useT("lottery");
  const segments = useSelectedLayoutSegments();
  const marketSlug = segments.length === 1 && !NON_MARKET_SEGMENTS.has(segments[0]) ? segments[0] : null;

  if (!marketSlug) return <>{children}</>;

  const entry = getLotteryCatalogEntry(marketSlug);
  const title = entry ? t(entry.titleKey) : t("markets.generic");

  return (
    <SubPageShell title={title} backHref="/lottery" fit>
      <LotteryMarketRoundsView marketSlug={marketSlug} />
      {children}
    </SubPageShell>
  );
}
