import assert from "node:assert/strict";
import test from "node:test";
import { MAX_AGE_SEC, createSessionToken, parseSessionToken } from "./session";

test("valid token parses back to the user id", () => {
  const now = Date.now();
  assert.equal(parseSessionToken(createSessionToken("u1", now), now), "u1");
});

test("tampered, malformed or missing tokens are rejected", () => {
  const now = Date.now();
  const token = createSessionToken("u1", now);
  assert.equal(parseSessionToken(token.replace("u1.", "u2."), now), null);
  assert.equal(parseSessionToken(`${token}x`, now), null);
  assert.equal(parseSessionToken("a.b", now), null);
  assert.equal(parseSessionToken(undefined, now), null);
});

test("expired and future-dated tokens are rejected", () => {
  const issued = Date.now();
  const token = createSessionToken("u1", issued);
  assert.equal(parseSessionToken(token, issued + MAX_AGE_SEC * 1000 + 1), null);
  assert.equal(parseSessionToken(createSessionToken("u1", issued + 60 * 60 * 1000), issued), null);
});
