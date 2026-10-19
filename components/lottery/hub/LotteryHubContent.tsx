"use client";

import React from "react";
import type {
  LotteryFeaturedItem,
  LotteryGridItem,
  LotteryResultRow,
} from "@/app/types/lottery";
import { useLotteryHub } from "@/app/hooks/api/lottery";
import { lotteryHrefToSlug } from "@/app/data/lotteryIconAssets";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotterySlipsEntryButton } from "@/app/components/lottery/LotterySlipsEntryButton";
import { LotteryHubMarketLink } from "./LotteryHubMarketLink";
import { LotteryLatestResultsTable } from "./LotteryLatestResultsTable";

type LotteryHubContentProps = {
  /** แสดงหัว (คำบรรยาย + ปุ่มโพยของฉัน) — ส่ง false เพื่อซ่อนทั้งหัว */
  showPageHeading?: boolean;
  /** แสดงชื่อหน้า h2 ในหัว — ปิดเมื่อหน้าห่อด้วย SubPageShell ที่มี h1 แล้ว */
  showTitle?: boolean;
  featured?: LotteryFeaturedItem[];
  gridItems?: LotteryGridItem[];
  results?: LotteryResultRow[];
};

/**
 * หน้าแรกแทงหวย — feature cards · กริดประเภท · ผลหวยล่าสุด (layout เดียวกับ glass)
 */
export function LotteryHubContent({
  showPageHeading = true,
  showTitle = true,
  featured,
  gridItems,
  results,
}: LotteryHubContentProps) {
  const { t, label } = useLotteryI18n();
  const hub = useLotteryHub();
  const resolvedFeatured = featured ?? hub.data?.featured ?? [];
  const resolvedGridItems = gridItems ?? hub.data?.grid ?? [];
  const resolvedResults = results ?? hub.data?.latest ?? [];
  /** ยังไม่มีข้อมูล — จองพื้นที่การ์ดไว้ ไม่ให้เนื้อหาด้านล่างกระโดด (CLS) */
  const pending = !hub.data && !featured && !gridItems;

  return (
    <div className="lottery-hub-theme lottery-hub flex min-w-0 flex-col gap-6 sm:gap-8">
      {showPageHeading ? (
        <header className="lottery-hub__head flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            {showTitle ? (
              <h2 className="text-lg font-semibold tracking-tight text-[var(--text-on-light)] sm:text-xl">
                {t("hub.title")}
              </h2>
            ) : null}
            <p className={`${showTitle ? "mt-1 " : ""}text-sm text-[var(--text-muted)]`}>{t("hub.subtitle")}</p>
          </div>
          <LotterySlipsEntryButton className="mt-0.5" />
        </header>
      ) : null}

      <section
        className={`lottery-hub__featured${pending ? " min-h-[21rem] sm:min-h-[7.5rem]" : ""}`}
        aria-label={t("hub.featuredAria")}
      >
        <div className="lottery-feature-grid grid grid-cols-1 gap-3 sm:grid-cols-3">
          {resolvedFeatured.map((item) => (
            <div key={item.id} className="min-w-0">
              <LotteryHubMarketLink
                href={item.href}
                marketSlug={lotteryHrefToSlug(item.href)}
                variant="feature"
                title={t(item.titleKey)}
                countdownLabel={label(item.countdownLabel)}
                fallbackLabel={item.visual === "thai-gov" ? "TH" : "YK"}
                fallbackTone={item.visual === "thai-gov" ? "th" : "gold"}
              />
            </div>
          ))}
        </div>
      </section>

      <section
        className={`lottery-hub__markets min-w-0${pending ? " min-h-[32rem] md:min-h-[14rem] lg:min-h-[6rem]" : ""}`}
        aria-label={t("hub.allMarketsAria")}
      >
        <div className="lottery-type-grid grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {resolvedGridItems.map((item) => (
            <div key={item.id} className="min-w-0">
              <LotteryHubMarketLink
                href={item.href}
                marketSlug={lotteryHrefToSlug(item.href)}
                variant="type"
                title={t(item.titleKey)}
                countdownLabel={item.countdownLabel}
                isClosed={item.status === "closed"}
                fallbackLabel={item.flagLabel}
                fallbackTone={item.flagTone}
              />
            </div>
          ))}
        </div>
      </section>

      {pending ? null : <LotteryLatestResultsTable results={resolvedResults} />}
    </div>
  );
}
