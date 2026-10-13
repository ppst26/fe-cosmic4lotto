"use client";

import { useCallback } from "react";
import { apiErrorMessageKey } from "@/lib/api/http";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * แปลข้อความ error จาก apiFetch ตอนแสดงผล — ข้อความ default ของ client (network / parse / 401 / generic)
 * แปลตามภาษาปัจจุบัน · ข้อความจาก server แสดงตามเดิม · ไม่มีข้อความ → undefined
 */
export function useApiErrorText() {
  const t = useT("errors");
  return useCallback(
    (message: string | null | undefined): string | undefined => {
      const key = apiErrorMessageKey(message);
      if (key) return t(`api.${key}`);
      return message ?? undefined;
    },
    [t],
  );
}
