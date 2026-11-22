import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { listMyPromotions } from "@/lib/promotions/mockMyPromotionsStore";
import type { MyPromotionsResponse } from "@/app/types/promotions";

/**
 * GET /api/promotions/mine — โปรโมชั่นที่สมาชิกรับแล้ว + ความคืบหน้ายอดฝาก/เทิร์น (mock)
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const items = await listMyPromotions(userId);
  const body: MyPromotionsResponse = {
    ok: true,
    updatedAt: new Date().toISOString(),
    items,
  };
  return NextResponse.json(body);
}
