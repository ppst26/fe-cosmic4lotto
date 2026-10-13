/**
 * HTTP client กลาง — ทุกการเรียก backend ผ่าน apiFetch() ตัวเดียว
 * ใช้ใน lib/auth/client.ts · lib/lottery/* · PromotionsCatalogProvider และ lib/api/* เมื่อเปลี่ยนจาก mock
 *
 * - base URL จาก NEXT_PUBLIC_API_BASE_URL (ว่าง = same-origin → mock route ใน app/api)
 * - ส่ง cookie ทุกครั้ง (credentials: "include") — backend คนละ origin ต้องเปิด CORS + credentials
 * - ไม่ throw: คืน ApiResult เสมอ ทั้ง network error / HTTP error / JSON พัง
 */

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

export const API_ERROR_MESSAGES = {
  network: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่",
  parse: "ไม่สามารถอ่านผลจากเซิร์ฟเวอร์",
  unauthorized: "กรุณาเข้าสู่ระบบใหม่",
  generic: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
} as const;

/** key ของข้อความ default ฝั่ง client — ตรงกับ errors.api.<key> ใน dictionary */
export type ApiErrorMessageKey = keyof typeof API_ERROR_MESSAGES;

/**
 * ข้อความ error เป็นค่า default ของ apiFetch หรือไม่ (ไม่ใช่ข้อความจาก server)
 * → คืน key ให้ UI แปลด้วย useApiErrorText() · ข้อความจาก server คืน null (แสดงตามเดิม)
 */
export function apiErrorMessageKey(message: string | null | undefined): ApiErrorMessageKey | null {
  if (!message) return null;
  for (const key of Object.keys(API_ERROR_MESSAGES) as ApiErrorMessageKey[]) {
    if (API_ERROR_MESSAGES[key] === message) return key;
  }
  return null;
}

/** ประเภท error ที่ UI ใช้ตัดสินใจได้ (เช่น 401 → เปิด login) */
export type ApiErrorCode = "NETWORK" | "PARSE" | "UNAUTHORIZED" | "HTTP" | "ABORTED";

export interface ApiError {
  code: ApiErrorCode;
  /** HTTP status · 0 เมื่อไม่ได้รับ response */
  status: number;
  /** ข้อความพร้อมแสดงผู้ใช้ — ใช้ข้อความจาก server ถ้ามี */
  message: string;
  /** body ดิบจาก server (ถ้า parse ได้) — สำหรับ field error เฉพาะโดเมน */
  body?: unknown;
}

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; error: ApiError };

export type QueryValue = string | number | boolean | null | undefined;

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** object → JSON · FormData → multipart (เช่น อัปโหลดสลิป) */
  body?: unknown;
  /** ค่า null / undefined ถูกตัดทิ้ง */
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cache?: RequestCache;
}

/** ต่อ base URL + path + query — path ต้องขึ้นต้นด้วย "/" */
export function apiUrl(path: string, query?: Record<string, QueryValue>): string {
  let url = `${API_BASE_URL}${path}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined) continue;
      params.set(key, String(value));
    }
    const qs = params.toString();
    if (qs) url += `${url.includes("?") ? "&" : "?"}${qs}`;
  }
  return url;
}

/** ดึงข้อความ error จาก body รูปแบบที่ใช้อยู่: { error } · { message } */
function messageFromBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  for (const key of ["error", "message"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

async function readJson(res: Response): Promise<{ ok: true; value: unknown } | { ok: false }> {
  if (res.status === 204) return { ok: true, value: null };
  const text = await res.text();
  if (!text) return { ok: true, value: null };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

/**
 * เรียก API แล้วคืนผลแบบไม่ throw
 * ตัวอย่าง: const res = await apiFetch<{ user: SessionUser | null }>("/api/auth/session");
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<ApiResult<T>> {
  const { method = "GET", body, query, headers, signal, cache } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  /** ฝั่ง server (เช่น layout ที่โหลดเนื้อหา lobby) fetch path แบบ relative ไม่ได้ — ต้องมี base URL แบบ absolute */
  if (typeof window === "undefined" && !API_BASE_URL) {
    return {
      ok: false,
      error: {
        code: "NETWORK",
        status: 0,
        message: "ยังไม่ได้ตั้ง NEXT_PUBLIC_API_BASE_URL สำหรับการเรียก API ฝั่ง server",
      },
    };
  }

  let res: Response;
  try {
    res = await fetch(apiUrl(path, query), {
      method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
      signal,
      cache,
    });
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === "AbortError";
    return {
      ok: false,
      error: {
        code: aborted ? "ABORTED" : "NETWORK",
        status: 0,
        message: API_ERROR_MESSAGES.network,
      },
    };
  }

  const parsed = await readJson(res);

  if (!res.ok) {
    const errorBody = parsed.ok ? parsed.value : undefined;
    const unauthorized = res.status === 401;
    return {
      ok: false,
      error: {
        code: unauthorized ? "UNAUTHORIZED" : "HTTP",
        status: res.status,
        message:
          messageFromBody(errorBody) ??
          (unauthorized ? API_ERROR_MESSAGES.unauthorized : API_ERROR_MESSAGES.generic),
        body: errorBody,
      },
    };
  }

  if (!parsed.ok) {
    return {
      ok: false,
      error: { code: "PARSE", status: res.status, message: API_ERROR_MESSAGES.parse },
    };
  }

  return { ok: true, status: res.status, data: parsed.value as T };
}
