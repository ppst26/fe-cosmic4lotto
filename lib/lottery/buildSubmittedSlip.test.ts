import assert from "node:assert/strict";
import test from "node:test";
import { buildSubmittedSlip, resolveBetTypeRule } from "./buildSubmittedSlip";

test("payout rules come from server tables per market", () => {
  assert.deepEqual(resolveBetTypeRule("thai-government", "three_top"), { labelKey: "betTypes.threeTop", payoutRate: 900, digits: 3 });
  assert.deepEqual(resolveBetTypeRule("yiki-5", "two_bottom"), { labelKey: "betTypes.twoBottom", payoutRate: 90, digits: 2 });
  assert.equal(resolveBetTypeRule("thai-government", "made_up"), null);
});

test("slip totals and potential win use the server rate", () => {
  const rule = resolveBetTypeRule("thai-government", "two_top")!;
  const slip = buildSubmittedSlip(
    { market: "thai-government", roundId: "r1", drawLabel: null, drawCloseAt: null, note: null, continuePlayHref: null, lines: [{ typeKey: "two_top", number: "12", amount: 10, rule }] },
    { slipId: "a".repeat(32), reference: "LY-1", purchasedAt: "2026-10-07T00:00:00.000Z" },
  );
  assert.equal(slip.totalStake, 10);
  assert.equal(slip.lines[0].potentialWin, 900);
  assert.equal(slip.continuePlayHref, "/lottery");
});
