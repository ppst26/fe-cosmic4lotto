import type { ApiResult } from "./http";

/**
 * ห่อ mock ให้มีรูปเดียวกับ apiFetch — ใช้ใน lib/api/* ระหว่างยังไม่มี backend
 * ต่อ backend: แทน `return mockResult(X)` ด้วย `return apiFetch<T>(ENDPOINTS.<name>.path, ...)`
 */
export function mockResult<T>(data: T): Promise<ApiResult<T>> {
  return Promise.resolve({ ok: true, status: 200, data });
}
