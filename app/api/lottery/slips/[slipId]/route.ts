import { NextResponse } from "next/server";
import { getLotterySlipById } from "@/lib/lottery/mockSlipStore";
import { getSessionUserId } from "@/lib/auth/session";

/**
 * GET /api/lottery/slips/[slipId] — อ่านโพยที่ส่งแล้ว เฉพาะเจ้าของ (mock)
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slipId: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }
  const { slipId } = await context.params;
  const slip = /^[a-f0-9]{32}$/.test(slipId) ? getLotterySlipById(userId, slipId) : null;
  if (!slip) {
    return NextResponse.json({ error: "ไม่พบโพย" }, { status: 404 });
  }
  return NextResponse.json(slip);
}
