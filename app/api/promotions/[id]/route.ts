import { NextResponse } from "next/server";
import { isPromotionDetailId, loadPromotionDetail } from "@/lib/promotions/promotionCatalog";
import type { PromotionDetailResponse } from "@/app/types/promotions";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/promotions/[id] — รายละเอียดโปร (mock จาก public/promotions/details.json)
 */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  /** รับเฉพาะ id ที่รู้จัก — กัน key แปลก ๆ เช่น "constructor" หลุดเข้า cache object */
  if (!isPromotionDetailId(id)) {
    return NextResponse.json({ message: "ไม่พบโปรโมชั่น" }, { status: 404 });
  }

  try {
    const detail = await loadPromotionDetail(id);
    if (!detail) {
      return NextResponse.json({ message: "ไม่พบโปรโมชั่น" }, { status: 404 });
    }
    return NextResponse.json<PromotionDetailResponse>({ detail });
  } catch (error) {
    console.error("[api/promotions/[id]]", error);
    return NextResponse.json({ message: "ไม่สามารถโหลดรายละเอียดได้" }, { status: 500 });
  }
}
