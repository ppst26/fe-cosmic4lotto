import { NextResponse } from "next/server";
import { queryLotterySlips } from "@/lib/lottery/mockSlipStore";
import { MAX_SLIP_PAGE_SIZE } from "@/lib/lottery/slipFilters";
import { getSessionUserId } from "@/lib/auth/session";
import { readInt } from "@/lib/server/request";
import type { LotterySlipListQuery, LotterySlipResult, LotterySlipScope } from "@/app/types/lotterySlip";

const SCOPES: readonly LotterySlipScope[] = ["pending", "history"];
const RESULTS: readonly LotterySlipResult[] = ["won", "lost", "void"];

function validIso(value: string | null): string | undefined {
  if (!value) return undefined;
  return Number.isNaN(new Date(value).getTime()) ? undefined : value;
}

/**
 * GET /api/lottery/slips — รายการโพยของผู้ใช้ที่ login (mock)
 * ?scope=pending|history (ค่าเริ่มต้น pending) &market= &result=won|lost|void &from= &to= &cursor= &limit=
 * history บังคับย้อนหลังไม่เกิน 30 วันที่ server (ดู lib/lottery/slipFilters.ts) — ไม่เชื่อ from จาก client
 */
export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const scope = (params.get("scope") ?? "pending") as LotterySlipScope;
  if (!SCOPES.includes(scope)) {
    return NextResponse.json({ error: "scope ไม่ถูกต้อง" }, { status: 400 });
  }
  const resultParam = params.get("result");
  if (resultParam && !RESULTS.includes(resultParam as LotterySlipResult)) {
    return NextResponse.json({ error: "result ไม่ถูกต้อง" }, { status: 400 });
  }
  const marketParam = params.get("market");
  if (marketParam && !/^[a-z0-9-]{1,40}$/.test(marketParam)) {
    return NextResponse.json({ error: "market ไม่ถูกต้อง" }, { status: 400 });
  }
  const cursorParam = params.get("cursor");
  if (cursorParam && !/^\d{1,9}$/.test(cursorParam)) {
    return NextResponse.json({ error: "cursor ไม่ถูกต้อง" }, { status: 400 });
  }

  const query: LotterySlipListQuery = {
    scope,
    market: marketParam || undefined,
    result: scope === "history" ? ((resultParam as LotterySlipResult | null) ?? undefined) : undefined,
    from: scope === "history" ? validIso(params.get("from")) : undefined,
    to: scope === "history" ? validIso(params.get("to")) : undefined,
    cursor: cursorParam || undefined,
    limit: readInt(params.get("limit"), 1, MAX_SLIP_PAGE_SIZE) ?? undefined,
  };

  return NextResponse.json(queryLotterySlips(userId, query));
}
