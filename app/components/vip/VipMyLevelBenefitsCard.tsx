"use client";

import React from "react";
import type { VipPlayerState } from "@/app/types/vip";
import { getVipBenefitCellValue, VIP_BENEFIT_COMPARISON_VALUES } from "@/app/data/vipMockData";
import { vipBenefitDisplayRole } from "@/lib/semanticValue";
import { toneClass } from "../ui/valueTone";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

/** สิทธิ์ในแท็บระดับของฉัน — ตรงตารางสิทธิประโยชน์ */
const MY_LEVEL_BENEFIT_ROWS: { id: string; labelKey: MessageKey<"vip"> }[] = [
  { id: "cashback", labelKey: "myLevelBenefits.cashback" },
  { id: "rolling", labelKey: "myLevelBenefits.rolling" },
  { id: "diamond-deposit", labelKey: "myLevelBenefits.diamondDeposit" },
  { id: "fast-withdraw", labelKey: "benefitRows.fastWithdraw" },
  { id: "vip-manager", labelKey: "benefitRows.vipManager" },
];

/** บล็อกสิทธิประโยชน์ของแรงค์ปัจจุบัน */
export function VipMyLevelBenefitsCard({ player }: { player: VipPlayerState }) {
  const t = useT("vip");

  return (
    <section className="soft-panel w-full min-w-0 p-4">
      <h3 className="mb-2.5 text-left text-base font-bold text-[var(--text-on-light)] sm:text-lg">
        {t("tabs.benefits")}
      </h3>
      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {MY_LEVEL_BENEFIT_ROWS.map((row) => {
          const cell = getVipBenefitCellValue(row.id, player.currentRankId, VIP_BENEFIT_COMPARISON_VALUES);
          const value = typeof cell === "string" ? cell : t(cell.labelKey);
          return (
            <li
              key={row.id}
              className="flex min-w-0 items-center gap-1.5 rounded-[var(--radius-soft-sm)] bg-[var(--soft-card-elevated)] px-2.5 py-2"
            >
              <BenefitRowIcon rowId={row.id} />
              <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-muted)]">{t(row.labelKey)}</span>
              <p
                className={toneClass(
                  vipBenefitDisplayRole(row.id, value),
                  "shrink-0 text-right text-base leading-none sm:text-lg",
                )}
              >
                {value}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function BenefitRowIcon({ rowId }: { rowId: string }) {
  const className = cn("h-5 w-5 shrink-0 text-[var(--brand-strong)]");
  switch (rowId) {
    case "cashback":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
          <path d="M7 7h10M7 12h6M7 17h4" strokeLinecap="round" />
          <circle cx="17" cy="17" r="3" />
        </svg>
      );
    case "rolling":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
          <path d="M4 18V6M4 18h16M20 6v12" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
          <path d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.5 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3z" strokeLinejoin="round" />
        </svg>
      );
  }
}
