import assert from "node:assert/strict";
import test from "node:test";
import { createTranslator, deepMerge, formatMessage, lookup } from "./translate";

const tree = {
  common: {
    hello: "สวัสดี {name}",
    nested: { deep: "ลึก" },
    items: { one: "{count} item", other: "{count} items" },
  },
};

test("lookup walks dot paths and stops at leaves", () => {
  assert.equal(lookup(tree, "common.nested.deep"), "ลึก");
  assert.equal(lookup(tree, "common.hello.x"), undefined);
  assert.equal(lookup(tree, "missing.key"), undefined);
});

test("formatMessage fills vars and keeps unknown placeholders", () => {
  assert.equal(formatMessage("ยอด {amount} บาท", { amount: 50 }), "ยอด 50 บาท");
  assert.equal(formatMessage("{a} {b}", { a: 1 }), "1 {b}");
  assert.equal(formatMessage("ไม่มีตัวแปร"), "ไม่มีตัวแปร");
});

test("translator picks plural forms per locale", () => {
  const en = createTranslator(tree, "en");
  assert.equal(en("common.items", { count: 1 }), "1 item");
  assert.equal(en("common.items", { count: 2 }), "2 items");
  const th = createTranslator(tree, "th");
  assert.equal(th("common.items", { count: 1 }), "1 items");
});

test("translator fills vars and returns the key when missing", () => {
  const t = createTranslator(tree, "th");
  assert.equal(t("common.hello", { name: "พีพี" }), "สวัสดี พีพี");
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.equal(t("common.nope"), "common.nope");
    assert.equal(t("common.nested"), "common.nested");
  } finally {
    console.warn = warn;
  }
});

test("deepMerge overrides leaves only", () => {
  const merged = deepMerge({ a: { x: "1", y: "2" }, b: "th" }, { a: { y: "3" } });
  assert.deepEqual(merged, { a: { x: "1", y: "3" }, b: "th" });
});
