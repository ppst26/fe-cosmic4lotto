"use client";

import Link from "@/lib/i18n/navigation";
import type { LotteryResultRow } from "@/app/types/lottery";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotteryFlagOrb } from "./LotteryFlagOrb";

function MegaphoneMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
      <path
        d="M3 8.5 11 5v10L3 11.5V8.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M13 7.5c1.2.8 2 2.2 2 3.5s-.8 2.7-2 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

type LotteryLatestResultsTableProps = {
  results: LotteryResultRow[];
  resultsPageHref?: string;
};

export function LotteryLatestResultsTable({
  results,
  resultsPageHref = "/lottery/slips",
}: LotteryLatestResultsTableProps) {
  const { t, shortDate } = useLotteryI18n();
  const top3Label = t("betTypes.threeTop");
  const bottom2Label = t("betTypes.twoBottom");
  return (
    <section className="lottery-results-board w-full min-w-0" aria-labelledby="lottery-results-title">
      <div className="lottery-results-board__head mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-[var(--text-on-light)]">
          <MegaphoneMiniIcon />
          <h3
            id="lottery-results-title"
            className="text-lg font-semibold tracking-tight leading-snug sm:text-xl"
          >
            {t("results.title")}
          </h3>
        </div>
        <Link
          href={resultsPageHref}
          className="lottery-results-board__more-link shrink-0 text-xs font-semibold text-[var(--text-muted)] sm:text-sm"
        >
          {t("hub.mySlips")} &gt;&gt;
        </Link>
      </div>

      <div className="lottery-results-board__table" role="table" aria-label={t("results.tableAria")}>
        <div
          className="lottery-results-board__header grid grid-cols-[var(--lottery-results-board-cols)] items-center gap-x-2 px-[0.15rem] pb-2"
          role="row"
        >
          <span className="lottery-results-board__header-cell" role="columnheader">
            {t("results.colMarket")}
          </span>
          <span
            className="lottery-results-board__header-cell lottery-results-board__header-cell--prize text-center"
            role="columnheader"
          >
            {top3Label}
          </span>
          <span
            className="lottery-results-board__header-cell lottery-results-board__header-cell--prize text-center"
            role="columnheader"
          >
            {bottom2Label}
          </span>
          <span
            className="lottery-results-board__header-cell lottery-results-board__header-cell--date text-right"
            role="columnheader"
          >
            {t("results.colDate")}
          </span>
        </div>

        <ul
          className="lottery-results-board__body m-0 flex list-none flex-col gap-2 p-0"
          role="rowgroup"
        >
          {results.length === 0 ? (
            <li className="lottery-results-board__empty" role="row">
              <span role="cell">{t("results.empty")}</span>
            </li>
          ) : (
            results.map((row) => (
              <li
                key={row.id}
                className="lottery-results-board__row lottery-soft-card grid grid-cols-[var(--lottery-results-board-cols)] items-center gap-x-2 m-0 px-3 py-2"
                role="row"
              >
                <div
                  className="lottery-results-board__market flex min-w-0 items-center gap-2"
                  role="cell"
                >
                  <LotteryFlagOrb label={row.flagLabel} tone={row.flagTone} size="sm" />
                  <span className="lottery-results-board__market-name truncate">{t(row.titleKey)}</span>
                </div>

                <div
                  className="lottery-results-board__prize relative flex min-w-0 flex-col items-center justify-center gap-1"
                  role="cell"
                  aria-label={`${top3Label} ${row.top3}`}
                >
                  <span className="lottery-results-board__prize-label whitespace-nowrap">
                    {top3Label}
                  </span>
                  <span className="lottery-results-board__prize-value tabular-nums">{row.top3}</span>
                </div>

                <div
                  className="lottery-results-board__prize relative flex min-w-0 flex-col items-center justify-center gap-1"
                  role="cell"
                  aria-label={`${bottom2Label} ${row.bottom2}`}
                >
                  <span className="lottery-results-board__prize-label whitespace-nowrap">
                    {bottom2Label}
                  </span>
                  <span className="lottery-results-board__prize-value tabular-nums">
                    {row.bottom2}
                  </span>
                </div>

                <div
                  className="lottery-results-board__date flex min-w-0 items-center justify-end"
                  role="cell"
                >
                  <span className="lottery-results-board__date-text truncate tabular-nums">
                    {row.drawDate ? shortDate(row.drawDate, false) : t("results.today")}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
