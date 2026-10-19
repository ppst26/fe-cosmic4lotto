"use client";

import type { ThaiLottoResult } from "@/app/types/lottery";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

export function ThaiLottoResultPanel({ result }: { result: ThaiLottoResult }) {
  const { t, roundLabel } = useLotteryI18n();
  const subPrizes = [
    { id: "front3", label: t("betTypes.threeFront"), values: result.front3 },
    { id: "back3", label: t("thaiResult.back3"), values: result.back3 },
    { id: "bottom2", label: t("betTypes.twoBottom"), values: [result.bottom2] },
  ];

  return (
    <section
      className="thai-lotto-panel lottery-soft-card flex flex-col gap-3 p-3 sm:gap-4 sm:p-4"
      aria-labelledby="thai-lotto-result-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="thai-lotto-result-title"
          className="m-0 text-sm font-semibold text-[var(--text-on-light)]"
        >
          {t("thaiResult.title")}
        </h2>
        <span className="text-xs text-[var(--text-muted)]">{roundLabel(result.drawLabel)}</span>
      </div>

      <div className="thai-lotto-result__first flex flex-col items-center gap-1 rounded-[var(--radius-soft-sm)] soft-panel-bg p-3">
        <span className="text-xs text-[var(--text-muted)]">{t("thaiResult.firstPrize")}</span>
        <span className="text-2xl font-semibold tracking-widest text-[var(--brand)]">
          {result.firstPrize}
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-2 m-0">
        {subPrizes.map((prize) => (
          <div
            key={prize.id}
            className="flex flex-col items-center gap-1 rounded-[var(--radius-soft-sm)] soft-panel-bg px-1 py-3"
          >
            <dt className="text-[10px] text-[var(--text-muted)]">{prize.label}</dt>
            <dd className="m-0 flex flex-wrap justify-center gap-1 text-sm font-semibold text-[var(--text-on-light)]">
              {prize.values.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
