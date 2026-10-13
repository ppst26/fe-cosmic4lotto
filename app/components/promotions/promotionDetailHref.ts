import type { PromotionDetailId } from "@/app/types/promotions";

/** ลิงก์หน้ารายละเอียดโปรโมชั่น — /promotions/[id] (ไม่มี prefix ภาษา · Link/useRouter เติมให้) */
export function promotionDetailHref(id: PromotionDetailId): string {
  return `/promotions/${encodeURIComponent(id)}`;
}
