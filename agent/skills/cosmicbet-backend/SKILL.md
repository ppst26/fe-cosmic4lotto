---
name: cosmicbet-backend
description: >-
  Connects the Cosmicbet front-end to a real back-end API: replaces mock data in lib/api/*
  with apiFetch, wires auth-aware SWR hooks in app/hooks/api/*, and verifies loading/error
  states. Use when the user asks to connect/integrate an API or backend, replace mock data,
  add an endpoint, add a data hook, or fix a fetch/401/CORS problem.
---

# Cosmicbet Back-end Integration

> ซิงก์จาก glass — ตำแหน่งไฟล์ที่ต่างจาก glass ดูตารางต้น `docs/api/shared-backend-layer.md` · ห้ามแก้ที่นี่

คู่มือเต็มสำหรับทีม: `docs/api/backend-integration.md` — อ่านก่อนถ้าเป็นงานใหญ่ (ต่อทั้งโดเมน/auth)

## สถาปัตยกรรม (จำให้ได้)

```
Component → hook (app/hooks/api/*) → useApi (SWR) → lib/api/*.ts → apiFetch (lib/api/http.ts) → Backend
```

**Backend เป็นตัวตั้ง** — ต่อ backend = แก้ฟังก์ชันใน `lib/api/*.ts` · ถ้ารูป response ต่างจากที่ UI ใช้ ให้แปลงที่นั่น (adapter) ไม่ต้องแก้ component และไม่ต้องบังคับ backend · กฎด้านล่างเป็นแนวทาง ปรับได้เมื่อมีเหตุผล

## กฎห้าม

- ห้ามเรียก `fetch()` หรือ `fetchXxx()` ตรงจาก component — ใช้ hook ใน `app/hooks/api/*`
- ห้ามสร้าง HTTP client ใหม่ — ใช้ `apiFetch` ตัวเดียว (ไม่ throw, คืน `ApiResult<T>`)
- ห้ามเก็บ token ใน localStorage — session เป็น cookie (`credentials: "include"` อยู่ใน apiFetch แล้ว)
- ห้ามไฟล์ UI ใหม่ import `app/data/*MockData` ตรง (เทสต์ `lib/api/mockDataImports.test.ts` จะล้ม) — ผ่าน lib/api + hook · ย้ายไฟล์เก่าออกแล้วลบจาก `ALLOWED_LEGACY`
- ห้ามเพิ่มหน้าโหลดใหม่หรือเปลี่ยน UI ในรอบที่เปลี่ยนจาก mock เป็น HTTP
- ห้ามสร้างผลธุรกรรม/ยอดเงิน/ผู้ชนะปลอมให้ดูสำเร็จ — ไม่มี endpoint = แจ้งผู้ใช้ว่ายังไม่เชื่อม
- ห้าม deploy `app/api/*` (mock server) ขึ้น production

## ขั้นตอนต่อ endpoint (อ่านข้อมูล GET)

1. หา path/method/auth ใน `lib/api/endpoints.ts` (ไม่มี → เพิ่มที่นั่น + เทสต์ใน `endpoints.test.ts`)
2. แก้ฟังก์ชันใน `lib/api/<domain>.ts`:
   ```ts
   export function fetchVipPlayer(): Promise<ApiResult<VipPlayerData>> {
     return apiFetch<VipPlayerData>(ENDPOINTS.fetchVipPlayer.path);   // เดิม: mockResult(...)
   }
   ```
3. ถ้า backend ส่งรูปต่าง → map ในฟังก์ชันนี้ให้ออกมาเป็นชนิดที่ UI ใช้ (ดู adapter ใน `docs/api/backend-integration.md` §4.2)
4. ตรวจ hook ใน `app/hooks/api/*`: endpoint ที่ `auth: true` ต้องมี `{ auth: true }` · key ต้องรวมพารามิเตอร์ที่ทำให้ข้อมูลต่าง
5. ถ้ามี prefetch (`usePrefetchApi`) key/load ต้องตรงกับ hook จริง
6. ลบ `app/data/*MockData.ts` เฉพาะเมื่อไม่มีใคร import แล้ว (`grep` ก่อน)

## ขั้นตอนต่อ action (POST: claim / submit / spin)

```ts
const res = await apiFetch<Data>(ENDPOINTS.claimCashback.path, { method: "POST", body: input });
return toActionResult(res);   // ActionResult<T> = { ok: true, data } | { ok: false, error: string }
```

- ไฟล์แนบ (สลิปฝาก) → ส่ง `FormData` เป็น `body`
- หลัง action ที่กระทบยอด → UI เรียก `wallet.refresh()` (`useWallet()`) · ถ้า response ส่งข้อมูลใหม่มา ใช้ `resource.setData(...)`
- ฝาก/ถอน/คูปอง (`submitDeposit` · `submitWithdraw` · `submitCoupon`) ต่อ apiFetch แล้ว สลับ mock/จริงด้วย `isMockMode()` (ไม่ตั้ง `NEXT_PUBLIC_API_BASE_URL` = mock) — ฟังก์ชันใหม่ที่ไม่มี mock route ใช้รูปแบบเดียวกัน

## เพิ่ม hook ใหม่

```ts
// app/hooks/api/<domain>.ts
export const useThing = () => useApi(["thing"], fetchThing, { auth: true });
export const useThingById = (id: string | null) => useApi(id ? ["thing", id] : null, () => fetchThing(id!), { auth: true });
```

แสดงผลด้วย `ResourceGate` (loading · error+ลองใหม่ · idle = LoginPrompt) — ข้อมูลจาก API ต้องมีครบ 3 สถานะ

## Error contract กับ backend

- สำเร็จ: 2xx + JSON · ผิดพลาด: 4xx/5xx + `{ "error": "ข้อความไทยพร้อมแสดง" }` (หรือ `message`)
- 401 = ยังไม่ login/หมดอายุ (SWR ไม่ retry) · 5xx/network retry สูงสุด 3 ครั้ง
- `ApiError.code`: `NETWORK | PARSE | UNAUTHORIZED | HTTP | ABORTED` · อย่า throw ใน lib/api

## Env / CORS

- `NEXT_PUBLIC_API_BASE_URL` ว่าง = ใช้ mock route · ตั้งแล้ว = ยิงไป backend
- ฝั่ง server (lobby, site brand) ต้องใช้ URL แบบ absolute
- คนละ origin: backend ต้องเปิด CORS + `Access-Control-Allow-Credentials: true` + ระบุ origin (ห้าม `*`)

## Auth

- `AuthProvider` เรียก `GET /api/auth/session` ตอนเปิดแอป · contract ใน `app/types/auth.ts`
- `proxy.ts` ตัดสินใน `lib/auth/proxySession.ts` ตามโหมด: mock = ตรวจ HMAC `cm_session` · backend จริง + `AUTH_SESSION_COOKIE` = เช็กว่ามี cookie · ไม่ตั้ง = ไม่กันที่ proxy (หน้า member ใช้ ResourceGate/LoginPrompt + 401) — ไม่ต้องแก้โค้ดตอนเปลี่ยนไป backend จริง
- หน้า member ใหม่ → เพิ่ม path ใน `lib/auth/protectedPaths.ts` · backend ต้องตรวจสิทธิ์ซ้ำเสมอ

## ตรวจก่อนส่งงาน

```bash
npx tsc --noEmit -p .   # ต้องผ่าน
pnpm test               # ต้องผ่าน (endpoints.test.ts ตรวจแผนที่ endpoint)
grep -rnE "(^|[^A-Za-z])fetch\(" app --include=*.tsx   # ต้องไม่มี fetch() ตรงใน component
```

แจ้งผู้ใช้เสมอว่า: endpoint ไหนต่อจริงแล้ว · endpoint ไหนยังเป็น mock · ส่วนที่ยัง import `app/data/*` ตรง (ต้องย้ายมาผ่าน lib/api ก่อน)
