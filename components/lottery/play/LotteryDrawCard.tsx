"use client";

import { useState } from "react";
import type { LotteryFlagTone } from "@/app/types/lottery";
import { LotteryCountdown } from "@/components/lottery/hub/LotteryFlagOrb";
import { LotteryMarketIcon } from "@/components/lottery/hub/LotteryMarketIcon";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotteryRulesModal } from "@/app/components/lottery/LotteryRulesModal";

type LotteryDrawCardProps = {
  title: string;
  drawLabel: string;
  remainingMs: number | null;
  flagLabel?: string;
  flagTone?: LotteryFlagTone;
  /** slug ตลาด — มีค่า = กดการ์ดแล้วเปิด modal กติกา / อัตราการจ่าย */
  marketSlug?: string;
};

export function LotteryDrawCard({
  title,
  drawLabel,
  remainingMs,
  flagLabel = "TH",
  flagTone = "th",
  marketSlug,
}: LotteryDrawCardProps) {
  const { t, countdown } = useLotteryI18n();
  const [rulesOpen, setRulesOpen] = useState(false);
  const className = "thai-lotto-draw lottery-soft-card flex flex-wrap items-center gap-3 p-3 sm:p-4";
  const content = (
    <>
      <LotteryMarketIcon
        marketSlug={marketSlug}
        size="lg"
        fallbackLabel={flagLabel}
        fallbackTone={flagTone}
      />
      <div className="min-w-0 flex-1">
        <h2 className="m-0 text-sm font-semibold text-[var(--text-on-light)] sm:text-base">{title}</h2>
        <p className="m-0 text-xs text-[var(--text-muted)]">{drawLabel}</p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[10px] text-[var(--text-muted)]">{t("status.closesIn")}</span>
        <LotteryCountdown
          label={remainingMs === null ? "--:--:--" : countdown(remainingMs)}
        />
      </div>
    </>
  );

  if (marketSlug) {
    return (
      <>
        <button
          type="button"
          onClick={() => setRulesOpen(true)}
          className={`${className} w-full cursor-pointer text-left`}
          aria-haspopup="dialog"
          aria-label={`${t("draw.aria")} — ${t("market.rules")}`}
        >
          {content}
        </button>
        <LotteryRulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} marketSlug={marketSlug} />
      </>
    );
  }
  return (
    <section className={className} aria-label={t("draw.aria")}>
      {content}
    </section>
  );
}
