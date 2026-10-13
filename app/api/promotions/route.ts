import { NextResponse } from "next/server";
import { loadPromotionsCatalog } from "@/lib/promotions/promotionCatalog";
import type { PromotionsCatalogResponse } from "@/app/types/promotions";

/**
 * GET /api/promotions — รายการโปรโมชั่น (mock จาก public/promotions/catalog.json)
 */
export async function GET() {
  try {
    const catalog = await loadPromotionsCatalog();
    return NextResponse.json<PromotionsCatalogResponse>(catalog);
  } catch (error) {
    console.error("[api/promotions]", error);
    return NextResponse.json({ message: "ไม่สามารถโหลดโปรโมชั่นได้" }, { status: 500 });
  }
}
