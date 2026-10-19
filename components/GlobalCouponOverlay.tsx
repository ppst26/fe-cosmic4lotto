"use client";

import dynamic from "next/dynamic";
import { useCouponUI } from "@/context/CouponUIContext";

/** โหลด modal คูปองเมื่อเปิดครั้งแรกเท่านั้น */
const CouponModal = dynamic(() => import("@/components/CouponModal").then((m) => m.CouponModal));

export function GlobalCouponOverlay() {
  const { isOpen, closeCoupon } = useCouponUI();
  if (!isOpen) return null;
  return <CouponModal isOpen={isOpen} onClose={closeCoupon} />;
}
