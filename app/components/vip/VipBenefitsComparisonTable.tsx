"use client";

import React, { useEffect, useRef } from "react";
import type { VipRankId } from "@/app/types/vip";
import {
  getVipBenefitCellValue,
  getVipRankIndex,
} from "@/app/data/vipMockData";
import { useVipBenefits, useVipRanks } from "@/app/hooks/api/member";
import { ErrorState, LoadingState } from "../ui/StatusState";
import { VipRankEmblem } from "./VipRankEmblem";
import { cn } from "@/lib/utils";
import { valueClass, vipBenefitValueClass } from "@/lib/semanticValue";
import { useT } from "@/lib/i18n/I18nProvider";
import s from "./vip-page.module.css";

interface VipBenefitsComparisonTableProps {
  currentRankId: VipRankId;
}

const COL_MIN = "min-w-[5.75rem] w-[5.75rem]";

/**
 * ตารางสิทธิประโยชน์ — คอลัมน์แรก sticky เลื่อนแรงค์ซ้าย–ขวาได้
 */
export function VipBenefitsComparisonTable({
  currentRankId,
}: VipBenefitsComparisonTableProps) {
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

    const colLeft =
      col.offsetLeft - scroller.clientWidth / 2 + col.offsetWidth / 2;
    scroller.scrollTo({ left: Math.max(0, colLeft - 120), behavior: "smooth" });
  }, [currentRankId, tableReady]);

  if (!benefits.data || !ranks.data) {
    const failed =
      benefits.status === "error"
        ? benefits
        : ranks.status === "error"
          ? ranks
          : null;
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
        <h3 className="text-sm font-medium text-[var(--text-primary)] sm:text-[0.9375rem]">
          {t("benefitsTable.title")}
        </h3>
        <p className="max-w-[9rem] text-right text-xs leading-snug text-[var(--text-muted)]">
          {t("benefitsTable.scrollHint")}
        </p>
      </div>

      <div className={s.benTable}>
        <div ref={scrollRef} className="overflow-x-auto overscroll-x-contain">
          <table className="w-max min-w-full text-xs sm:text-[0.8125rem]">
            <thead>
              <tr className="border-b border-[var(--vip-panel-border)]">
                <th className={s.benStickyHead}>{t("tabs.benefits")}</th>
                {vipRankTiers.map((tier) => {
                  const isCurrent = tier.id === currentRankId;
                  return (
                    <th
                      key={tier.id}
                      ref={isCurrent ? currentColRef : undefined}
                      className={cn(
                        COL_MIN,
                        "px-1 py-2 align-bottom",
                        isCurrent && s.benCurrent,
                      )}
                    >
                      <div className="flex flex-col items-center gap-1 pb-0.5">
                        <VipRankEmblem rankId={tier.id} size="sm" />
                        <span
                          className="text-xs font-medium tracking-wide"
                          style={{ color: tier.accent }}
                        >
                          {tier.label}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-[var(--cta-white-bg)] px-2 py-0.5 text-xs font-medium text-[var(--cta-white-fg)]">
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
                <tr
                  key={row.id}
                  className={rowIndex % 2 === 0 ? s.benRowAlt : undefined}
                >
                  <td className={s.benStickyCell}>{t(row.labelKey)}</td>
                  {vipRankTiers.map((tier) => {
                    const isCurrent = tier.id === currentRankId;
                    const locked =
                      getVipRankIndex(tier.id) > getVipRankIndex(currentRankId);
                    const cell = getVipBenefitCellValue(
                      row.id,
                      tier.id,
                      benefitValues,
                    );
                    const display =
                      typeof cell === "string" ? cell : t(cell.labelKey);
                    return (
                      <td
                        key={tier.id}
                        className={cn(
                          locked
                            ? valueClass(
                                "muted",
                                `${COL_MIN} px-2 py-3 text-center`,
                              )
                            : vipBenefitValueClass(
                                row.id,
                                display,
                                cn(
                                  COL_MIN,
                                  "px-2 py-3 text-center",
                                  isCurrent && cn(s.benCurrent, "font-medium"),
                                ),
                              ),
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
