<!-- ซิงก์จาก glass/docs/api/shared-backend-layer.md ด้วย glass/scripts/backend-layer/sync.mjs — ห้ามแก้ที่นี่ แก้ที่ glass แล้วซิงก์ -->

> **มาตรฐานเดียวกันทุกโปรเจค** (glass · black-purple · lotto · cas) — เนื้อหาใต้เส้นคั่นตรงกับ glass ทุกตัวอักษร
> โปรเจคนี้: **lotto** · ตำแหน่งไฟล์ที่ต่างจาก glass:

| ใน glass | ในโปรเจคนี้ |
|---|---|
| (ทั่วไป) | ตำแหน่งเดียวกับ glass |
| `app/providers.tsx` (SWR defaults) | `components/AppProviders.tsx` |
| UI component | `app/components/*` และ `components/*` |
| `pnpm test` · `pnpm lint` | `npm test` · `npm run lint` |

---

# มาตรฐานร่วม 4 โปรเจค — ชั้นเชื่อม back-end

เอกสารนี้อธิบายโครงสร้างที่ **glass · black-purple · lotto · cas** ใช้ร่วมกัน เพื่อให้ต่อ back-end พร้อมกันได้ด้วยโค้ดชุดเดียว
วิธีต่อ endpoint ทีละตัว (apiFetch · adapter · hook · env) อยู่ใน [`docs/api/backend-integration.md`](backend-integration.md)

---

## 1. หลักการ

1. **glass คือต้นแบบ** — "ชั้นเชื่อม back-end" (§3) ของทุกโปรเจคต้องเหมือน glass ทุกไฟล์
2. **แยกชั้นชัดเจน** — UI ไม่รู้ว่าข้อมูลมาจาก mock หรือ backend จริง เปลี่ยนแหล่งข้อมูลที่ `lib/api/*` ที่เดียว
3. **แต่ละแบรนด์ต่างกันได้เฉพาะ UI** — ดีไซน์ ธีม เลย์เอาต์ ข้อความแปล เนื้อหา mock ต่างกันได้ ส่วนสัญญากับ backend ต้องเหมือนกัน
4. **กฎต้องมีตัวบังคับ** — ESLint + เทสต์ (§4) ไม่พึ่งการจำ

---

## 2. ชั้นของแอป

```
 UI (หน้า · component)            app/[lang]/* · app/components/* · components/*
   │  เรียก hook เท่านั้น
   ▼
 Hook รายโดเมน                     app/hooks/api/*            useWallet() · useLotteryCatalog() ...
   │
   ▼
 useApi (SWR · cache แยกผู้ใช้)    app/hooks/useApi.ts
   │
   ▼
 ชั้น API / adapter                lib/api/*.ts               fetchXxx · submitXxx · claimXxx
   │  mock: mockResult / mockAction / isMockMode
   ▼
 HTTP client                       lib/api/http.ts            apiFetch (ไม่ throw · cookie · base URL)
   ▼
 Backend (NEXT_PUBLIC_API_BASE_URL)        — ไม่ตั้ง = mock route ใน app/api/*
```

| ชั้น | ทำอะไร | ห้ามทำ |
|------|--------|--------|
| UI | แสดงผล · เรียก hook · เรียก action จาก `lib/api` (claim/submit) | `fetch()` ตรง · import `apiFetch` · import `*MockData` ตรง |
| Hook | ประกอบ key + fetcher + `{ auth }` | แปลงรูปข้อมูล backend |
| lib/api | เรียก backend / mock · แปลง DTO → ชนิดที่ UI ใช้ | import component / React |
| types | รูปข้อมูลที่ UI ใช้ (`app/types/*`) | ผูกกับรูป DTO ของ backend |
| app/data | ข้อมูล mock + config คงที่ (เมนู ไอคอน) | ให้ UI import ข้อมูลที่ควรมาจาก backend ตรง |

---

## 3. "ชั้นเชื่อม back-end" — ส่วนที่ต้องเหมือน glass

ขอบเขตจริงประกาศไว้ใน `glass/scripts/backend-layer/config.mjs`:

| กลุ่ม | path (แบบ glass) |
|-------|------------------|
| ชั้น API + สัญญา endpoint | `lib/api/**` (ยกเว้น `mockDataImports.test.ts` ที่มีรายการหนี้ของแต่ละโปรเจค) |
| auth · server helper · domain | `lib/auth/**` · `lib/server/**` · `lib/domain/**` · `lib/lottery/**` · `lib/promotions/**` |
| mock route | `app/api/**` |
| hook | `app/hooks/api/**` · `useApi.ts` · `apiStatus.ts` · `useApiErrorText.ts` · `useRequireAuthAction.ts` · `useLotteryBetSubmit.ts` |
| ชนิดข้อมูล | `app/types/**` |
| ด่าน session | `proxy.ts` |
| กฎ ESLint ของชั้นนี้ | `eslint.backend-layer.mjs` |
| เอกสาร | `docs/api/shared-backend-layer.md` · `docs/api/backend-integration.md` · skill `cosmicbet-backend` |

**ต่างกันได้ (ไม่ซิงก์)**: UI ทั้งหมด · ธีม/CSS · route groups (`(lobby)`, `(sub)` — ไม่มีผลกับ URL) · `lib/i18n/messages/*` · เนื้อหา `app/data/*` (รูป ชื่อค่าย ชื่อเว็บ) · `app/components/*` · `components/*`

### Path alias มาตรฐาน

โค้ดในชั้นนี้ import ด้วย `@/lib/...` · `@/app/data/...` · `@/app/hooks/...` · `@/app/types/...` · `@/app/lib/...` · `@/app/components/auth/...` เหมือนกันทุกโปรเจค
โปรเจคที่วางไฟล์ต่างตำแหน่ง (cas อยู่ใต้ `src/`) ให้ map alias ใน `tsconfig.json` `paths` แทนการแก้ import — ไฟล์จึงเหมือน glass ได้ทุกไบต์

---

## 4. ตัวบังคับกฎ

| ตัวบังคับ | ไฟล์ | จับอะไร | ระดับ |
|-----------|------|---------|-------|
| ESLint | `eslint.backend-layer.mjs` (spread ใน `eslint.config.mjs`) | UI เรียก `fetch()` ตรง · UI import `apiFetch` | error |
| ESLint | ไฟล์เดียวกัน | UI import `*MockData` ตรง | warn (หนี้เดิม) |
| เทสต์ ratchet | `lib/api/mockDataImports.test.ts` | ไฟล์ UI **ใหม่** import `*MockData` ตรง · รายการหนี้ต้องลดลงเท่านั้น | test fail |
| เทสต์ manifest | `lib/api/backendLayer.test.ts` + `backend-layer.manifest.json` | มีคนแก้ไฟล์ในชั้นเชื่อม back-end ที่โปรเจคปลายทางโดยตรง | test fail |
| เทสต์สัญญา | `lib/api/endpoints.test.ts` | path/method ของ endpoint หลัก | test fail |
| ตรวจข้ามโปรเจค | `pnpm backend:check` (ใน glass) | ปลายทางยังไม่ได้รับการเปลี่ยนแปลงล่าสุดของ glass | exit 1 |

---

## 5. ขั้นตอนเปลี่ยนสัญญา API (ทำที่ glass เสมอ)

1. แก้ใน glass — `lib/api/*`, `app/types/*`, hook, `endpoints.ts` (+ เทสต์)
2. `npx tsc --noEmit -p . && pnpm test` ใน glass แล้ว **commit** (สคริปต์อ่านจาก git HEAD — งานที่ยังไม่ commit ไม่ถูกส่งออก)
3. `pnpm backend:check` — ดูว่าโปรเจคไหนต้องอัปเดต
4. `pnpm backend:sync` — เขียนไฟล์ + เอกสาร + `backend-layer.manifest.json` ไปทุกโปรเจค (สคริปต์ไม่ commit ให้)
5. ในแต่ละโปรเจค: ถ้า UI ใช้ของที่เปลี่ยน ปรับ UI ตาม → `tsc` + test → commit
6. `pnpm backend:check` อีกครั้ง ต้องไม่มีรายการ

> ห้ามแก้ไฟล์ในชั้นนี้ที่โปรเจคปลายทางตรงๆ — เทสต์ manifest จะล้ม ถ้าจำเป็นเร่งด่วน ให้แก้ที่ glass แล้วซิงก์ทันที

---

## 6. ส่วนขยายเฉพาะโปรเจค

บางโปรเจคมีฟีเจอร์ที่ glass ยังไม่มี (เช่น black-purple: API ค่ายเกม และ Hot Jackpot)
ประกาศไฟล์เหล่านั้นใน `extensions` ของโปรเจคนั้นใน `config.mjs` — สคริปต์จะไม่ทับ และไม่ใส่ใน manifest

- ไฟล์ที่ **แก้จากของ glass** (เช่น `endpoints.ts` ที่เพิ่มรายการ) ต้องเป็น "ของ glass + ส่วนเพิ่ม" เท่านั้น — ห้ามลบหรือเปลี่ยนของ glass
- เป้าหมายคือ `extensions` ว่าง: เมื่อฟีเจอร์นิ่งแล้ว ย้ายเข้า glass แล้วลบออกจากรายการ
- ไฟล์ในโฟลเดอร์ชั้นนี้ที่ไม่มีใน glass และไม่ได้ประกาศ → `backend:check` แจ้ง `EXTRA`

---

## 7. เพิ่มโปรเจคใหม่เข้ามาตรฐานนี้

1. เพิ่ม target ใน `glass/scripts/backend-layer/config.mjs` (dir · map · paths)
2. ถ้าโครงโฟลเดอร์ต่างจาก glass ให้ map alias ใน `tsconfig.json` (§3)
3. `eslint.config.mjs` spread `backendLayerRules` จาก `./eslint.backend-layer.mjs`
4. สร้าง `lib/api/mockDataImports.test.ts` ของโปรเจค (รายการหนี้เริ่มต้น = ไฟล์ที่ import อยู่ตอนนี้)
5. `pnpm backend:sync` แล้วรัน `tsc` + test ในโปรเจคใหม่

---

## 8. แผนถัดไป

- **แยกชั้นนี้เป็น package กลาง** (pnpm workspace · `packages/api-core`) — แก้ที่เดียวแล้วทุกแอปได้ทันที ไม่ต้องซิงก์ไฟล์ · ขอบเขตใน §3 คือสิ่งที่จะย้ายเข้า package
- เมื่อ backend มี OpenAPI: generate ชนิด DTO (`openapi-typescript`) และ validate response ที่ adapter ใน `lib/api`
- ลดรายการหนี้ใน `mockDataImports.test.ts` และ `extensions` ให้เป็นศูนย์
