import assert from "node:assert/strict";
import test from "node:test";
import { rateLimit } from "./rateLimit";

test("blocks after the limit and resets after the window", () => {
  const key = `test:${Math.random()}`;
  const t0 = 1_000_000;
  for (let i = 0; i < 3; i++) assert.equal(rateLimit(key, 3, 60_000, t0).ok, true);
  const blocked = rateLimit(key, 3, 60_000, t0 + 1_000);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.retryAfterSec, 59);
  assert.equal(rateLimit(key, 3, 60_000, t0 + 60_000).ok, true);
});
