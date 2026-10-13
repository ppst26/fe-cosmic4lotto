"use client";

import { useMemo } from "react";
import { formatNumber, formatVipCompactAmount } from "@/lib/format";
import { useT } from "./I18nProvider";

/**
 * ตัวเลข + หน่วยตามภาษา (common.units) — แทน formatter เดิมที่ฝังหน่วยไทยใน lib/format.ts
 * ตัวเลขยังเป็นเลขอารบิกคั่นหลักพันเหมือนเดิม
 */
export function useFormat() {
  const t = useT("common");
  return useMemo(() => {
    const unit = (key: "people" | "records" | "credits" | "gems", value: number) =>
      t(`units.${key}`, { n: formatNumber(value), count: value });
    return {
      people: (value: number) => unit("people", value),
      records: (value: number) => unit("records", value),
      credits: (value: number) => unit("credits", value),
      gems: (value: number) => unit("gems", value),
      /** ยอดย่อหน่วยล้าน เช่น 1.5 ล้าน / 1.5M · ต่ำกว่าล้านแสดงเต็ม */
      compactAmount: (value: number) => formatVipCompactAmount(value, (n) => t("units.million", { n })),
    };
  }, [t]);
}
