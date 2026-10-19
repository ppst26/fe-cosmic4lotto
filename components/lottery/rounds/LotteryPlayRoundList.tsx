"use client";

import Link from "@/lib/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LotteryPlayRound } from "@/app/types/lottery";
import {
  LOTTERY_LOW_FREQ_MAX_ROUNDS,
  lotteryMarketUsesRoundGrid,
} from "@/app/data/lotteryRoundsMockData";
import { formatBangkokTimeHHmm } from "@/app/components/lottery/lotteryUtils";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

type LotteryPlayRoundListProps = {
  rounds: LotteryPlayRound[];
  marketSlug: string;
  basePath: string;
};

export function LotteryPlayRoundList({ rounds, marketSlug, basePath }: LotteryPlayRoundListProps) {
  const { t, roundLabel, countdown: formatCountdown } = useLotteryI18n();
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [showAllGrid, setShowAllGrid] = useState(false);

  const useGridLayout = lotteryMarketUsesRoundGrid(marketSlug);
  const GRID_INITIAL_VISIBLE = 24;

  const cardRounds = useMemo(() => {
    if (useGridLayout) return rounds;
    return rounds.slice(0, LOTTERY_LOW_FREQ_MAX_ROUNDS);
  }, [rounds, useGridLayout]);

  useEffect(() => {
    const tick = () => setNowMs(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleGridRounds = useMemo(() => {
    if (!useGridLayout) return rounds;
    if (showAllGrid) return rounds;
    return rounds.slice(0, GRID_INITIAL_VISIBLE);
  }, [rounds, showAllGrid, useGridLayout]);

  const hiddenGridCount = useGridLayout ? Math.max(0, rounds.length - GRID_INITIAL_VISIBLE) : 0;

  if (cardRounds.length === 0 && !useGridLayout) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-muted)]">{t("rounds.empty")}</p>
    );
  }

  if (rounds.length === 0 && useGridLayout) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-muted)]">{t("rounds.empty")}</p>
    );
  }

  if (useGridLayout) {
    return (
      <div className="lottery-play-rounds lottery-play-rounds--grid-mode gap-2">
        <ul
          className="lottery-play-round-grid m-0 grid list-none grid-cols-2 gap-2 p-0 min-[480px]:grid-cols-3 md:grid-cols-4 md:gap-3"
          aria-label={t("rounds.listAria")}
        >
          {visibleGridRounds.map((round, index) => {
            const playable = round.status === "open";
            const countdown =
              nowMs === null
                ? "--:--"
                : formatCountdown(new Date(round.closeAt).getTime() - nowMs);
            const className = `lottery-play-round-grid__cell flex min-h-[5.5rem] flex-col items-center justify-center gap-1 px-1 py-2 text-center${
              playable ? " is-playable" : ""
            }${round.status === "open" ? " is-open" : ""}`;

            const inner = (
              <>
                <span className="lottery-play-round-grid__round text-xs text-[var(--text-muted)]">
                  {roundLabel(round.drawLabel) || t("round.numbered", { n: index + 1 })}
                </span>
                <span className="lottery-play-round-grid__time text-lg font-semibold leading-tight text-[var(--text-on-light)]">
                  {formatBangkokTimeHHmm(round.closeAt)}
                </span>
                <span className="lottery-play-round-grid__countdown lottery-countdown inline-flex min-w-[4.5rem] justify-center px-[0.45rem] py-[0.2rem] tabular-nums">
                  {countdown}
                </span>
              </>
            );

            return (
              <li key={round.id}>
                {playable ? (
                  <Link href={`${basePath}/${round.id}`} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <div className={className} aria-disabled="true">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {!showAllGrid && hiddenGridCount > 0 ? (
          <button
            type="button"
            className="lottery-play-rounds__expand soft-btn-outline mt-3 flex min-h-11 w-full items-center justify-center gap-1 text-sm font-semibold"
            onClick={() => setShowAllGrid(true)}
          >
            {t("rounds.showAll", { count: rounds.length })}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  }

  const openRounds = cardRounds.filter((round) => round.status === "open");

  return (
    <div className="lottery-play-rounds flex flex-col gap-3">
      {openRounds.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--text-muted)]">{t("rounds.empty")}</p>
      ) : null}
      {openRounds.map((round) => (
        <article
          key={round.id}
          className="lottery-play-round-card lottery-play-round-card--open flex flex-col items-center gap-3 p-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"
        >
          <div className="flex w-full flex-col items-center gap-1 sm:items-start">
            <p className="m-0 text-sm font-semibold text-[var(--text-on-light)]">{roundLabel(round.drawLabel)}</p>
            {nowMs !== null ? (
              <p className="lottery-countdown m-0">
                {t("status.closesInTime", { time: formatCountdown(new Date(round.closeAt).getTime() - nowMs) })}
              </p>
            ) : null}
          </div>
          <Link
            href={`${basePath}/${round.id}`}
            className="soft-btn-primary inline-flex h-11 w-full max-w-[12rem] shrink-0 items-center justify-center px-4 text-sm font-semibold sm:w-auto"
          >
            {t("rounds.play")}
          </Link>
        </article>
      ))}
    </div>
  );
}
