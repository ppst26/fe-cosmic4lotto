<!-- สำเนามาตรฐานจาก glass/docs/api/backend-integration.md — แก้ที่ glass ก่อนแล้วคัดลอกมา อย่าแก้เนื้อหาด้านล่างเฉพาะโปรเจคนี้ -->

> **มาตรฐานเดียวกันทุกโปรเจค** (glass · black-purple · lotto · cas) — เนื้อหาตั้งแต่หัวข้อ "คู่มือเชื่อมต่อ Back-end" ลงไปตรงกับ glass ทุกตัวอักษร
> ชั้นเชื่อม backend (`lib/api` · `lib/auth` · `lib/server` · hooks/api · types · mock route) ซิงก์ให้เหมือน glass แล้ว · ต่างกันเฉพาะตำแหน่งไฟล์ตามตารางนี้

| ใน glass | ในโปรเจคนี้ |
|---|---|
| `app/providers.tsx` (SWR defaults) | `components/AppProviders.tsx` |
| UI component | `app/components/*` และ `components/*` |
| `pnpm test` | `npm test` |

---

# คู่มือเชื่อมต่อ Back-end

เอกสารนี้ **ให้ backend เป็นตัวตั้ง** — backend กำหนดหน้าตา API ฝั่ง front-end ปรับตาม
และโปรเจกต์นี้ (Cosmicbet) ทำหน้าที่เป็น **ต้นแบบอ้างอิง** ให้ front-end ตัวอื่นใช้แนวทางเดียวกันได้

> ข้อความทั้งหมดเป็น **แนวทางที่แนะนำ** ไม่ใช่กฎตายตัว — ถ้าเงื่อนไขของ backend/ทีมต่างไป ปรับได้ ขอแค่ยึดหลักคิดใน §1
> คู่มือย่อสำหรับ AI agent: `agent/skills/cosmicbet-backend/SKILL.md`

---

## 1. หลักคิด 5 ข้อ

1. **Backend กำหนดสัญญา (contract), front-end ปรับตาม** — ไม่ต้องบังคับให้ backend ส่งรูปเดียวกับ mock ถ้ารูปต่างกัน front-end แปลงเอง (ดู "adapter" ใน §4)
2. **ทุกการเรียก API ผ่านที่เดียว** — มี HTTP client ตัวเดียว (ที่นี่คือ `apiFetch`) จัดการ base URL, cookie, error ให้เหมือนกันทั้งแอป
3. **UI ไม่รู้ว่าข้อมูลมาจากไหน** — component เรียก hook, hook เรียกชั้น API, ชั้น API คุยกับ backend (หรือ mock) จึงเปลี่ยนแหล่งข้อมูลได้โดยไม่แตะ UI
4. **ทุกข้อมูลมี 3 สถานะ** — กำลังโหลด · มีข้อมูล · ผิดพลาด (พร้อมลองใหม่) และมีสถานะ "ต้อง login" แยกต่างหาก
5. **Mock เป็นของชั่วคราวที่สลับได้** — ไม่ตั้ง base URL = โหมด mock, ตั้งแล้ว = ยิงจริง เพื่อให้ front-end พัฒนาต่อได้โดยไม่รอ backend

---

## 2. สถาปัตยกรรม

```
 Component (UI)
     │  เรียก hook
     ▼
 Hook รายโดเมน      app/hooks/api/*     useWallet() · useVipPlayer() ...
     │  cache · dedupe · แยกตามผู้ใช้ (SWR)
     ▼
 useApi             app/hooks/useApi.ts   useApi(key, fetcher, { auth })
     │
     ▼
 ชั้น API (adapter) lib/api/*.ts         fetchXxx() · submitXxx() · claimXxx()
     │  แปลงรูป backend → รูปที่ UI ใช้
     ▼
 HTTP client        lib/api/http.ts      apiFetch()  (base URL · cookie · ไม่ throw)
     ▼
 Backend            NEXT_PUBLIC_API_BASE_URL
```

| ชั้น | ไฟล์ | หน้าที่ |
|------|------|--------|
| สัญญา | `lib/api/endpoints.ts` | รายการ endpoint (method · path · ต้อง login ไหม) — อ่านเร็ว มีเทสต์ |
| ชนิดข้อมูล | `app/types/*.ts` | รูปข้อมูลที่ UI ใช้ |
| ชั้น API | `lib/api/*.ts` | เรียก backend + แปลงรูป — **จุดที่แก้เมื่อต่อ backend** |
| HTTP | `lib/api/http.ts` | `apiFetch<T>()` คืน `ApiResult<T>` ไม่ throw |
| Hook | `app/hooks/useApi.ts`, `app/hooks/api/*` | ดึงข้อมูล + cache |
| แสดงผล | `app/components/ui/ResourceGate.tsx` | โหลด / error+ลองใหม่ / ต้อง login |
| Mock | `app/data/*MockData.ts`, `lib/api/mock.ts`, `app/api/*` | ข้อมูลและ route จำลอง (ห้ามขึ้น production) |

---

## 3. สัญญา API ที่แนะนำ (ใช้เป็นมาตรฐานร่วมกันได้)

ส่วนนี้คือสิ่งที่ front-end ทุกตัวในเครือควรคาดหวังจาก backend — ถ้า backend ทำต่างไป ปรับที่ชั้น API ของ front-end ได้

### 3.1 รูปแบบ response

| กรณี | แนะนำ | ที่ `apiFetch` อ่านได้ตอนนี้ |
|------|-------|-----------------------------|
| สำเร็จ | HTTP 2xx + JSON (204 = ไม่มี body) | ทุก 2xx |
| ผิดพลาด | HTTP 4xx/5xx + `{ "error": "ข้อความที่แสดงผู้ใช้ได้" }` | `error` หรือ `message` (string) |
| ยังไม่ login / หมดอายุ | **401** | → `code: "UNAUTHORIZED"` (ไม่ retry) |
| ผิดที่ผู้ใช้แก้ได้ (ยอดต่ำไป, รหัสผิด) | 4xx + ข้อความในช่อง `error` | แสดงข้อความนั้นตรงๆ |
| error ของระบบ | 5xx + ข้อความกลาง ไม่มี stack trace | retry สูงสุด 3 ครั้ง |

ข้อความ error ถูกแสดงตามที่ส่งมา จึงควรเป็นภาษาของผู้ใช้ (เรื่องหลายภาษาดูตาราง §3.3)
ถ้า backend มีรูป error อื่น (เช่น `{ code, details }`) ให้เพิ่มการอ่านใน `messageFromBody()` ที่เดียว

### 3.2 Auth และ session

- ใช้ **cookie** (`HttpOnly`) เป็น session — front-end ไม่เก็บ token ใน `localStorage`
- `apiFetch` ส่ง `credentials: "include"` ทุกครั้ง
- คนละ origin: ต้องเปิด **CORS** พร้อม `Access-Control-Allow-Credentials: true` และระบุ origin (ห้าม `*`) · cookie ใช้ `Secure; SameSite=None` (คนละโดเมน) หรือ `Lax` (โดเมนเดียวกัน)
- endpoint ชุด auth ที่ front-end ใช้: `GET /api/auth/session` · `POST /api/auth/login` · `POST /api/auth/register` · `POST /api/auth/logout` · `GET|PATCH /api/auth/profile` (ชนิดอยู่ใน `app/types/auth.ts`)

### 3.3 ข้อตกลงที่ควรตกลงกับ backend ตั้งแต่ต้น

| เรื่อง | ข้อเสนอ | ตอนนี้โปรเจกต์ทำอย่างไร |
|--------|---------|------------------------|
| เวลา | ISO-8601 (`2026-11-22T09:30:00+07:00`) | แต่ละ mock ต่างกัน — แปลงในชั้น API |
| เงิน | ตกลงหน่วยให้ชัด (บาท/สตางค์, ทศนิยมกี่ตำแหน่ง) | ตัวเลขบาท · แสดงผลด้วย `lib/format.ts` |
| รูปภาพ | ส่ง URL เต็มหรือ path ที่ CDN ที่ตั้งไว้ใน `NEXT_PUBLIC_IMAGE_HOSTS` | URL/path ใน data |
| รายการยาว | แบ่งหน้าด้วย `page`/`limit` หรือ cursor | ทั้งหมดยังไม่แบ่งหน้า (ยกเว้นโพยหวย) |
| ภาษา | backend ส่งข้อความตาม `Accept-Language` หรือส่ง key ให้ front-end แปล | ข้อความ UI แปลฝั่ง front-end · ข้อความ server แสดงตามที่ส่งมา |
| การกระทำซ้ำ (กดสองครั้ง) | backend รองรับ idempotency key สำหรับ ฝาก/ถอน/แทง | front-end ล็อกปุ่มระหว่างส่ง แต่ไม่ใช่การป้องกันจริง |

---

## 4. ฝั่ง front-end: ต่อ endpoint อย่างไร

### 4.1 อ่านข้อมูล (GET)

ก่อน (mock):

```ts
// lib/api/vip.ts
export function fetchVipPlayer(): Promise<ApiResult<VipPlayerData>> {
  return mockResult(vipPlayerMock());
}
```

หลัง (ต่อ backend):

```ts
export async function fetchVipPlayer(): Promise<ApiResult<VipPlayerData>> {
  return apiFetch<VipPlayerData>(ENDPOINTS.fetchVipPlayer.path);
}
```

### 4.2 Adapter — เมื่อรูปของ backend ไม่ตรงกับที่ UI ใช้

**ไม่ต้องแก้ component และไม่ต้องบังคับ backend** — แปลงที่ชั้น API:

```ts
type VipPlayerDto = { rank_id: string; total_deposit: number; /* ...รูปจาก backend */ };

function toVipPlayer(dto: VipPlayerDto): VipPlayerData {
  return { currentRankId: dto.rank_id, depositThb: dto.total_deposit /* ... */ };
}

export async function fetchVipPlayer(): Promise<ApiResult<VipPlayerData>> {
  const res = await apiFetch<VipPlayerDto>(ENDPOINTS.fetchVipPlayer.path);
  return res.ok ? { ...res, data: toVipPlayer(res.data) } : res;
}
```

หลักคือ **ชนิดที่ชั้น API คืนให้ UI เป็นรูปที่ UI ถนัด** ส่วนรูปของ backend (DTO) อยู่แค่ในไฟล์ชั้น API
ถ้า backend เปลี่ยนรูป แก้ adapter ที่เดียว

> หมายเหตุ: ตอนนี้หลายชนิดอนุมานจาก mock (`ReturnType<typeof xxxMock>`) — เมื่อต่อจริงแนะนำให้ประกาศ `interface` ตรงๆ แล้วลบ `xxxMock()`

### 4.3 การกระทำ (POST: รับรางวัล, ส่งฟอร์ม, หมุนวงล้อ)

```ts
export async function claimCashback(input: { kind: CashbackClaimKind }): Promise<ActionResult<CashbackClaimData>> {
  const res = await apiFetch<CashbackClaimData>(ENDPOINTS.claimCashback.path, { method: "POST", body: input });
  return toActionResult(res); // { ok: true, data } | { ok: false, error: "ข้อความ" }
}
```

- ไฟล์แนบ (สลิปฝาก) → ส่ง `FormData` เป็น `body` (ดู `submitDeposit`)
- หลังการกระทำที่กระทบยอดเงิน เรียก `wallet.refresh()` (`useWallet()`)
- ถ้า response ส่งข้อมูลใหม่กลับมา ใช้ `resource.setData(...)` อัปเดต cache ทันที

### 4.4 `apiFetch` โดยย่อ

```ts
const res = await apiFetch<T>("/api/xxx", { method, body, query, headers, signal });
if (res.ok) res.data;
else res.error; // { code: "NETWORK" | "PARSE" | "UNAUTHORIZED" | "HTTP" | "ABORTED", status, message, body? }
```

ไม่ throw · `body` เป็น object → JSON, `FormData` → multipart · `query` ตัดค่า null/undefined ให้

---

## 5. Hook และการแสดงผล

```ts
// app/hooks/api/member.ts
export const useVipPlayer = () => useApi(["vip-player"], fetchVipPlayer, { auth: true });
```

`useApi(key, fetcher, { auth })` คืน `{ data, status, error, isRefreshing, refresh, setData }`

- `status`: `idle` (ต้อง login แต่ยังไม่ login) · `loading` · `ready` · `error`
- `auth: true` → ยังไม่ login จะไม่ยิง และ **cache แยกตามผู้ใช้** (สลับบัญชีไม่เห็นข้อมูลคนก่อน)
- `key` ควรรวมพารามิเตอร์ที่ทำให้ข้อมูลต่างกัน เช่น `["transactions", kind, from, to]` · `null` = ยังไม่ขอ
- ค่าเริ่มต้น (`app/providers.tsx`): ไม่ดึงใหม่ตอนสลับแท็บ · 4xx ไม่ retry · network/5xx retry สูงสุด 3 ครั้ง
- `usePrefetchApi` อุ่น cache แท็บข้างเคียง (key ต้องตรงกับ hook จริง)

แสดงผล:

```tsx
const vip = useVipPlayer();
<ResourceGate resource={vip}>{(data) => <VipCard player={data} />}</ResourceGate>
```

`ResourceGate` จัดการ โหลด / error + ปุ่มลองใหม่ / ยังไม่ login (การ์ดชวน login) ให้ครบ

<details>
<summary>รายการ hook ที่มี</summary>

| ไฟล์ | hook |
|------|------|
| `account.ts` | `useProfile` · `useWallet` · `useNotificationFeed` |
| `money.ts` | `useDepositMethods` · `useDepositBankAccount` · `useDepositQuickAmounts` · `useWithdrawAccount` · `useWithdrawBalance` · `useWithdrawQuickAmounts` |
| `transactions.ts` | `useTransactions` · `usePrefetchTransactionKinds` |
| `member.ts` | `useProfileHubStats` · `useMenuTicketCount` · `useSignUpOptions` · `useVip*` · `useReferral*` · `useCashbackPanels` · `useLossRebate` · `useCheckIn` · `useGemsStore` · `useWheel` · `useRewardHub` · `useLuckyBox` · `useRandomCard` · `useExchangeMoney` · `useFreespins` · `useActivities` · `usePrefetch*Tabs` |
| `lottery.ts` | `useLotteryCatalog` · `useLotteryHub` · `useLotteryPlayRounds` · `useYikiBoard` · `useThaiLottoBoard` · `useLotteryResults` · `usePrefetchLotteryRounds` |
| `lotterySlips.ts` | `useLotterySlipFirstPage` · `usePrefetchLotterySlipTab` |
| `promotions.ts` | `usePromotionDetail` · `usePromotionClaimStatus` · `useMyPromotions` · `useSubmitPromotionClaim` |

</details>

---

## 6. Session กับการกันหน้า

- `AuthProvider` เรียก `GET /api/auth/session` ตอนเปิดแอป · `useAuth()` ให้ `user` · `isAuthenticated` · `login` · `register` · `logout`
- `proxy.ts` เป็น **ด่านแรก** กันหน้าที่ต้อง login (`lib/auth/protectedPaths.ts`) — backend ต้องตรวจสิทธิ์ทุก endpoint เองเสมอ
- วิธีตรวจของ proxy ขึ้นกับโหมด (`lib/auth/proxySession.ts`) ไม่ต้องแก้โค้ด:

| โหมด | proxy ทำอะไร |
|------|-------------|
| mock (ไม่ตั้ง `NEXT_PUBLIC_API_BASE_URL`) | ตรวจลายเซ็น cookie `cm_session` |
| backend จริง + ตั้ง `AUTH_SESSION_COOKIE=<ชื่อ>` | เช็กว่ามี cookie ชื่อนั้น (backend ตัดสินเนื้อ token) |
| backend จริง + ไม่ตั้ง | ไม่กันที่ proxy (cookie ของ API คนละโดเมนอ่านไม่ได้) — หน้า member แสดงการ์ดชวน login เอง และ backend ตอบ 401 |

---

## 7. ข้อมูลที่ดึงฝั่ง server

| ที่ | ฟังก์ชัน | ลักษณะ |
|----|---------|--------|
| lobby layout | `loadLobbyContent()` | เรียก 6 endpoint พร้อมกัน ส่งเป็น props · ตัวไหนพลาดใช้ค่าว่าง หน้าไม่พัง |
| metadata | `loadSiteBrand()` | พลาดแล้วใช้ค่า default |
| `/lottery/[marketId]` | `generateStaticParams` ← `fetchLotteryCatalog()` | พลาดตอน build = ไม่ prerender |

ต้องตั้ง `NEXT_PUBLIC_API_BASE_URL` เป็น URL แบบ absolute เพราะเรียกจาก server · endpoint กลุ่มนี้เป็น public ควรตั้ง `Cache-Control`

---

## 8. Environment variables

| ตัวแปร | ความหมาย |
|--------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | base URL ของ backend (ไม่มี `/` ท้าย) · **ว่าง = โหมด mock** |
| `AUTH_SESSION_COOKIE` | ชื่อ cookie session ของ backend (ดู §6) |
| `NEXT_PUBLIC_IMAGE_HOSTS` | origin รูปจาก CDN สำหรับ `next/image` (คั่น comma) |
| `NEXT_PUBLIC_SITE_URL` | URL เว็บจริง ใช้สร้างลิงก์ชวนเพื่อนตอน SSR |
| `AUTH_SESSION_SECRET` · `AUTH_ENABLE_DEMO_USER` · `AUTH_DEMO_LOGIN_PHONE` · `AUTH_DEMO_LOGIN_PASSWORD` | เฉพาะ mock auth — เมื่อใช้ backend จริงไม่ต้องใช้ (ห้ามเปิดเดโมบนเว็บจริง) |

### โหมด mock ทำงานอย่างไร

ไม่ตั้ง `NEXT_PUBLIC_API_BASE_URL`:

- auth / หวย (ส่ง-ดูโพย) / โปรโมชัน → เรียก mock route ใน `app/api/*`
- ฝาก / ถอน / คูปอง → คืนผลจำลองในโค้ด (`isMockMode()` ใน `lib/api/mock.ts`)
- ที่เหลือ → `mockResult(...)` จาก `app/data/*MockData.ts`

ตั้ง base URL แล้ว: auth, หวย, โปรโมชัน, ฝาก, ถอน, คูปอง ยิง backend จริงทันที · ส่วนที่เหลือยังคืน mock จนกว่าจะแก้ฟังก์ชันใน `lib/api/*`

---

## 9. สถานะปัจจุบันของ endpoint

แหล่งความจริงคือ `lib/api/endpoints.ts` · `🔒` = ต้อง login · ✅ = ต่อ `apiFetch` แล้ว (ที่เหลือยังเป็น mock)

| กลุ่ม | endpoint |
|------|----------|
| Auth ✅ | `GET /api/auth/session` · `POST /api/auth/{login,register}` · `POST /api/auth/logout 🔒` · `GET\|PATCH /api/auth/profile 🔒` · `GET /api/auth/sign-up-options` |
| กระเป๋าเงิน 🔒 | `GET /api/wallet/balance` · `GET /api/deposit/{methods,bank-account,quick-amounts}` · `POST /api/deposit` ✅ (multipart + สลิป) · `GET /api/withdraw/{account,balance,quick-amounts}` · `POST /api/withdraw` ✅ · `POST /api/coupons/redeem` ✅ · `GET /api/transactions?kind&from&to` |
| สมาชิก / รางวัล 🔒 | `GET /api/profile/hub-stats` · `GET /api/menu/ticket-count` · `GET /api/notifications` · `GET /api/vip/player` · `GET /api/referral/{overview,users,earnings}` · `POST /api/referral/claim` · `GET /api/cashback` · `GET /api/cashback/loss-rebate` · `POST /api/cashback/claim` · `GET /api/missions/check-in` · `POST /api/missions/check-in/claim` · `POST /api/missions/check-in/milestones/claim` · `GET /api/gems-store` · `POST /api/gems-store/redeem` · `GET /api/wheel` · `POST /api/wheel/spin` · `GET /api/reward/{hub,lucky-box,random-card,exchange-money,freespins}` |
| สาธารณะ | `GET /api/vip/{ranks,benefits}` · `GET /api/activities` · `GET /api/site/brand` |
| Lobby (public, ฝั่ง server) | `GET /api/lobby/{banners,highlights,games,providers,feature-actions,tournaments,most-online,announcements,hall-of-fame}` |
| โปรโมชัน ✅ | `GET /api/promotions` · `GET /api/promotions/:id` · `GET /api/promotions/mine 🔒` · `GET\|POST /api/promotions/:id/claim 🔒` |
| หวย | `GET /api/lottery/{catalog,hub,markets,results?date=}` · `GET /api/lottery/markets/:slug/rounds` · `GET /api/lottery/{yiki,thai}/board` · `POST /api/lottery/bets 🔒 ✅` · `GET /api/lottery/slips 🔒 ✅` · `GET /api/lottery/slips/:slipId 🔒 ✅` |

---

## 10. ลำดับงานที่แนะนำ

1. ตั้ง `NEXT_PUBLIC_API_BASE_URL` + เปิด CORS/credentials ฝั่ง backend
2. **auth ก่อน** (`session` → `login` → `logout` → `profile`)
3. `GET /api/wallet/balance` — ยอดบน header ขึ้นจริง ใช้ตรวจว่า cookie/CORS ถูก
4. ต่อ endpoint อ่านข้อมูลทีละโดเมน (ทีละฟังก์ชัน ทีละ commit)
5. ต่อการกระทำ (POST) ทีหลังสุด และตรวจว่ายอดเงินเปลี่ยนจริง
6. ลบ mock ที่ไม่ใช้ และ **ปิด `app/api/*` ก่อนขึ้น production**

เช็กก่อนปิดงานแต่ละ endpoint:

- [ ] hook ที่ต้อง login ใส่ `{ auth: true }`
- [ ] ลองทั้ง โหลด · ว่าง · error (ตัดเน็ต/ส่ง 500 ดูปุ่มลองใหม่) · 401
- [ ] ไม่มีข้อมูล/ยอดเงิน/ผู้ชนะปลอมค้างหลังต่อจริง
- [ ] `npx tsc --noEmit -p . && pnpm test` ผ่าน

---

## 11. ใช้โปรเจกต์นี้เป็นต้นแบบให้ front-end อื่น

ไม่ผูกกับ Next.js — โครงคิดเดียวกันใช้ได้กับ React/Vue/Svelte/มือถือ

**ส่วนที่นำไปใช้ซ้ำได้ตรงๆ (copy แล้วปรับเล็กน้อย)**

| ส่วน | ไฟล์ | หมายเหตุ |
|------|------|---------|
| HTTP client ไม่ throw + ชนิด `ApiResult` / `ApiError` | `lib/api/http.ts` | framework-agnostic ล้วน |
| `ActionResult` + `toActionResult` + `isMockMode` | `lib/api/mock.ts` | |
| แผนที่ endpoint + เทสต์ | `lib/api/endpoints.ts` | เปลี่ยนรายการเป็นของโปรเจกต์ |
| แนวคิด `useApi` (key + fetcher + auth → data/status/error/refresh/setData) | `app/hooks/useApi.ts` | ผูกกับ SWR · Vue ใช้ `useSWRV`/TanStack Query ได้ |
| สถานะ 4 แบบ + การ์ดโหลด/error/ชวน login | `apiStatus.ts`, `ResourceGate.tsx` | UI เปลี่ยนตามดีไซน์ |
| ตัวตัดสิน session ของ proxy | `lib/auth/proxySession.ts` | pure function + เทสต์ |

**ส่วนเฉพาะโปรเจกต์นี้ (ไม่ต้องก๊อป)**: ดีไซน์/ธีม · i18n ของ Cosmicbet · `app/data/*` · domain ของหวย/VIP/วงล้อ

**ขั้นตอนเริ่มโปรเจกต์ใหม่**

1. ก๊อป HTTP client + `ApiResult`, ตั้ง `NEXT_PUBLIC_API_BASE_URL`
2. ทำ `endpoints` ของโปรเจกต์ตามสัญญา backend (§3)
3. สร้างชั้น API ทีละโดเมน — เริ่มด้วย mock แล้วค่อยสลับเป็น `apiFetch` (ใช้ adapter §4.2 เมื่อรูปต่าง)
4. ทำ hook รายโดเมนบน `useApi`-แบบเดียวกัน
5. ใช้ `ResourceGate`-แบบเดียวกัน เพื่อให้ทุกแอปมีสถานะโหลด/error/ต้อง login เหมือนกัน

**ที่ควรเหมือนกันทุกแอป** (เพื่อให้ backend ดูแลง่าย): cookie session · รูป error `{ error }` · 401 = ต้อง login · เวลา ISO-8601 · สถานะ 4 แบบใน UI
**ที่แต่ละแอปปรับเองได้**: ชื่อ endpoint · รูป response (ใช้ adapter) · สถาปัตยกรรม hook/cache · UI ทั้งหมด

**โปรเจคในเครือที่ใช้มาตรฐานนี้แล้ว**: black-purple · lotto · cas — ชั้นเชื่อม backend (`lib/api` · `lib/auth` · `lib/server` · `lib/domain` · `lib/lottery` · `lib/promotions` · `app/hooks/api` · `app/types` · `app/api` · `proxy.ts`) คัดลอกจาก glass ทุกไฟล์ และเอกสารนี้ถูกคัดลอกไปที่ `docs/api/backend-integration.md` ของแต่ละโปรเจค (ต้นไฟล์มีตารางตำแหน่งไฟล์ที่ต่าง เช่น cas อยู่ใต้ `src/`) · เปลี่ยนสัญญา API ให้แก้ที่ glass ก่อนแล้วซิงก์ออกไป เพื่อให้ต่อ backend พร้อมกันได้ด้วยโค้ดชุดเดียว

---

## 12. ข้อควรรู้

- `app/api/*` เป็น mock server (เก็บผู้ใช้ในไฟล์/หน่วยความจำ ไม่ตัดเงิน ไม่เช็กรอบหวย) — **อย่า deploy ขึ้น production**
- มีเทสต์กันไม่ให้ไฟล์ UI ใหม่ import `app/data/*MockData` ตรง (`lib/api/mockDataImports.test.ts`) — ไฟล์เดิมที่เหลือส่วนใหญ่เป็น config คงที่ (เมนู, footer, ไอคอน, rank helper) ไม่ใช่ข้อมูลจาก backend
- สิ่งที่ยังเป็น mock ในฝั่ง UI: `getThaiLottoDrawByRoundId` (เวลาปิด/ออกผลหวยรัฐบาลคำนวณจาก round id ด้วยกฎ 15:00/16:00 — ถ้า backend กำหนดรอบ ให้อ่านจาก `/api/lottery/markets/:slug/rounds`) และ `PendingTransactionProvider` (รายการ pending หลังฝาก/ถอนสร้างจาก mock — เมื่อ backend ส่งข้อมูลรายการกลับมา ให้ขยายผลลัพธ์ของ `submitDeposit`/`submitWithdraw`)
- ความปลอดภัยที่ backend ต้องทำเอง: ตรวจสิทธิ์ทุก endpoint · validate input · rate limit login/register · ตัดเงิน+เช็กรอบหวยใน transaction เดียว · เพิกถอน token ตอน logout (รายละเอียดดู `README.md` หัวข้อ "ความปลอดภัยที่ทำไว้แล้ว")
