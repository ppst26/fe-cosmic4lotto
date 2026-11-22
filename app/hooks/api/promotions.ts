"use client";

import type { PromotionDetailContent, PromotionDetailId } from "@/app/types/promotions";
import {
  fetchMyPromotions,
  fetchPromotionClaimStatus,
  fetchPromotionDetailResult,
  submitPromotionClaim,
} from "@/lib/api/promotions";
import { useApi, type ApiResource } from "@/app/hooks/useApi";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useCallback, useState } from "react";

/**
 * รายละเอียดโปรโมชันรายตัว (ไม่ต้อง login) — cache ตาม id ข้ามหน้า
 * ใช้ใน /promotions/[id] · เปิดซ้ำ/ย้อนกลับแสดงทันทีจาก cache แล้วค่อยตรวจใหม่เบื้องหลัง
 */
export function usePromotionDetail(id: PromotionDetailId | null): ApiResource<PromotionDetailContent> {
  return useApi(id ? ["promotion-detail", id] : null, () => fetchPromotionDetailResult(id as PromotionDetailId));
}

/** สถานะรับโปร — โหลดเมื่อ login แล้ว */
export function usePromotionClaimStatus(id: PromotionDetailId | null) {
  const { isAuthenticated } = useAuth();
  return useApi(
    isAuthenticated && id ? ["promotion-claim-status", id] : null,
    () => fetchPromotionClaimStatus(id as PromotionDetailId),
    { auth: true },
  );
}

/** กดรับโปร — เรียก POST mock API */
/** โปรของฉัน — ยอดฝาก/เทิร์น จาก mock API */
export function useMyPromotions() {
  return useApi(["my-promotions"], () => fetchMyPromotions(), { auth: true });
}

export function useSubmitPromotionClaim(id: PromotionDetailId) {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async () => {
    setSubmitting(true);
    try {
      return await submitPromotionClaim(id);
    } finally {
      setSubmitting(false);
    }
  }, [id]);

  return { submit, submitting };
}
