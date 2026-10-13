"use client";

import type { PromotionDetailContent, PromotionDetailId } from "@/app/types/promotions";
import { fetchPromotionDetailResult } from "@/lib/api/promotions";
import { useApi, type ApiResource } from "@/app/hooks/useApi";

/**
 * รายละเอียดโปรโมชันรายตัว (ไม่ต้อง login) — cache ตาม id ข้ามหน้า
 * ใช้ใน /promotions/[id] · เปิดซ้ำ/ย้อนกลับแสดงทันทีจาก cache แล้วค่อยตรวจใหม่เบื้องหลัง
 */
export function usePromotionDetail(id: PromotionDetailId | null): ApiResource<PromotionDetailContent> {
  return useApi(id ? ["promotion-detail", id] : null, () => fetchPromotionDetailResult(id as PromotionDetailId));
}
