"use client";

import React from "react";
import { SWRConfig } from "swr";
import { UrlSearchParamsProvider } from "@/app/hooks/useUrlSearchParams";
import type { ApiError } from "@/lib/api/http";

/**
 * ค่าเริ่มต้น SWR ทั้งแอป (เหมือน glass app/providers.tsx) — ไม่ดึงใหม่ทุกครั้งที่สลับแท็บ · 401 / 4xx ไม่ retry
 */
const SWR_DEFAULTS = {
  revalidateOnFocus: false,
  onErrorRetry: (
    error: ApiError,
    _key: string,
    _config: unknown,
    revalidate: (opts: { retryCount: number }) => void,
    { retryCount }: { retryCount: number },
  ) => {
    if (error.code === "UNAUTHORIZED" || (error.status >= 400 && error.status < 500)) return;
    if (retryCount >= 3) return;
    setTimeout(() => revalidate({ retryCount }), 2000 * (retryCount + 1));
  },
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UrlSearchParamsProvider>
      <SWRConfig value={SWR_DEFAULTS}>{children}</SWRConfig>
    </UrlSearchParamsProvider>
  );
}
