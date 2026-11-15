import assert from "node:assert/strict";
import test from "node:test";
import { buildLotteryResultsForDate, LOTTERY_RESULT_SCHEDULE } from "./lotteryResultsMockData";

/** 2026-11-16 12:30 เวลาไทย = 05:30 UTC */
const NOW = new Date("2026-11-16T05:30:00Z");

test("past days are fully drawn with digits of the right length", () => {
  const day = buildLotteryResultsForDate("2026-11-10", NOW);
  assert.equal(day.draws.length, LOTTERY_RESULT_SCHEDULE.length);
  assert.ok(day.draws.every((d) => d.status === "done"));
  const gov = day.draws.find((d) => d.marketSlug === "thai-government");
  assert.equal(gov?.figures.find((f) => f.id === "first")?.value?.length, 6);
  assert.equal(gov?.figures.find((f) => f.id === "first")?.value?.slice(-3), gov?.figures.find((f) => f.id === "top3")?.value);
  const yiki15 = day.yiki.find((y) => y.slug === "yiki-15");
  assert.equal(yiki15?.total, 88);
  assert.equal(yiki15?.rounds.length, 88);
  assert.ok(yiki15?.rounds.every((r) => r.status === "done" && r.top3?.length === 3 && r.bottom2?.length === 2));
});

test("the same date always gives the same numbers", () => {
  const a = buildLotteryResultsForDate("2026-11-10", NOW);
  const b = buildLotteryResultsForDate("2026-11-10", new Date("2026-11-20T05:30:00Z"));
  assert.deepEqual(a.draws.map((d) => d.figures), b.draws.map((d) => d.figures));
});

test("today only draws what is due and keeps the rest pending", () => {
  const day = buildLotteryResultsForDate("2026-11-16", NOW);
  const draw = (slug: string) => day.draws.find((d) => d.marketSlug === slug)!;
  assert.equal(draw("baac").status, "done"); // 09:00
  assert.equal(draw("taiwan").status, "done"); // 12:00
  assert.equal(draw("korea").status, "pending"); // 12:40
  assert.equal(draw("china-pm").status, "pending"); // 13:30
  assert.deepEqual(draw("korea").figures.map((f) => f.value), [null, null, null]);
});

test("yiki rounds follow the clock: 02:20 on the draw day = 82 of 88 rounds", () => {
  const night = new Date("2026-11-15T19:20:00Z"); // 02:20 เวลาไทย วันที่ 16
  const day = buildLotteryResultsForDate("2026-11-16", night);
  const yiki = day.yiki.find((y) => y.slug === "yiki-15")!;
  assert.equal(yiki.rounds.filter((r) => r.status === "done").length, 82);
  assert.equal(yiki.rounds[81].time, "02:15");
  assert.equal(yiki.rounds[82].status, "pending");
  assert.equal(yiki.rounds[82].top3, null);
});
