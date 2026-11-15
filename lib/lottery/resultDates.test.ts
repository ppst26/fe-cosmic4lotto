import assert from "node:assert/strict";
import test from "node:test";
import { bangkokMinutes, bangkokToday, isIsoDate, minutesToTime, shiftIsoDate, timeToMinutes } from "./resultDates";

test("bangkokToday uses Bangkok time, not UTC", () => {
  assert.equal(bangkokToday(new Date("2026-11-15T20:00:00Z")), "2026-11-16");
  assert.equal(bangkokToday(new Date("2026-11-15T16:59:00Z")), "2026-11-15");
});

test("bangkokMinutes reads the Bangkok clock", () => {
  assert.equal(bangkokMinutes(new Date("2026-11-15T20:30:00Z")), 3 * 60 + 30);
  assert.equal(bangkokMinutes(new Date("2026-11-16T00:00:00Z")), 7 * 60);
});

test("shiftIsoDate crosses month and year boundaries", () => {
  assert.equal(shiftIsoDate("2026-11-16", -1), "2026-11-15");
  assert.equal(shiftIsoDate("2026-12-31", 1), "2027-01-01");
  assert.equal(shiftIsoDate("2026-03-01", -1), "2026-02-28");
});

test("isIsoDate rejects bad strings and impossible dates", () => {
  assert.equal(isIsoDate("2026-11-16"), true);
  assert.equal(isIsoDate("2026-02-30"), false);
  assert.equal(isIsoDate("16/11/2026"), false);
});

test("time helpers round-trip and wrap past midnight", () => {
  assert.equal(timeToMinutes("06:15"), 375);
  assert.equal(minutesToTime(375), "06:15");
  assert.equal(minutesToTime(26 * 60 + 15), "02:15");
});
