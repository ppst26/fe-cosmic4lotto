"use client";

import Link from "@/lib/i18n/navigation";
import { useRef } from "react";
import type { LotteryCatalogEntry } from "@/app/types/lottery";
import { useLotteryCatalog } from "@/app/hooks/api/lottery";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { lotteryRulesHref } from "@/lib/lottery/rules";
import { LotteryCountdown, LotteryFlagOrb } from "@/components/lottery/hub/LotteryFlagOrb";
import { cn } from "@/lib/utils";
import { useContainedVerticalScroll } from "./useContainedVerticalScroll";

type LotteryMarketShellProps = {
  activeEntry: LotteryCatalogEntry;
  roundCount: number;
  children: React.ReactNode;
};

export function LotteryMarketShell({
  activeEntry,
  roundCount,
  children,
}: LotteryMarketShellProps) {
  const { t, label } = useLotteryI18n();
  const catalog = useLotteryCatalog();
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const roundsScrollRef = useRef<HTMLDivElement>(null);
  useContainedVerticalScroll(sidebarScrollRef);
  useContainedVerticalScroll(roundsScrollRef);

  return (
    <div
      className={cn(
        "lottery-market-shell lottery-soft-panel",
        "grid min-h-[min(70dvh,32rem)] items-stretch gap-2 overflow-hidden p-2",
        "grid-cols-[minmax(0,clamp(6.75rem,31vw,8.25rem))_minmax(0,1fr)]",
        "lg:min-h-[min(70dvh,36rem)] lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:gap-3 lg:p-3",
      )}
    >
      <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden" aria-label={t("market.sidebarAria")}>
        <div
          ref={sidebarScrollRef}
          className="lottery-market-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-0.5"
        >
          <ul className="m-0 flex list-none flex-col gap-1 p-0 lg:gap-2">
            {(catalog.data ?? []).map((entry) => {
              const isActive = entry.slug === activeEntry.slug;
              return (
                <li key={entry.slug}>
                  <Link
                    href={entry.roundsHref}
                    className={cn(
                      "lottery-market-sidebar__item lottery-soft-card flex no-underline transition-shadow",
                      "flex-col items-center gap-1 px-1 py-2 text-center",
                      "lg:min-h-[3.25rem] lg:flex-row lg:items-center lg:gap-2 lg:px-2 lg:py-2 lg:text-left",
                      isActive && "lottery-market-sidebar__item--active ring-2 ring-[var(--brand)]",
                      entry.status === "closed" && "opacity-60",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <LotteryFlagOrb label={entry.flagLabel} tone={entry.flagTone} size="sm" />
                    <span className="flex min-w-0 flex-col gap-0.5 lg:flex-1">
                      <span
                        className="line-clamp-2 text-[11px] font-semibold leading-tight text-[var(--text-on-light)] lg:text-xs"
                      >
                        {t(entry.titleKey)}
                      </span>
                      {entry.status === "closed" ? (
                        <span className="text-[10px] text-[var(--text-muted)]">{t("status.closed")}</span>
                      ) : (
                        <LotteryCountdown
                          label={label(entry.statusLabel)}
                          className="justify-center text-[10px] lg:justify-start"
                        />
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-col gap-2 overflow-hidden lg:gap-3">
        <header
          className="lottery-soft-card flex shrink-0 items-center gap-2 px-3 py-2 lg:px-4 lg:py-3"
        >
          <LotteryFlagOrb
            label={activeEntry.flagLabel}
            tone={activeEntry.flagTone}
            size="lg"
            className="hidden sm:inline-flex"
          />
          <div className="min-w-0 flex-1">
            <h2 className="m-0 text-sm font-bold text-[var(--text-on-light)] lg:text-base">
              {t(activeEntry.titleKey)}
            </h2>
            <Link
              href={lotteryRulesHref(activeEntry.slug)}
              className="mt-0.5 inline-block text-[11px] text-[var(--text-muted)] no-underline hover:text-[var(--text-primary)] hover:underline"
            >
              {t("market.rules")}
            </Link>
          </div>
        </header>

        <p className="hidden text-xs text-[var(--text-muted)] lg:block">
          {t("rounds.openCountPrefix")}{" "}
          <span className="font-bold text-[var(--text-on-light)]">{roundCount}</span>{" "}
          {t("rounds.openCountSuffix")}
        </p>

        <div
          ref={roundsScrollRef}
          className="lottery-market-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-1"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
