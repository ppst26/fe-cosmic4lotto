"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useAuthUI } from "@/context/AuthUIContext";

interface CouponUIContextValue {
  isOpen: boolean;
  openCoupon: () => void;
  closeCoupon: () => void;
}

const CouponUIContext = createContext<CouponUIContextValue | null>(null);

/** เปิด/ปิดหน้าแลกคูปอง — sync ?layer=coupon · ยังไม่ล็อกอิน → login */
export function CouponUIProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLogin } = useAuthUI();
  const { isOpen: layerOpen, open, close } = useOverlayLayer("coupon");

  const openCoupon = useCallback(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    open();
  }, [isAuthenticated, isLoading, open, openLogin]);

  /** ?layer=coupon โดยไม่ล็อกอิน → ปิดแล้วเปิด login */
  useEffect(() => {
    if (!layerOpen || isLoading || isAuthenticated) return;
    close();
    openLogin();
  }, [close, isAuthenticated, isLoading, layerOpen, openLogin]);

  const isOpen = layerOpen && isAuthenticated;

  const value = useMemo(
    () => ({ isOpen, openCoupon, closeCoupon: close }),
    [isOpen, openCoupon, close],
  );

  return <CouponUIContext.Provider value={value}>{children}</CouponUIContext.Provider>;
}

export function useCouponUI(): CouponUIContextValue {
  const ctx = useContext(CouponUIContext);
  if (!ctx) {
    throw new Error("useCouponUI ต้องใช้ภายใน CouponUIProvider");
  }
  return ctx;
}
