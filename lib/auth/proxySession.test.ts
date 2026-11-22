import assert from "node:assert/strict";
import test from "node:test";
import { createSessionToken } from "./session";
import { hasProxySession } from "./proxySession";

const cookies = (map: Record<string, string>) => (name: string) => map[name];

test("mock mode accepts only a validly signed cm_session token", () => {
  const good = createSessionToken("42");
  assert.equal(hasProxySession({ apiBaseUrl: "", getCookie: cookies({ cm_session: good }) }), true);
  assert.equal(hasProxySession({ apiBaseUrl: "", getCookie: cookies({ cm_session: "x.1.bad" }) }), false);
  assert.equal(hasProxySession({ apiBaseUrl: "", getCookie: cookies({}) }), false);
});

test("real backend with a configured cookie name only checks the cookie exists", () => {
  const input = { apiBaseUrl: "https://api.example.com", sessionCookieName: "sid" };
  assert.equal(hasProxySession({ ...input, getCookie: cookies({ sid: "opaque-token" }) }), true);
  assert.equal(hasProxySession({ ...input, getCookie: cookies({ sid: "  " }) }), false);
  assert.equal(hasProxySession({ ...input, getCookie: cookies({ cm_session: createSessionToken("1") }) }), false);
});

test("real backend without a cookie name does not gate at the proxy", () => {
  assert.equal(hasProxySession({ apiBaseUrl: "https://api.example.com", getCookie: cookies({}) }), true);
});
