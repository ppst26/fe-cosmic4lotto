"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { VipPlayerState } from "@/app/types/vip";
import { getVipBenefitCellValue } from "@/app/data/vipMockData";
import { useVipBenefits } from "@/app/hooks/api/member";
import { vipBenefitValueClass } from "@/lib/semanticValue";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import s from "./vip-page.module.css";

const NO_BENEFIT_VALUES: Record<string, never> = {};

/** 4 สิทธิเด่นของแรงค์ปัจจุบัน — ตรงตารางสิทธิประโยชน์ */
const TILES: {
  id: string;
  labelKey: MessageKey<"vip">;
  valueKey?: MessageKey<"vip">;
}[] = [
  { id: "cashback", labelKey: "myLevelBenefits.cashback" },
  { id: "rolling", labelKey: "myLevelBenefits.rolling" },
  { id: "diamond-deposit", labelKey: "tiles.depositGems" },
  {
    id: "fast-withdraw",
    labelKey: "tiles.fastWithdraw",
    valueKey: "tiles.instant",
  },
];

/**
 * บล็อกสิทธิประโยชน์ของแรงค์ปัจจุบัน — 4 ช่อง + ปุ่มดูทั้งหมด
 */
export function VipMyLevelBenefitsCard({
  player,
  onViewAll,
}: {
  player: VipPlayerState;
  onViewAll?: () => void;
}) {
  const t = useT("vip");
  /** ค่าสิทธิประโยชน์จาก API (แท็บสิทธิถูกอุ่น cache ไว้แล้ว) — ยังไม่มีข้อมูลแสดง "—" */
  const benefitValues = useVipBenefits().data?.values ?? NO_BENEFIT_VALUES;

  return (
    <section className={s.panel}>
      <div className={s.benHead}>
        <h3 className={s.panelTitle}>{t("tabs.benefits")}</h3>
        {onViewAll ? (
          <button type="button" className={s.viewAll} onClick={onViewAll}>
            {t("viewAll")}
            <ChevronRight size={16} aria-hidden />
          </button>
        ) : null}
      </div>
      <ul className={s.tiles}>
        {TILES.map((tile) => {
          const cell = getVipBenefitCellValue(
            tile.id,
            player.currentRankId,
            benefitValues,
          );
          const raw = typeof cell === "string" ? cell : t(cell.labelKey);
          const value = tile.valueKey ? t(tile.valueKey) : raw;
          return (
            <li key={tile.id} className={s.tile}>
              <TileIcon id={tile.id} />
              <span className={vipBenefitValueClass(tile.id, raw, s.tileValue)}>
                {value}
              </span>
              <span className={s.tileLabel}>{t(tile.labelKey)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** ภาพ 3D จาก public/assets · ที่เหลือเป็น SVG เส้น */
function TileIcon({ id }: { id: string }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    className: s.tileIcon,
    "aria-hidden": true,
  } as const;
  switch (id) {
    case "cashback":
      return (
        <Image
          src="/assets/coins/coins1.webp"
          alt=""
          width={56}
          height={56}
          className={s.tileImg}
          aria-hidden
        />
      );
    case "diamond-deposit":
      return (
        <Image
          src="/assets/gems/diamond.avif"
          alt=""
          width={56}
          height={56}
          className={s.tileImg}
          aria-hidden
        />
      );
    case "rolling":
      return (
        <svg {...common}>
          <rect
            x="8"
            y="12"
            width="24"
            height="24"
            rx="5"
            transform="rotate(-12 20 24)"
          />
          <rect x="22" y="18" width="18" height="18" rx="4" />
          <circle cx="27" cy="23" r="1.4" fill="currentColor" />
          <circle cx="35" cy="31" r="1.4" fill="currentColor" />
          <circle cx="31" cy="27" r="1.4" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path
            d="M28 4 12 26h11l-3 18 16-23H25l3-17Z"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
