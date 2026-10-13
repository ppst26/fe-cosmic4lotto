import assert from "node:assert/strict";
import test from "node:test";
import { getLotteryRules, lotteryRulesHref } from "./rules";

const NOW = new Date("2026-10-10T08:00:00+07:00");

test("thai government rules list its eight bet types with payout rates", () => {
  const rules = getLotteryRules("thai-government", NOW);
  assert.ok(rules);
  assert.equal(rules.titleKey, "markets.thaiGovernment");
  assert.equal(rules.rows.length, 8);
  assert.deepEqual(rules.rows[0], { id: "three_top", labelKey: "betTypes.threeTop", payoutRate: 900 });
});

test("yiki markets use the yiki settlement table", () => {
  const rules = getLotteryRules("yiki-5", NOW);
  assert.ok(rules);
  assert.equal(rules.titleKey, "markets.yiki5");
  assert.equal(rules.rows.length, 6);
  assert.ok(rules.rows.every((row) => row.payoutRate > 0));
});

test("bet limits come from the current round", () => {
  const rules = getLotteryRules("thai-government", NOW);
  assert.ok(rules);
  assert.ok(rules.minBet !== null && rules.maxBet !== null && rules.minBet <= rules.maxBet);
});

test("unknown market has no rules", () => {
  assert.equal(getLotteryRules("not-a-market", NOW), null);
});

test("rules href is locale-free and encoded", () => {
  assert.equal(lotteryRulesHref("thai-government"), "/lottery/rules/thai-government");
  assert.equal(lotteryRulesHref("a b"), "/lottery/rules/a%20b");
});
