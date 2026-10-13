"use client";

import { CouponModal } from "@/components/CouponModal";
import { useCouponUI } from "@/context/CouponUIContext";

export function GlobalCouponOverlay() {
  const { isOpen, closeCoupon } = useCouponUI();
  return <CouponModal isOpen={isOpen} onClose={closeCoupon} />;
}
