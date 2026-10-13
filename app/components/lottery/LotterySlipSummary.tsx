"use client";

import Link from "@/lib/i18n/navigation";
import { Copy } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import type { LotterySlipLine, LotterySubmittedSlip } from "@/app/types/lotterySlip";
import type { LotteryMessageKey } from "@/app/types/lottery";
import { toneClass } from "@/app/components/ui/valueTone";
import { formatBaht, formatLotteryDigitsDisplay } from "./lotteryUtils";
import { useLotteryI18n } from "./useLotteryI18n";
import { formatSignedBaht, signedMoneyToneClass, slipStatusKey } from "./LotterySlipCard";

interface LotterySlipSummaryProps {
  slip: LotterySubmittedSlip;
  continuePlayHref?: string;
}

function groupSlipLines(lines: LotterySlipLine[]) {
  const groups: { typeLabelKey: LotteryMessageKey; items: LotterySlipLine[] }[] = [];
  const indexByLabel = new Map<LotteryMessageKey, number>();

  for (const line of lines) {
    const existing = indexByLabel.get(line.typeLabelKey);
    if (existing === undefined) {
      indexByLabel.set(line.typeLabelKey, groups.length);
      groups.push({ typeLabelKey: line.typeLabelKey, items: [line] });
    } else {
      groups[existing].items.push(line);
    }
  }

  return groups;
}

const PILL =
  "rounded-[var(--radius-soft-sm)] soft-panel-bg px-2 py-1 text-center text-xs font-semibold tabular-nums";

/**
 * สรุปโพยหลังส่งแทง (หัวงวด · รายการแยกประเภท · ยอดรวม · แทงต่อ)
 * โพยที่สรุปผลแล้ว: แสดงสถานะ · เวลาสรุปผล · ผลรายบรรทัด (เงินรางวัล) · ได้/เสียสุทธิ
 */
export function LotterySlipSummary({ slip, continuePlayHref }: LotterySlipSummaryProps) {
  const { showToast } = useToast();
  const { t, dateTime } = useLotteryI18n();
  const groups = groupSlipLines(slip.lines);
  const playHref = continuePlayHref ?? slip.continuePlayHref;
  const drawSchedule = dateTime(slip.drawAt);
  const purchasedLabel = dateTime(slip.purchasedAt);
  const isSettled = slip.status !== "submitted";
  const statusKey = slipStatusKey(slip, new Date());

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(slip.shortId);
      showToast(t("summary.copied"), "success", 2500);
    } catch {
      showToast(t("summary.copyFailed"), "error");
    }
  };

  return (
    <article
      className="lottery-hub-theme lottery-slip-summary flex flex-col gap-4 pb-3 pt-1"
      aria-label={t("summary.aria")}
    >
      <header className="lottery-soft-card flex flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="m-0 text-sm font-semibold text-[var(--text-on-light)]">
            {t("summary.drawDate", { date: drawSchedule })}
          </p>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-xs font-semibold text-[var(--brand)]"
            onClick={() => void handleCopyId()}
            aria-label={t("summary.copyAria")}
          >
            <span>{t("summary.slipId", { id: slip.shortId })}</span>
            <Copy className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          </button>
        </div>
        <div className="flex items-start justify-between gap-3">
          <p className="m-0 text-xs text-[var(--text-muted)]">{t("summary.purchased", { date: purchasedLabel })}</p>
          <p className="m-0 whitespace-nowrap text-xs font-semibold">
            {slip.status === "submitted" && statusKey === "waitingDraw" ? (
              <span className="text-[var(--text-on-light)]">{t("summary.submitted")}</span>
            ) : (
              <span
                className={toneClass(
                  statusKey === "won" ? "success" : statusKey === "waitingSettle" ? "warning" : "neutral",
                )}
              >
                {t(`slips.status.${statusKey}`)}
              </span>
            )}
          </p>
        </div>
        {isSettled && slip.settledAt ? (
          <p className="m-0 text-xs text-[var(--text-muted)]">
            {t("slips.card.settledAt", { date: dateTime(slip.settledAt) })}
          </p>
        ) : null}
      </header>

      <p className="m-0 text-xs text-[var(--text-muted)]">
        {t("summary.note", { note: slip.note?.trim() ? slip.note : t("summary.noNote") })}
      </p>

      <div className="flex flex-col gap-2.5">
        {groups.map((group) => (
          <section key={group.typeLabelKey} className="lottery-soft-card overflow-hidden">
            <div className="flex items-center justify-between gap-3 soft-panel-bg px-3.5 py-2.5 sm:px-4">
              <span className="text-sm font-bold text-[var(--text-on-light)]">{t(group.typeLabelKey)}</span>
              <span className="shrink-0 text-xs text-[var(--text-muted)]">
                {t("slip.itemCount", { count: group.items.length })}
              </span>
            </div>
            <ul className="m-0 list-none px-3 pb-2.5 pt-1.5 sm:px-3.5">
              {group.items.map((line) => (
                <li
                  key={`${line.typeKey}-${line.number}-${line.amount}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto_minmax(4.25rem,auto)] items-center gap-1.5 py-2"
                >
                  <span className="font-bold tabular-nums tracking-wide text-[var(--text-on-light)]">
                    {formatLotteryDigitsDisplay(line.number)}
                  </span>
                  <span className={`${PILL} min-w-[3rem] text-[var(--text-on-light)]`}>
                    {formatBaht(line.amount)}
                  </span>
                  <span className={`${PILL} min-w-[3.25rem] text-[var(--text-muted)]`}>
                    x{line.payoutRate.toLocaleString("th-TH")}
                  </span>
                  <span className={`${PILL} min-w-0${line.won === false ? " opacity-60" : ""}`}>
                    {line.won === undefined ? (
                      <span className="text-[var(--brand-strong)]">{formatBaht(line.potentialWin)}</span>
                    ) : (
                      <span className={toneClass(line.won ? "success" : "muted")}>
                        {formatBaht(line.payout ?? 0)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="lottery-soft-card grid grid-cols-2 gap-3 px-3.5 py-3.5 sm:px-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-xs text-[var(--text-muted)]">{t("summary.stake")}</span>
          <strong className="text-base font-bold tabular-nums text-[var(--text-on-light)]">
            {formatBaht(slip.totalStake)}
          </strong>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-xs text-[var(--text-muted)]">{t("summary.winLoss")}</span>
          {slip.winLoss === null ? (
            <span className="text-base text-[var(--text-muted)]">—</span>
          ) : (
            <span className={signedMoneyToneClass(slip.winLoss, "text-base font-bold")}>
              {formatSignedBaht(slip.winLoss)}
            </span>
          )}
        </div>
      </footer>

      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href="/lottery/slips"
          className="soft-btn-outline grid min-h-11 place-items-center px-3 text-center text-sm font-semibold no-underline"
        >
          {t("summary.allSlips")}
        </Link>
        <Link
          href={playHref}
          className="soft-btn-primary grid min-h-11 place-items-center px-3 text-center text-sm font-semibold no-underline"
        >
          {t("summary.continue")}
        </Link>
      </div>
    </article>
  );
}
