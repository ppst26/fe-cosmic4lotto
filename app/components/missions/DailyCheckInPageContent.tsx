"use client";

import { useState } from "react";
import Image from "next/image";
import type { CheckInData } from "@/lib/api/checkIn";
import { useCheckIn } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { countCheckedInDays } from "@/lib/domain/checkIn";
import type { DailyCheckInDayReward } from "@/app/types/checkIn";
import { useT } from "@/lib/i18n/I18nProvider";
import { DailyCheckInClaimSuccessDialog } from "./DailyCheckInClaimSuccessDialog";
import { DailyCheckInMilestoneDialog } from "./DailyCheckInMilestoneDialog";

interface DailyCheckInPageContentProps {
  /** อยู่ใน hub modal — dialog ยัง portal ไป document.body (z-[100]) เสมอ */
  embedded?: boolean;
}

/** เนื้อหาเช็คอินรายวัน — ใช้ใน /missions/check-in และ hub modal */
export function DailyCheckInPageContent({ embedded = false }: DailyCheckInPageContentProps) {
  const t = useT("rewards");
  const checkIn = useCheckIn();
  return (
    <ResourceGate resource={checkIn} loadingLabel={t("checkIn.loading")} errorTitle={t("checkIn.loadError")}>
      {(data) => <DailyCheckInView key={embedded ? "embedded" : "page"} checkIn={data} />}
    </ResourceGate>
  );
}

/** เนื้อหาหลังโหลดเสร็จ — วันเริ่มต้นมาจาก API แล้วอัปเดตในเครื่องหลังกดรับ (เหมือน glass) */
function DailyCheckInView({ checkIn }: { checkIn: CheckInData }) {
  const t = useT("rewards");
  const [days, setDays] = useState<DailyCheckInDayReward[]>(checkIn.days);
  const [claimSuccessCredits, setClaimSuccessCredits] = useState<number | null>(null);
  const [milestoneDialogDay, setMilestoneDialogDay] = useState<number | null>(null);
  const [claimedMilestones, setClaimedMilestones] = useState<number[]>([]);

  const checkedInCount = countCheckedInDays(days);
  const todayReward = days.find((d) => d.status === "today");
  const isTodayClaimed = !todayReward && checkedInCount > 0;
  const daysRemainingForBonus = Math.max(0, 7 - checkedInCount);

  const handleClaim = (dayNum?: number) => {
    const targetDay = dayNum ?? todayReward?.day;
    if (!targetDay) return;
    const reward = days.find((d) => d.day === targetDay);
    if (!reward || reward.status !== "today") return;

    const nextDay = reward.day + 1;
    setDays((prev) =>
      prev.map((item) => {
        if (item.day === targetDay && item.status === "today") return { ...item, status: "claimed" };
        if (item.day === nextDay && item.status === "locked") return { ...item, status: "today" };
        return item;
      }),
    );
    setClaimSuccessCredits(reward.credits);
  };

  const activeMilestone = checkIn.milestones.find((m) => m.milestoneDay === milestoneDialogDay);

  const handleClaimMilestone = () => {
    if (!activeMilestone) return;
    if (claimedMilestones.includes(activeMilestone.milestoneDay) || checkedInCount < activeMilestone.milestoneDay) return;
    setClaimedMilestones((prev) => [...prev, activeMilestone.milestoneDay]);
    setMilestoneDialogDay(null);
    setClaimSuccessCredits(activeMilestone.gemsReward);
  };

  const progressPercent = Math.min(100, Math.max(10, (checkedInCount / 7) * 100));

  return (
    <div className="space-y-3">
      <div className="soft-panel space-y-2 p-4">
        <p className="text-sm font-semibold text-[var(--text-on-light)]">{t("checkIn.subtitle")}</p>
        <p className="text-sm text-[var(--text-muted)]">
          {t("checkIn.bonusBefore")}{" "}
          <span className="font-bold text-[var(--text-on-light)]">
            {t("checkIn.bonusDays", { count: daysRemainingForBonus })}
          </span>{" "}
          {t("checkIn.bonusAfter")}{" "}
          <span className="font-bold text-[var(--brand-strong)]">{t("checkIn.bonusGems", { amount: 20 })}</span>
        </p>
        <div className="flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--soft-surface)]">
            <div
              className="h-full rounded-full bg-[var(--brand)] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-semibold tabular-nums">
            {checkedInCount}
            <span className="font-normal text-[var(--text-muted)]"> {t("checkIn.progressTotal", { total: 7 })}</span>
          </span>
        </div>
      </div>

      <ul className="grid grid-cols-7 gap-1">
        {days.map((item) => {
          const isClaimed = item.status === "claimed";
          const isToday = item.status === "today";
          const isBig = item.isBigReward || item.day === 7;
          return (
            <li
              key={item.day}
              onClick={() => {
                if (isToday) handleClaim(item.day);
              }}
              className={`flex flex-col items-center gap-0.5 rounded-[var(--radius-soft-sm)] p-1 text-center text-[11px] ${
                isToday
                  ? "cursor-pointer bg-[var(--brand-soft)] ring-2 ring-[var(--brand)]"
                  : isClaimed
                    ? "border border-white/10 bg-[var(--soft-card)]"
                    : "bg-[var(--soft-card-elevated)]"
              }`}
            >
              <p className="text-[var(--text-muted)]">{t(item.labelKey)}</p>
              <div className="relative h-8 w-8">
                <Image
                  src={isBig ? "/assets/check-in/diamonds.avif" : "/assets/check-in/diamond.avif"}
                  alt=""
                  fill
                  sizes="32px"
                  className={`object-contain ${item.status === "locked" ? "opacity-60" : ""}`}
                />
              </div>
              <p className="font-bold tabular-nums">+{item.credits}</p>
              <p className={isToday ? "font-semibold text-[var(--brand-strong)]" : "text-[var(--text-muted)]"}>
                {t(`checkIn.dayStatus.${item.status}`)}
              </p>
            </li>
          );
        })}
      </ul>

      <section className="soft-panel space-y-3 p-4">
        <div className="text-center">
          <h3 className="text-base font-bold text-[var(--text-on-light)]">{t("checkIn.cumulativeTitle")}</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{t("checkIn.cumulativeDesc")}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {checkIn.milestones.map((m, idx) => {
            const isReached = checkedInCount >= m.milestoneDay || idx === 0;
            return (
              <button
                key={m.milestoneDay}
                type="button"
                onClick={() => setMilestoneDialogDay(m.milestoneDay)}
                aria-label={t("checkIn.milestoneDialog.title", { days: m.milestoneDay })}
                className={`flex min-h-10 cursor-pointer flex-col items-center gap-1 rounded-[var(--radius-soft-sm)] p-2 text-center ${
                  isReached ? "bg-[var(--brand-soft)]" : "bg-[var(--soft-surface)]"
                }`}
              >
                <span className="text-xs font-bold tabular-nums">
                  {t("checkIn.milestoneGems", { amount: m.gemsReward })}
                </span>
                <span className="relative h-6 w-6">
                  <Image
                    src="/assets/check-in/diamonds.avif"
                    alt=""
                    fill
                    sizes="24px"
                    className={`object-contain ${isReached ? "" : "opacity-40 grayscale"}`}
                  />
                </span>
                <span
                  className={`text-[11px] font-semibold ${isReached ? "text-[var(--text-on-light)]" : "text-[var(--text-muted)]"}`}
                >
                  {t("checkIn.milestoneDays", { days: m.milestoneDay })}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        disabled={isTodayClaimed}
        onClick={() => todayReward && handleClaim(todayReward.day)}
        className="soft-btn-primary h-11 w-full text-sm font-semibold disabled:opacity-50"
      >
        {isTodayClaimed ? t("checkIn.claimedToday") : t("checkIn.claimToday")}
      </button>

      {activeMilestone ? (
        <DailyCheckInMilestoneDialog
          open
          milestoneDay={activeMilestone.milestoneDay}
          gemsReward={activeMilestone.gemsReward}
          checkedInCount={checkedInCount}
          claimed={claimedMilestones.includes(activeMilestone.milestoneDay)}
          onClaim={handleClaimMilestone}
          onOpenChange={(open) => {
            if (!open) setMilestoneDialogDay(null);
          }}
        />
      ) : null}

      <DailyCheckInClaimSuccessDialog
        open={claimSuccessCredits !== null}
        credits={claimSuccessCredits ?? 0}
        onOpenChange={(open) => {
          if (!open) setClaimSuccessCredits(null);
        }}
      />
    </div>
  );
}
