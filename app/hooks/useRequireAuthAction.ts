"use client";

import { useCallback } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";

/**
 * รัน action เมื่อล็อกอินแล้ว — ไม่ล็อกอินเปิด login sheet (เมนู hub / sidebar)
 */
export function useRequireAuthAction() {
  const { isAuthenticated, isLoading } = useAuth();
  const { open: openLogin } = useOverlayLayer("login");

  const runWithAuth = useCallback(
    (needsAuth: boolean, action: () => void) => {
      if (!needsAuth) {
        action();
        return;
      }
      if (isLoading) return;
      if (!isAuthenticated) {
        openLogin();
        return;
      }
      action();
    },
    [isAuthenticated, isLoading, openLogin],
  );

  return { runWithAuth, isAuthenticated, isLoading };
}
