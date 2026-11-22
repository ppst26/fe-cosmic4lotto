import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { isPromotionDetailId, loadPromotionDetail } from "@/lib/promotions/promotionCatalog";
import {
  getPromotionClaimedAt,
  recordPromotionClaim,
} from "@/lib/promotions/mockPromotionClaimStore";
import { syncMyPromotionAfterClaim } from "@/lib/promotions/mockMyPromotionsStore";
import type {
  PromotionClaimStatusResponse,
  PromotionClaimSubmitResponse,
  PromotionDetailId,
} from "@/app/types/promotions";

type RouteContext = { params: Promise<{ id: string }> };

function unauthorized() {
  return NextResponse.json({ ok: false, error: "กรุณาเข้าสู่ระบบก่อนรับโปรโมชั่น" }, { status: 401 });
}

async function resolvePromotionId(context: RouteContext): Promise<PromotionDetailId | null> {
  const { id } = await context.params;
  const decoded = decodeURIComponent(id ?? "");
  if (!isPromotionDetailId(decoded)) return null;
  const promotionId = decoded as PromotionDetailId;
  const detail = await loadPromotionDetail(promotionId);
  if (!detail) return null;
  return promotionId;
}

/**
 * GET /api/promotions/[id]/claim — สถานะรับโปรของสมาชิก (mock)
 */
export async function GET(_request: Request, context: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const promotionId = await resolvePromotionId(context);
  if (!promotionId) {
    return NextResponse.json({ ok: false, error: "ไม่พบโปรโมชั่น" }, { status: 404 });
  }

  const claimedAt = getPromotionClaimedAt(userId, promotionId);
  const body: PromotionClaimStatusResponse = {
    ok: true,
    promotionId,
    claimed: Boolean(claimedAt),
    claimedAt,
  };
  return NextResponse.json(body);
}

/**
 * POST /api/promotions/[id]/claim — รับโปรโมชั่น (mock)
 */
export async function POST(_request: Request, context: RouteContext) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const promotionId = await resolvePromotionId(context);
  if (!promotionId) {
    return NextResponse.json({ ok: false, error: "ไม่พบโปรโมชั่น" }, { status: 404 });
  }

  const existing = getPromotionClaimedAt(userId, promotionId);
  if (existing) {
    return NextResponse.json(
      { ok: false, error: "คุณรับโปรโมชั่นนี้แล้ว", code: "ALREADY_CLAIMED", claimedAt: existing },
      { status: 409 },
    );
  }

  const claimedAt = recordPromotionClaim(userId, promotionId);
  await syncMyPromotionAfterClaim(userId, promotionId, claimedAt);
  const body: PromotionClaimSubmitResponse = {
    ok: true,
    promotionId,
    claimedAt,
    message: "รับโปรโมชั่นสำเร็จ",
  };
  return NextResponse.json(body);
}
