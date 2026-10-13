"use client";

import Image from "next/image";
import { SoftDialog } from "@/app/components/ui/SoftDialog";
import { useT } from "@/lib/i18n/I18nProvider";

export interface DailyCheckInMilestoneDialogProps {
  open: boolean;
  /** เช็คอินครบกี่วันถึงรับได้ (7 / 14 / 21 / 28) */
  milestoneDay: number;
  gemsReward: number;
  /** จำนวนวันที่เช็คอินแล้วในรอบ */
  checkedInCount: number;
  /** รับรางวัลขั้นนี้ไปแล้ว */
  claimed: boolean;
  onClaim: () => void;
  onOpenChange: (open: boolean) => void;
}

/** Dialog รางวัลเช็คอินสะสม — ครบวันแล้ว → ปุ่มรับ · ยังไม่ครบ → ความคืบหน้า + ปุ่มปิดใช้งาน · รับแล้ว → ปุ่มปิดใช้งาน */
export function DailyCheckInMilestoneDialog({
  open,
  milestoneDay,
  gemsReward,
  checkedInCount,
  claimed,
  onClaim,
  onOpenChange,
}: DailyCheckInMilestoneDialogProps) {
  const t = useT("rewards");
  const done = Math.min(checkedInCount, milestoneDay);
  const daysLeft = Math.max(0, milestoneDay - checkedInCount);
  const canClaim = !claimed && daysLeft === 0;
  const progressPercent = Math.round((done / milestoneDay) * 100);
  const title = t("checkIn.milestoneDialog.title", { days: milestoneDay });

  return (
    <SoftDialog open={open} onClose={() => onOpenChange(false)} title={title} closeLabel={t("actions.close")}>
      <div className="flex flex-col items-center pt-2 text-center">
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-soft)]"
          aria-hidden="true"
        >
          <div className="relative h-9 w-9">
            <Image src="/assets/check-in/diamonds.avif" alt="" fill sizes="36px" className="object-contain" />
          </div>
        </div>
        <h3 className="mt-4 text-lg font-bold text-[var(--text-on-light)]">{title}</h3>
        <p className="mt-1.5 text-base font-bold text-[var(--brand-strong)]">
          {t("checkIn.milestoneGems", { amount: gemsReward })}
        </p>
        <div className="mt-4 w-full">
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--soft-surface)]">
            <div
              className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-sm tabular-nums text-[var(--text-muted)]">
            {t("checkIn.milestoneDialog.progress", { done, total: milestoneDay })}
          </p>
        </div>
      </div>
      <button
        type="button"
        disabled={!canClaim}
        onClick={onClaim}
        className="soft-btn-primary mt-6 flex h-12 w-full items-center justify-center text-base font-semibold disabled:opacity-50"
      >
        {claimed
          ? t("checkIn.milestoneDialog.claimed")
          : canClaim
            ? t("checkIn.milestoneDialog.claim")
            : t("checkIn.milestoneDialog.daysLeft", { count: daysLeft })}
      </button>
    </SoftDialog>
  );
}
