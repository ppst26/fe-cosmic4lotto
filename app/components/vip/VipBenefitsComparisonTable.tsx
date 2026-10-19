"use client";

import React, { useEffect, useRef } from "react";
import type { VipRankId } from "@/app/types/vip";
import { getVipBenefitCellValue, getVipRankIndex } from "@/app/data/vipMockData";
import { useVipBenefits, useVipRanks } from "@/app/hooks/api/member";
import { ErrorState, LoadingState } from "../ui/StatusState";
import { VipRankEmblem } from "./VipRankEmblem";
import { vipBenefitDisplayRole } from "@/lib/semanticValue";
import { toneClass } from "../ui/valueTone";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

interface VipBenefitsComparisonTableProps {
  currentRankId: VipRankId;
}

const COL_MIN = "min-w-[5.75rem] w-[5.75rem]";

/** ตารางสิทธิประโยชน์ — คอลัมน์แรก sticky เลื่อนแรงค์ซ้าย–ขวาได้ */
export function VipBenefitsComparisonTable({ currentRankId }: VipBenefitsComparisonTableProps) {
  const t = useT("vip");
  const benefits = useVipBenefits();
  const ranks = useVipRanks();
  /** ตารางโผล่หลังโหลดเสร็จ — ใช้เป็น dependency ให้เลื่อนไปคอลัมน์ระดับปัจจุบันอีกครั้ง */
  const tableReady = Boolean(benefits.data && ranks.data);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentColRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    const col = currentColRef.current;
    const scroller = scrollRef.current;
    if (!col || !scroller) return;

    const colLeft = col.offsetLeft - scroller.clientWidth / 2 + col.offsetWidth / 2;
    scroller.scrollTo({ left: Math.max(0, colLeft - 120), behavior: "smooth" });
  }, [currentRankId, tableReady]);

  if (!benefits.data || !ranks.data) {
    const failed = benefits.status === "error" ? benefits : ranks.status === "error" ? ranks : null;
    return failed ? (
      <ErrorState
        title={t("status.benefitsError")}
        description={failed.error?.message}
        primaryAction={{ label: t("status.retry"), onClick: failed.refresh }}
      />
    ) : (
      <LoadingState label={t("status.benefitsLoading")} />
    );
  }

  const { rows: benefitRows, values: benefitValues } = benefits.data;
  const vipRankTiers = ranks.data.tiers;

  return (
    <div className="space-y-2 pb-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--text-on-light)] sm:text-[0.9375rem]">
          {t("benefitsTable.title")}
        </h3>
        <p className="max-w-[9rem] text-right text-xs leading-snug text-[var(--text-muted)]">
          {t("benefitsTable.scrollHint")}
        </p>
      </div>

      <div className="soft-panel relative overflow-hidden">
        <div ref={scrollRef} className="overflow-x-auto overscroll-x-contain">
          <table className="w-max min-w-full text-xs sm:text-[0.8125rem]">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="sticky left-0 z-10 min-w-[8.25rem] bg-[var(--soft-surface)] px-3 py-3 text-left font-semibold text-[var(--text-muted)] sm:min-w-[9rem] sm:px-4">
                  {t("tabs.benefits")}
                </th>
                {vipRankTiers.map((tier) => {
                  const isCurrent = tier.id === currentRankId;
                  return (
                    <th
                      key={tier.id}
                      ref={isCurrent ? currentColRef : undefined}
                      className={cn(
                        COL_MIN,
                        "px-1 py-2 align-bottom",
                        isCurrent && "bg-[var(--brand-soft)]",
                      )}
                    >
                      <div className="flex flex-col items-center gap-1 pb-0.5">
                        <VipRankEmblem rankId={tier.id} size="sm" playing={false} />
                        <span className="text-xs font-semibold tracking-wide" style={{ color: tier.accent }}>
                          {tier.label}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-[var(--brand)] px-2 py-0.5 text-xs font-semibold text-[#2a0607]">
                            {t("tabs.myLevel")}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {benefitRows.map((row, rowIndex) => (
                <tr key={row.id} className={rowIndex % 2 === 0 ? "bg-white/[0.03]" : undefined}>
                  <td className="sticky left-0 z-10 min-w-[8.25rem] bg-[var(--soft-surface)] px-3 py-3 font-semibold text-[var(--text-on-light)] sm:min-w-[9rem] sm:px-4">
                    {t(row.labelKey)}
                  </td>
                  {vipRankTiers.map((tier) => {
                    const isCurrent = tier.id === currentRankId;
                    const locked = getVipRankIndex(tier.id) > getVipRankIndex(currentRankId);
                    const cell = getVipBenefitCellValue(row.id, tier.id, benefitValues);
                    const display = typeof cell === "string" ? cell : t(cell.labelKey);
                    return (
                      <td
                        key={tier.id}
                        className={cn(
                          toneClass(locked ? "muted" : vipBenefitDisplayRole(row.id, display)),
                          COL_MIN,
                          "px-2 py-3 text-center",
                          isCurrent && "bg-[var(--brand-soft)]/60 font-semibold",
                        )}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
