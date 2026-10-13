import assert from "node:assert/strict";
import test from "node:test";
import { readInt, readInternalPath, readJsonObject, readString } from "./request";

const req = (body: string) => new Request("http://x/api", { method: "POST", body });

test("readJsonObject accepts objects only", async () => {
  assert.deepEqual(await readJsonObject(req('{"a":1}')), { a: 1 });
  assert.equal(await readJsonObject(req("null")), null);
  assert.equal(await readJsonObject(req("[1]")), null);
  assert.equal(await readJsonObject(req("{bad")), null);
  assert.equal(await readJsonObject(req(JSON.stringify({ a: "x".repeat(20_000) }))), null);
});

test("field readers reject wrong types and out-of-range values", () => {
  assert.equal(readString("  hi ", 5), "hi");
  assert.equal(readString(5, 5), null);
  assert.equal(readString("toolong", 3), null);
  assert.equal(readInt(10, 1, 100), 10);
  assert.equal(readInt(1.5, 1, 100), null);
  assert.equal(readInt(1000, 1, 100), null);
  assert.equal(readInternalPath("/lottery/x"), "/lottery/x");
  assert.equal(readInternalPath("https://evil.com"), null);
  assert.equal(readInternalPath("//evil.com"), null);
  assert.equal(readInternalPath(String.raw`/\evil.com`), null);
});
