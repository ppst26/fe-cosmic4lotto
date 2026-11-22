import type {
  MyPromotionsResponse,
  PromotionClaimStatusResponse,
  PromotionClaimSubmitResponse,
  PromotionDetailContent,
  PromotionDetailId,
  PromotionsCatalogResponse,
} from "@/app/types/promotions";
import { apiFetch, type ApiResult } from "./http";

/** catalog โปรโมชัน + กิจกรรม — ใช้ใน PromotionsCatalogProvider */
export function fetchPromotionsCatalog(): Promise<ApiResult<PromotionsCatalogResponse>> {
  return apiFetch<PromotionsCatalogResponse>("/api/promotions");
}

/** รายละเอียดโปรโมชันรายตัว — null เมื่อไม่พบหรือโหลดไม่ได้ */
export async function fetchPromotionDetail(
  id: PromotionDetailId,
): Promise<PromotionDetailContent | null> {
  const res = await apiFetch<{ detail: PromotionDetailContent }>(
    `/api/promotions/${encodeURIComponent(id)}`,
  );
  return res.ok ? (res.data?.detail ?? null) : null;
}

/**
 * รายละเอียดโปรโมชันรายตัวแบบ ApiResult — ใช้กับ useApi (หน้า /promotions/[id])
 * ไม่พบ → error 404 เพื่อให้หน้าแสดง "ไม่พบโปรโมชั่น"
 */
export async function fetchPromotionDetailResult(
  id: PromotionDetailId,
): Promise<ApiResult<PromotionDetailContent>> {
  const res = await apiFetch<{ detail: PromotionDetailContent }>(
    `/api/promotions/${encodeURIComponent(id)}`,
  );
  if (!res.ok) return res;
  if (!res.data?.detail) {
    return { ok: false, error: { code: "HTTP", status: 404, message: "Not found" } };
  }
  return { ok: true, status: res.status, data: res.data.detail };
}

/** สถานะรับโปรของสมาชิก — ต้อง login */
export function fetchPromotionClaimStatus(
  id: PromotionDetailId,
): Promise<ApiResult<PromotionClaimStatusResponse>> {
  return apiFetch<PromotionClaimStatusResponse>(
    `/api/promotions/${encodeURIComponent(id)}/claim`,
  );
}

/** รับโปรโมชั่น — ต้อง login · ข้อความสำเร็จจาก server */
export function submitPromotionClaim(
  id: PromotionDetailId,
): Promise<ApiResult<PromotionClaimSubmitResponse>> {
  return apiFetch<PromotionClaimSubmitResponse>(
    `/api/promotions/${encodeURIComponent(id)}/claim`,
    { method: "POST" },
  );
}

/** โปรโมชั่นของฉัน — ต้อง login */
export function fetchMyPromotions(): Promise<ApiResult<MyPromotionsResponse>> {
  return apiFetch<MyPromotionsResponse>("/api/promotions/mine");
}
