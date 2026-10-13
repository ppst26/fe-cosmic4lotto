import assert from "node:assert/strict";
import test from "node:test";
import { API_ERROR_MESSAGES, apiFetch, apiUrl } from "./http";

/** จำลอง browser (มี window) — test ฝั่ง server ด้านล่างลบออกชั่วคราว */
(globalThis as { window?: unknown }).window ??= globalThis;

/** แทน global fetch ชั่วคราวในแต่ละ test */
function mockFetch(impl: (url: string, init?: RequestInit) => Promise<Response>) {
  const original = globalThis.fetch;
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    return impl(url, init);
  }) as typeof fetch;
  return { calls, restore: () => (globalThis.fetch = original) };
}

test("apiUrl appends query and drops empty values", () => {
  assert.equal(apiUrl("/api/x"), "/api/x");
  assert.equal(apiUrl("/api/x", { page: 2, q: "a b", skip: undefined, none: null }), "/api/x?page=2&q=a+b");
});

test("apiFetch returns data and sends JSON with credentials", async () => {
  const m = mockFetch(async () => Response.json({ user: { id: "1" } }));
  try {
    const res = await apiFetch<{ user: { id: string } }>("/api/auth/login", {
      method: "POST",
      body: { phone: "0800000000" },
    });
    assert.deepEqual(res, { ok: true, status: 200, data: { user: { id: "1" } } });
    const init = m.calls[0].init!;
    assert.equal(init.credentials, "include");
    assert.equal(init.body, JSON.stringify({ phone: "0800000000" }));
    assert.equal((init.headers as Record<string, string>)["Content-Type"], "application/json");
  } finally {
    m.restore();
  }
});

test("apiFetch uses the server error message on HTTP errors", async () => {
  const m = mockFetch(async () => Response.json({ ok: false, error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 }));
  try {
    const res = await apiFetch("/api/auth/login", { method: "POST", body: {} });
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.error.code, "UNAUTHORIZED");
      assert.equal(res.error.status, 401);
      assert.equal(res.error.message, "รหัสผ่านไม่ถูกต้อง");
    }
  } finally {
    m.restore();
  }
});

test("apiFetch falls back to a generic message when the error body is not JSON", async () => {
  const m = mockFetch(async () => new Response("<html>502</html>", { status: 502 }));
  try {
    const res = await apiFetch("/api/x");
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.error.code, "HTTP");
      assert.equal(res.error.message, API_ERROR_MESSAGES.generic);
    }
  } finally {
    m.restore();
  }
});

test("apiFetch maps network failures and bad JSON without throwing", async () => {
  const offline = mockFetch(async () => {
    throw new TypeError("Failed to fetch");
  });
  try {
    const res = await apiFetch("/api/x");
    assert.equal(res.ok, false);
    if (!res.ok) assert.equal(res.error.code, "NETWORK");
  } finally {
    offline.restore();
  }

  const broken = mockFetch(async () => new Response("{not json", { status: 200 }));
  try {
    const res = await apiFetch("/api/x");
    assert.equal(res.ok, false);
    if (!res.ok) assert.equal(res.error.code, "PARSE");
  } finally {
    broken.restore();
  }
});

test("apiFetch on the server without a base URL fails with a config message instead of fetching", async () => {
  const g = globalThis as { window?: unknown };
  const hadWindow = "window" in g;
  const savedWindow = g.window;
  delete g.window;
  const m = mockFetch(async () => Response.json({}));
  try {
    const res = await apiFetch("/api/x");
    assert.equal(res.ok, false);
    if (!res.ok) assert.match(res.error.message, /NEXT_PUBLIC_API_BASE_URL/);
    assert.equal(m.calls.length, 0);
  } finally {
    m.restore();
    if (hadWindow) g.window = savedWindow;
  }
});
