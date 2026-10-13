"use client";

import Link from "@/lib/i18n/navigation";
import type {
  LotteryFeaturedItem,
  LotteryGridItem,
  LotteryResultRow,
} from "@/app/types/lottery";
import { useLotteryHub } from "@/app/hooks/api/lottery";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotterySlipsEntryButton } from "@/app/components/lottery/LotterySlipsEntryButton";
import { LotteryCountdown, LotteryFlagOrb } from "./LotteryFlagOrb";
import { LotteryLatestResultsTable } from "./LotteryLatestResultsTable";

type LotteryHubContentProps = {
  showPageHeading?: boolean;
  featured?: LotteryFeaturedItem[];
  gridItems?: LotteryGridItem[];
  results?: LotteryResultRow[];
};

export function LotteryHubContent({
  showPageHeading = true,
  featured,
  gridItems,
  results,
}: LotteryHubContentProps) {
  const { t, label } = useLotteryI18n();
  const hub = useLotteryHub();
  const resolvedFeatured = featured ?? hub.data?.featured ?? [];
  const resolvedGridItems = gridItems ?? hub.data?.grid ?? [];
  const resolvedResults = results ?? hub.data?.latest ?? [];

  return (
    <div className="lottery-hub-theme lottery-hub flex min-w-0 flex-col gap-5 sm:gap-6">
      {showPageHeading ? (
        <header className="lottery-hub__head flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-[var(--text-on-light)] sm:text-xl">
              {t("hub.title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{t("hub.subtitle")}</p>
          </div>
          <LotterySlipsEntryButton className="mt-0.5" />
        </header>
      ) : null}

      <section className="lottery-hub__featured" aria-label={t("hub.featuredAria")}>
        <div className="lottery-feature-grid grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
          {resolvedFeatured.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`lottery-feature-card lottery-soft-card lottery-feature-card--${item.visual} flex min-h-[5.5rem] items-center gap-3 px-4 py-3`}
            >
              {item.visual === "thai-gov" ? (
                <LotteryFlagOrb label="TH" tone="th" size="lg" />
              ) : (
                <span
                  className="lottery-feature-card__yiki relative h-[3.25rem] w-[3.25rem] shrink-0"
                  aria-hidden="true"
                >
                  <span className="lottery-feature-card__yiki-ball grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full text-sm font-bold">
                    YK
                  </span>
                  <span className="lottery-feature-card__yiki-coin absolute right-[-0.15rem] bottom-0 h-5 w-5 rounded-full" />
                </span>
              )}
              <span className="lottery-feature-card__text flex min-w-0 flex-col items-start gap-1">
                <span className="lottery-feature-card__title font-semibold">{t(item.titleKey)}</span>
                <LotteryCountdown label={label(item.countdownLabel)} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lottery-hub__markets min-w-0" aria-label={t("hub.allMarketsAria")}>
        <div className="lottery-type-grid grid grid-cols-2 gap-2 md:grid-cols-3">
          {resolvedGridItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="lottery-type-card lottery-soft-card flex min-h-[4.25rem] items-center gap-2 px-3 py-2"
            >
              <LotteryFlagOrb label={item.flagLabel} tone={item.flagTone} size="sm" />
              <span className="lottery-type-card__body flex min-w-0 flex-col gap-0.5">
                <span className="lottery-type-card__title truncate text-sm font-semibold">
                  {t(item.titleKey)}
                </span>
                {item.status === "closed" ? (
                  <span className="lottery-type-card__closed text-xs">{t("status.closed")}</span>
                ) : (
                  <LotteryCountdown label={item.countdownLabel ?? "—"} />
                )}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <LotteryLatestResultsTable results={resolvedResults} />
    </div>
  );
}
