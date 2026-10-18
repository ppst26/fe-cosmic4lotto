"use client";

import React from "react";
import { Info } from "lucide-react";
import type { VipRankId } from "@/app/types/vip";
import { getVipMaintainState, getVipPreviousRankId, getVipRankDisplayNumber } from "@/app/data/vipMockData";
import { VipRankProgressMetric } from "./VipRankProgressMetric";
import { useT } from "@/lib/i18n/I18nProvider";
import s from "./vip-page.module.css";

interface VipMaintainRankPanelProps {
  /** ต้องเป็นแรงค์ปัจจุบันของผู้เล่นเท่านั้น */
  activeRankId: VipRankId;
}

/** กล่องรักษาระดับ VIP — แท็บระดับของฉัน (แรงค์ปัจจุบัน) */
export function VipMaintainRankPanel({ activeRankId }: VipMaintainRankPanelProps) {
  const t = useT("vip");
  const maintain = getVipMaintainState(activeRankId);
  if (!maintain) return null;

  const previousRankId = getVipPreviousRankId(activeRankId);
  const downgradeVipNumber = previousRankId != null ? getVipRankDisplayNumber(previousRankId) : null;

  const subtitle =
    downgradeVipNumber != null
      ? t("maintain.subtitleWithDowngrade", { level: downgradeVipNumber })
      : t("progress.bothRequired");

  /** เน้นคำ VIP เป็นสีทอง + ไอคอน i ท้ายหัวข้อ */
  const raw = t("maintain.title");
  const at = raw.indexOf("VIP");
  const title =
    at >= 0 ? (
      <>
        {raw.slice(0, at)}
        <span className={s.hl}>VIP</span>
        {raw.slice(at + 3)}
      </>
    ) : (
      raw
    );

  return (
    <section className={s.panel}>
      <div className={s.panelHead}>
        <div className="min-w-0">
          <h3 className={s.panelTitle}>
            {title}
            <Info className={s.infoIcon} strokeWidth={1.75} aria-hidden />
          </h3>
          <p className={s.panelSub}>{subtitle}</p>
        </div>
        <div className={s.daysBox}>
          <span className={s.daysNum}>{maintain.daysRemaining}</span>
          <span className={s.daysLabel}>{t("maintain.daysRemaining")}</span>
        </div>
      </div>

      <div className={s.metrics}>
        <VipRankProgressMetric
          label={t("progress.deposit")}
          iconKind="deposit"
          progress={maintain.depositProgress}
          target={maintain.depositTarget}
        />
        <VipRankProgressMetric
          label={t("progress.turnover")}
          iconKind="turnover"
          progress={maintain.turnoverProgress}
          target={maintain.turnoverTarget}
        />
      </div>
    </section>
  );
}
