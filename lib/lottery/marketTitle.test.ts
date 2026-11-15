import assert from "node:assert/strict";
import test from "node:test";
import { splitMarketTitle } from "./marketTitle";

test("splits qualifier from the market name", () => {
  assert.deepEqual(splitMarketTitle("หวยยี่กี 5 นาที"), { main: "หวยยี่กี", sub: "5 นาที" });
  assert.deepEqual(splitMarketTitle("หวยนิเคอิ รอบเช้า"), { main: "หวยนิเคอิ", sub: "รอบเช้า" });
  assert.deepEqual(splitMarketTitle("หวยลาว Super"), { main: "หวยลาว", sub: "Super" });
  assert.deepEqual(splitMarketTitle("Nikkei Lottery (Morning)"), { main: "Nikkei Lottery", sub: "Morning" });
});

test("keeps the name whole when there is no qualifier and glues หวย to the next word", () => {
  assert.deepEqual(splitMarketTitle("หวยรัฐบาลไทย"), { main: "หวยรัฐบาลไทย", sub: null });
  assert.deepEqual(splitMarketTitle("หวย ธ.ก.ส."), { main: "หวย\u00A0ธ.ก.ส.", sub: null });
});
