"use client";

import React from "react";
import { SWRConfig } from "swr";
import { UrlSearchParamsProvider } from "@/app/hooks/useUrlSearchParams";
import { AuthProvider } from "@/app/components/auth/AuthProvider";
import type { ApiError } from "@/lib/api/http";
import { AuthUIProvider } from "@/context/AuthUIContext";
import { DepositProvider } from "@/context/DepositContext";
import { MenuUIProvider } from "@/context/MenuUIContext";
import { BottomNavUIProvider } from "@/context/BottomNavUIContext";
import { CouponUIProvider } from "@/context/CouponUIContext";
import { ToastProvider } from "@/context/ToastContext";
import { PendingTransactionProvider } from "@/context/PendingTransactionContext";
import { GlobalAuthOverlays } from "@/components/GlobalAuthOverlays";
import { GlobalCouponOverlay } from "@/components/GlobalCouponOverlay";
import { FloatingActions } from "@/app/components/layout/FloatingActions";
import { HomeActionBridge } from "@/components/layout/HomeActionBridge";
import { LottoMenuDrawer } from "@/app/components/menu/LottoMenuDrawer";
import { DesktopHubModalProvider } from "@/app/components/hub/DesktopHubModalProvider";
import { NotificationProvider } from "@/app/components/notifications/NotificationProvider";
import { LanguagePickerProvider } from "@/app/components/i18n/LanguagePickerProvider";
import { PwaInstallProvider } from "@/app/components/pwa/PwaInstallProvider";

/**
 * ค่าเริ่มต้น SWR ทั้งแอป (เหมือน glass app/providers.tsx) — ไม่ดึงใหม่ทุกครั้งที่สลับแท็บ · 401 / 4xx ไม่ retry
 * (retry เฉพาะ network / 5xx สูงสุด 3 ครั้ง)
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
      <SWRConfig value={SWR_DEFAULTS}>
        <ToastProvider>
          <AuthProvider>
            <PwaInstallProvider>
              <LanguagePickerProvider>
                <NotificationProvider>
                  <DesktopHubModalProvider>
                    <AuthUIProvider>
                      <CouponUIProvider>
                        <MenuUIProvider>
                          <BottomNavUIProvider>
                            <PendingTransactionProvider>
                              <DepositProvider>
                                {children}
                                <GlobalAuthOverlays />
                                <GlobalCouponOverlay />
                                <HomeActionBridge />
                                <FloatingActions />
                                <LottoMenuDrawer />
                              </DepositProvider>
                            </PendingTransactionProvider>
                          </BottomNavUIProvider>
                        </MenuUIProvider>
                      </CouponUIProvider>
                    </AuthUIProvider>
                  </DesktopHubModalProvider>
                </NotificationProvider>
              </LanguagePickerProvider>
            </PwaInstallProvider>
          </AuthProvider>
        </ToastProvider>
      </SWRConfig>
    </UrlSearchParamsProvider>
  );
}
