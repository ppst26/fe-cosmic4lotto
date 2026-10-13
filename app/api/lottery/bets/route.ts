import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { buildSubmittedSlip, resolveBetTypeRule, type ValidatedBetLine } from "@/lib/lottery/buildSubmittedSlip";
import { saveLotterySlip } from "@/lib/lottery/mockSlipStore";
import { getSessionUserId } from "@/lib/auth/session";
import { LOTTERY_CATALOG_ENTRIES } from "@/app/data/lotteryCatalogMockData";
import { readInt, readInternalPath, readJsonObject, readString } from "@/lib/server/request";
import type { SubmitLotteryBetResponse } from "@/app/types/lotteryBetApi";

/** ขอบเขตโพย — ต่อ backend: ใช้ min/max ของตลาด/รอบจริง */
const MAX_LINES = 100;
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 100_000;

const KNOWN_MARKETS = new Set(LOTTERY_CATALOG_ENTRIES.map((entry) => entry.slug));

function fail(error: string, status: number) {
  return NextResponse.json<SubmitLotteryBetResponse>({ ok: false, error }, { status });
}

/**
 * POST /api/lottery/bets — รับโพยหวย (mock) คืนเลขอ้างอิง
 * ต้อง login · ป้ายประเภท/อัตราจ่ายคิดจากกติกาฝั่ง server (ค่า typeLabel / payoutRate จาก client ถูกละเลย)
 * ยังไม่ตัดเงินและยังไม่เช็กว่ารอบเปิดรับอยู่ — backend จริงต้องทำทั้งสองอย่างใน transaction เดียวกัน
 */
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return fail("กรุณาเข้าสู่ระบบก่อนส่งโพย", 401);

  const body = await readJsonObject(request);
  if (!body) return fail("ข้อมูลไม่ถูกต้อง", 400);

  const market = readString(body.market, 40);
  const roundId = readString(body.roundId, 64);
  if (!market || !KNOWN_MARKETS.has(market) || !roundId) {
    return fail("กรุณาระบุตลาดและรอบที่ถูกต้อง", 400);
  }

  const rawLines = Array.isArray(body.lines) ? body.lines : [];
  if (rawLines.length === 0) return fail("โพยว่าง — ไม่มีรายการแทง", 400);
  if (rawLines.length > MAX_LINES) return fail(`ส่งได้ไม่เกิน ${MAX_LINES} รายการต่อโพย`, 400);

  const lines: ValidatedBetLine[] = [];
  for (const raw of rawLines) {
    const line = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const typeKey = readString(line.typeKey, 40);
    const rule = typeKey ? resolveBetTypeRule(market, typeKey) : null;
    const number = readString(line.number, 6);
    const amount = readInt(line.amount, MIN_AMOUNT, MAX_AMOUNT);
    if (!typeKey || !rule || !number || !/^\d+$/.test(number) || number.length !== rule.digits || amount === null) {
      return fail("มีรายการที่ข้อมูลไม่ครบหรือไม่ถูกต้อง", 400);
    }
    lines.push({ typeKey, number, amount, rule });
  }

  const purchasedAt = new Date().toISOString();
  const slipId = randomBytes(16).toString("hex");
  const reference = `LY-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;

  const slip = buildSubmittedSlip(
    {
      market,
      roundId,
      drawLabel: readString(body.drawLabel, 80),
      drawCloseAt: readString(body.drawCloseAt, 40),
      note: readString(body.note, 200) || null,
      continuePlayHref: readInternalPath(body.continuePlayHref),
      lines,
    },
    { slipId, reference, purchasedAt },
  );
  saveLotterySlip(userId, slip);

  return NextResponse.json<SubmitLotteryBetResponse>({
    ok: true,
    slipId,
    reference,
    totalAmount: slip.totalStake,
    lineCount: lines.length,
    submittedAt: purchasedAt,
  });
}
