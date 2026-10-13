import assert from "node:assert/strict";
import test from "node:test";
import { resolveApiStatus } from "./apiStatus";

const s = (hasKey: boolean, hasData: boolean, hasError: boolean, isValidating: boolean) =>
  resolveApiStatus({ hasKey, hasData, hasError, isValidating });

test("no key (not logged in) is idle", () => {
  assert.equal(s(false, false, false, false), "idle");
});

test("no data yet is loading, including a retry after an error", () => {
  assert.equal(s(true, false, false, true), "loading");
  assert.equal(s(true, false, true, true), "loading");
});

test("first load failure is error", () => {
  assert.equal(s(true, false, true, false), "error");
});

test("background refresh keeps data ready", () => {
  assert.equal(s(true, true, false, true), "ready");
});

test("failed refresh with stale data reports error", () => {
  assert.equal(s(true, true, true, false), "error");
});
