"use client";

import React, { useCallback, useState } from "react";
import { Gem, Ticket } from "lucide-react";
import Link from "@/lib/i18n/navigation";
import { useWheel } from "@/app/hooks/api/member";
import type { WheelData } from "@/lib/api/wheel";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { toneClass } from "@/app/components/ui/valueTone";
import { CosmicFortuneWheel } from "./CosmicFortuneWheel";
import { resolveWheelTheme } from "@/lib/domain/wheelTheme";
import { LuckyWheelLiveWinners } from "./LuckyWheelLiveWinners";
import { LuckyWheelPrizeHistory } from "./LuckyWheelPrizeHistory";
import { formatGemsBalance } from "@/lib/format";
import type { WheelPrizeHistoryRow, WheelSegment, WheelSpinMethod } from "@/app/types/reward";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * หน้าเล่นวงล้อพารวย — โหลดข้อมูลวงล้อแล้วส่งให้ LuckyWheelPlay (state เริ่มต้นมาจากข้อมูลที่โหลดแล้ว)
 */
export function LuckyWheelPageContent({ embedded = false }: { embedded?: boolean }) {
  const t = useT("rewards");
  const wheel = useWheel();
  return (
    <ResourceGate resource={wheel} loadingLabel={t("wheel.loading")} errorTitle={t("wheel.loadError")}>
      {(data) => <LuckyWheelPlay wheel={data} embedded={embedded} />}
    </ResourceGate>
  );
}

/** ตัวเล่นวงล้อพารวย — mobile-first, desktop แยก 3 คอลัมน์ (ประวัติ · วงล้อ · ผู้โชคดี) */
function LuckyWheelPlay({ wheel, embedded }: { wheel: WheelData; embedded: boolean }) {
  const t = useT("rewards");
  const segmentDeg = 360 / wheel.segments.length;
  /** เวลาหมุนจากธีม — ใช้ทั้ง transition ของวงและจังหวะประกาศผล */
  const spinDurationMs = resolveWheelTheme(wheel.theme).spinDurationMs;
  const [gemsBalance, setGemsBalance] = useState(wheel.initialGems);
  const [ticketCount, setTicketCount] = useState(wheel.initialTickets);
  const [spinMethod, setSpinMethod] = useState<WheelSpinMethod>("ticket");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [recentHistoryRows, setRecentHistoryRows] = useState<WheelPrizeHistoryRow[]>([]);

  const currentGemsCost = wheel.gemsPerSpin;
  const currentTicketCost = wheel.ticketsPerSpin;

  const canAfford =
    spinMethod === "gems"
      ? gemsBalance >= currentGemsCost
      : ticketCount >= currentTicketCost && ticketCount > 0;

  const handleSpin = useCallback(() => {
    if (spinning || !canAfford) return;

    const targetIndex = Math.floor(Math.random() * wheel.segments.length);
    const segment: WheelSegment = wheel.segments[targetIndex];
    const extraTurns = 5 * 360;
    const targetAngle = 360 - targetIndex * segmentDeg - segmentDeg / 2;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (targetAngle - currentMod + 360) % 360;
    const nextRotation = rotation + extraTurns + delta;

    if (spinMethod === "gems") {
      setGemsBalance((b) => Math.max(0, b - currentGemsCost));
    } else {
      setTicketCount((c) => Math.max(0, c - currentTicketCost));
    }

    setSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setLastWin(t("wheel.winMessage", { prize: segment.label }));
      const row: WheelPrizeHistoryRow = {
        id: `ph-${Date.now()}`,
        atLabel: t("wheel.justNow"),
        prizeKind: segment.kind,
        prizeName: t(`wheel.prizeKind.${segment.kind}`),
        amount: segment.label.replace(/[^\d.]/g, "") || "—",
        method: spinMethod,
      };
      setRecentHistoryRows((prev) => [row, ...prev].slice(0, 5));
    }, spinDurationMs);
  }, [t, spinDurationMs, canAfford, currentGemsCost, currentTicketCost, rotation, segmentDeg, spinMethod, spinning, wheel.segments]);

  const badgeClass =
    "inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--soft-card-elevated)] px-3 text-[var(--text-on-light)] shadow-[var(--shadow-soft-sm)]";
  const helperLinkClass =
    "mt-2.5 cursor-pointer border-0 bg-transparent text-xs font-semibold text-[var(--text-muted)] underline underline-offset-4 hover:text-[var(--text-primary)]";

  return (
    <div className={cn("flex flex-col gap-6 pb-4", embedded && "gap-4")}>
      {!embedded ? (
        <p className="text-center text-xs text-[var(--text-muted)] sm:text-[13px]">{t("wheel.subtitle")}</p>
      ) : null}

      <div
        className={cn(
          "w-full",
          "lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,26rem)_minmax(0,15rem)] lg:items-center lg:justify-center lg:gap-x-5",
          "xl:grid-cols-[17rem_minmax(0,28rem)_17rem] xl:gap-x-6",
        )}
      >
        <aside className="hidden min-w-0 self-center lg:block">
          <LuckyWheelPrizeHistory extraRows={recentHistoryRows} variant="sidebar" />
        </aside>

        <div className="flex w-full min-w-0 flex-col items-center">
          <div className="relative flex w-full max-w-[380px] flex-col items-center justify-center pt-2 sm:max-w-[420px]">
            <div className="mb-2 flex w-full items-center justify-between gap-3 px-0.5 sm:px-1">
              <Link href="/gems-store" className={cn(badgeClass, "no-underline")} aria-label={t("wheel.gemsBalanceAria")}>
                <Gem className="h-3.5 w-3.5 shrink-0 text-[var(--brand-strong)]" aria-hidden />
                <span className={toneClass("accent", "text-xs tracking-tight")}>{formatGemsBalance(gemsBalance)}</span>
              </Link>
              <div className={badgeClass} aria-label={t("wheel.ticketsAria")}>
                <Ticket className="h-3.5 w-3.5 shrink-0 text-[var(--brand-strong)]" aria-hidden />
                <span className="text-xs font-semibold tabular-nums tracking-tight">{ticketCount}</span>
              </div>
            </div>
            <CosmicFortuneWheel
              segments={wheel.segments}
              rotationDeg={rotation}
              spinning={spinning}
              onCenterClick={handleSpin}
              centerDisabled={!canAfford}
              theme={wheel.theme}
            />
          </div>

          {/* แท็บเลือกวิธีหมุน */}
          <div
            role="tablist"
            aria-label={t("wheel.methodTabsAria")}
            className="my-3.5 grid w-full max-w-[380px] grid-cols-2 gap-1.5 rounded-[var(--radius-soft-sm)] bg-[var(--soft-card-elevated)] p-1.5 sm:max-w-[420px]"
          >
            {(
              [
                { id: "gems" as const, label: t("wheel.methodGems", { cost: wheel.gemsPerSpin.toFixed(2) }) },
                { id: "ticket" as const, label: t("wheel.methodTicket", { cost: wheel.ticketsPerSpin }) },
              ] as const
            ).map((tab) => {
              const isActive = spinMethod === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSpinMethod(tab.id)}
                  className={cn(
                    "min-h-9 cursor-pointer rounded-[var(--radius-soft-sm)] border-0 px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
                    isActive
                      ? "bg-[var(--brand)] text-[#2a0607]"
                      : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-on-light)]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ปุ่มหมุน */}
          <div className="flex w-full max-w-[340px] flex-col items-center">
            <button
              type="button"
              disabled={spinning}
              onClick={() => {
                if (!canAfford) {
                  if (spinMethod === "ticket") setSpinMethod("gems");
                  return;
                }
                handleSpin();
              }}
              className={cn(
                "soft-btn-primary flex w-full flex-col items-center justify-center gap-0.5 py-2.5 text-sm font-semibold disabled:opacity-60",
                !canAfford && "opacity-60",
              )}
            >
              <span>{spinning ? t("wheel.spinning") : t("wheel.spinNow")}</span>
              <span className="text-[11px] font-normal opacity-90">
                {spinMethod === "ticket"
                  ? t("wheel.useTickets", { count: wheel.ticketsPerSpin })
                  : t("wheel.useGems", { amount: wheel.gemsPerSpin.toFixed(2) })}
              </span>
            </button>

            {spinMethod === "ticket" && ticketCount <= 0 ? (
              <button type="button" onClick={() => setSpinMethod("gems")} className={helperLinkClass}>
                {t("wheel.noTickets")}
              </button>
            ) : spinMethod === "gems" && gemsBalance < currentGemsCost ? (
              <Link href="/gems-store" className={cn(helperLinkClass, "no-underline hover:underline")}>
                {t("wheel.notEnoughGems")}
              </Link>
            ) : (
              <span className="mt-2.5 text-xs text-[var(--text-muted)]">{t("wheel.hint")}</span>
            )}

            {lastWin ? (
              <div className={toneClass("reward", "mt-2 animate-fade-in text-center text-xs")} role="status">
                {lastWin}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="hidden min-w-0 self-center lg:block">
          <LuckyWheelLiveWinners variant="sidebar" />
        </aside>
      </div>

      {/* มือถือ — ตารางใต้วงล้อ */}
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 pt-4 lg:hidden">
        <LuckyWheelPrizeHistory extraRows={recentHistoryRows} />
        <LuckyWheelLiveWinners />
      </div>

      <p className="pt-2 text-center text-xs text-[var(--text-muted)]">{t("wheel.sampleNote")}</p>
    </div>
  );
}
