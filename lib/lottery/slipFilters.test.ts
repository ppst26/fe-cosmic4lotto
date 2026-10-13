import assert from "node:assert/strict";
import test from "node:test";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { MOCK_SETTLE_DELAY_MS, settleSlipIfDue } from "./mockSettlement";
import { queryLotterySlips } from "./mockSlipStore";
import {
  SLIP_HISTORY_DAYS,
  applySlipFilters,
  clampHistoryRange,
  isWithinHistoryRetention,
  paginateSlips,
  slipHistoryCutoff,
  slipPendingState,
  sortSlips,
  summarizeSlips,
} from "./slipFilters";

const NOW = new Date("2026-10-10T08:00:00+07:00");
const DAY = 24 * 60 * 60 * 1000;
const iso = (offsetMs: number) => new Date(NOW.getTime() + offsetMs).toISOString();

function slip(partial: Partial<LotterySubmittedSlip> & { id: string }): LotterySubmittedSlip {
  return {
    shortId: partial.id.slice(0, 8),
    reference: "LY-TEST",
    market: "thai-government",
    roundId: "r1",
    drawLabel: "",
    drawAt: iso(DAY),
    purchasedAt: iso(-DAY),
    status: "submitted",
    settledAt: null,
    note: null,
    lines: [
      { typeKey: "three_top", typeLabelKey: "betTypes.threeTop", number: "123", amount: 100, payoutRate: 900, potentialWin: 90000 },
    ],
    totalStake: 100,
    winLoss: null,
    continuePlayHref: "/lottery",
    ...partial,
  };
}

test("history cutoff is exactly 30 days before now", () => {
  assert.equal(SLIP_HISTORY_DAYS, 30);
  assert.equal(slipHistoryCutoff(NOW).getTime(), NOW.getTime() - 30 * DAY);
});

test("retention: settled slips expire after 30 days from settledAt, pending never expire", () => {
  const keep = slip({ id: "a", status: "lost", settledAt: iso(-30 * DAY) });
  const drop = slip({ id: "b", status: "lost", settledAt: iso(-30 * DAY - 1) });
  const pendingOld = slip({ id: "c", purchasedAt: iso(-90 * DAY), drawAt: iso(-60 * DAY) });
  const noSettledAt = slip({ id: "d", status: "won", settledAt: null });
  assert.equal(isWithinHistoryRetention(keep, NOW), true);
  assert.equal(isWithinHistoryRetention(drop, NOW), false);
  assert.equal(isWithinHistoryRetention(pendingOld, NOW), true);
  assert.equal(isWithinHistoryRetention(noSettledAt, NOW), false);
});

test("clampHistoryRange never goes beyond 30 days back or into the future", () => {
  const cutoff = slipHistoryCutoff(NOW);
  const wide = clampHistoryRange({ from: iso(-90 * DAY), to: iso(5 * DAY) }, NOW);
  assert.equal(wide.from.getTime(), cutoff.getTime());
  assert.equal(wide.to.getTime(), NOW.getTime());
  const inner = clampHistoryRange({ from: iso(-7 * DAY), to: iso(-1 * DAY) }, NOW);
  assert.equal(inner.from.getTime(), NOW.getTime() - 7 * DAY);
  assert.equal(inner.to.getTime(), NOW.getTime() - DAY);
  const none = clampHistoryRange({}, NOW);
  assert.equal(none.from.getTime(), cutoff.getTime());
  const garbage = clampHistoryRange({ from: "not-a-date", to: null }, NOW);
  assert.equal(garbage.from.getTime(), cutoff.getTime());
});

test("pending state: waiting for draw vs past draw time but not settled", () => {
  assert.equal(slipPendingState(slip({ id: "a", drawAt: iso(60_000) }), NOW), "waitingDraw");
  assert.equal(slipPendingState(slip({ id: "b", drawAt: iso(-60_000) }), NOW), "waitingSettle");
});

const FIXTURE: LotterySubmittedSlip[] = [
  slip({ id: "p1", drawAt: iso(2 * DAY) }),
  slip({ id: "p2", drawAt: iso(DAY), market: "yiki-5" }),
  slip({ id: "p3", drawAt: iso(-60_000), market: "yiki-5" }),
  slip({ id: "h1", status: "won", settledAt: iso(-1 * DAY), winLoss: 8900, market: "thai-government" }),
  slip({ id: "h2", status: "lost", settledAt: iso(-3 * DAY), winLoss: -100, market: "yiki-5" }),
  slip({ id: "h3", status: "void", settledAt: iso(-10 * DAY), winLoss: 0, market: "thai-government" }),
  slip({ id: "h4", status: "lost", settledAt: iso(-29 * DAY), winLoss: -100, market: "yiki-15" }),
  slip({ id: "h5", status: "lost", settledAt: iso(-45 * DAY), winLoss: -100, market: "yiki-15" }),
];

test("pending scope returns only unsettled slips, history only settled ones within 30 days", () => {
  const pending = applySlipFilters(FIXTURE, { scope: "pending" }, NOW);
  assert.deepEqual(pending.map((s) => s.id).sort(), ["p1", "p2", "p3"]);
  const history = applySlipFilters(FIXTURE, { scope: "history" }, NOW);
  assert.deepEqual(history.map((s) => s.id).sort(), ["h1", "h2", "h3", "h4"]);
});

test("market, result and range filters narrow history; void counts as its own result", () => {
  assert.deepEqual(
    applySlipFilters(FIXTURE, { scope: "history", market: "thai-government" }, NOW).map((s) => s.id).sort(),
    ["h1", "h3"],
  );
  assert.deepEqual(applySlipFilters(FIXTURE, { scope: "history", result: "void" }, NOW).map((s) => s.id), ["h3"]);
  assert.deepEqual(
    applySlipFilters(FIXTURE, { scope: "history", from: iso(-7 * DAY), to: iso(0) }, NOW).map((s) => s.id).sort(),
    ["h1", "h2"],
  );
  // client cannot ask for older than 30 days
  assert.equal(
    applySlipFilters(FIXTURE, { scope: "history", from: iso(-90 * DAY) }, NOW).some((s) => s.id === "h5"),
    false,
  );
  // market filter also applies to pending
  assert.deepEqual(applySlipFilters(FIXTURE, { scope: "pending", market: "yiki-5" }, NOW).map((s) => s.id).sort(), ["p2", "p3"]);
});

test("sorting: pending by draw time ascending, history by settled time descending", () => {
  assert.deepEqual(sortSlips(applySlipFilters(FIXTURE, { scope: "pending" }, NOW), "pending").map((s) => s.id), ["p3", "p2", "p1"]);
  assert.deepEqual(sortSlips(applySlipFilters(FIXTURE, { scope: "history" }, NOW), "history").map((s) => s.id), ["h1", "h2", "h3", "h4"]);
});

test("summary: totals follow the filtered set; void counts as 0 win/loss; pending has no win/loss", () => {
  const history = applySlipFilters(FIXTURE, { scope: "history" }, NOW);
  const summary = summarizeSlips(history, "history", ["thai-government"]);
  assert.equal(summary.count, 4);
  assert.equal(summary.totalStake, 400);
  assert.equal(summary.totalWinLoss, 8900 - 100 + 0 - 100);
  assert.deepEqual(summary.markets, ["thai-government"]);
  assert.equal(summarizeSlips(applySlipFilters(FIXTURE, { scope: "pending" }, NOW), "pending").totalWinLoss, null);
});

test("pagination uses an opaque cursor and stops at the end", () => {
  const items = Array.from({ length: 5 }, (_, i) => slip({ id: `s${i}` }));
  const first = paginateSlips(items, null, 2);
  assert.deepEqual(first.page.map((s) => s.id), ["s0", "s1"]);
  assert.equal(first.nextCursor, "2");
  const last = paginateSlips(items, "4", 2);
  assert.deepEqual(last.page.map((s) => s.id), ["s4"]);
  assert.equal(last.nextCursor, null);
  assert.equal(paginateSlips(items, "garbage", 2).page.length, 2);
  assert.equal(paginateSlips(items, null, 999).page.length, 5);
});

test("mock settlement waits for draw time + delay and is deterministic", () => {
  const due = slip({ id: "0000000a", drawAt: iso(-MOCK_SETTLE_DELAY_MS - 1000) });
  const notYet = slip({ id: "0000000a", drawAt: iso(-MOCK_SETTLE_DELAY_MS + 60_000) });
  assert.equal(settleSlipIfDue(notYet, NOW).status, "submitted");
  const first = settleSlipIfDue(due, NOW);
  assert.notEqual(first.status, "submitted");
  assert.ok(first.settledAt);
  assert.deepEqual(settleSlipIfDue(due, NOW), first);
  if (first.status === "lost") assert.equal(first.winLoss, -due.totalStake);
});

test("store query seeds demo slips once and applies scope, filters and retention", () => {
  const owner = `test-owner-${Date.now()}`;
  const pending = queryLotterySlips(owner, { scope: "pending" }, NOW);
  assert.ok(pending.slips.length >= 2);
  assert.ok(pending.slips.every((s) => s.status === "submitted"));
  assert.equal(pending.summary.totalWinLoss, null);

  const history = queryLotterySlips(owner, { scope: "history" }, NOW);
  assert.ok(history.slips.length >= 4);
  assert.ok(history.slips.every((s) => s.status !== "submitted"));
  assert.ok(history.summary.totalWinLoss !== null);
  assert.ok(history.summary.markets.length >= 2);

  const voidOnly = queryLotterySlips(owner, { scope: "history", result: "void" }, NOW);
  assert.ok(voidOnly.slips.every((s) => s.status === "void"));

  // a different user sees only their own slips
  const other = queryLotterySlips(`${owner}-2`, { scope: "pending" }, NOW);
  assert.ok(other.slips.every((s) => !pending.slips.some((mine) => mine.id === s.id)));

  // 31 days later the already-settled slips have expired (retention) — slips that were pending
  // only appear in history after their own draw time and then stay for 30 days from settlement
  const later = new Date(NOW.getTime() + 31 * DAY);
  const laterHistory = queryLotterySlips(owner, { scope: "history" }, later).slips;
  assert.ok(laterHistory.every((s) => !history.slips.some((old) => old.id === s.id)));
  assert.ok(laterHistory.every((s) => new Date(s.settledAt ?? 0).getTime() >= later.getTime() - 30 * DAY));
});

import { formatDateOnly, parseDateOnly, resolveSlipRange, slipRangeToken } from "./slipRange";

test("slip range: tokens are stable and custom is validated", () => {
  assert.equal(slipRangeToken("7d", "", ""), "7d");
  assert.equal(slipRangeToken("custom", "2026-10-01", "2026-10-05"), "custom:2026-10-01~2026-10-05");
  assert.deepEqual(resolveSlipRange("30d", "", "", NOW), {});
  assert.deepEqual(resolveSlipRange("custom", "garbage", "2026-10-05", NOW), {});
  const week = resolveSlipRange("7d", "", "", NOW);
  assert.equal(new Date(week.to ?? "").getTime(), NOW.getTime());
  assert.equal(new Date(week.from ?? "").getTime(), NOW.getTime() - 7 * DAY);
  const custom = resolveSlipRange("custom", "2026-10-05", "2026-10-01", NOW);
  assert.ok(custom.from && custom.to && new Date(custom.from) < new Date(custom.to));
  assert.equal(formatDateOnly(parseDateOnly("2026-02-03") as Date), "2026-02-03");
  assert.equal(parseDateOnly("2026-02-31"), null);
});
