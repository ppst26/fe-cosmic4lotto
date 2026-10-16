# คู่มือระบบสลับธีม (Theme Switch) — cosmicbet / black-purple

คู่มือนี้อธิบายระบบสลับธีม **ตามโค้ดที่ใช้งานจริงในโปรเจกต์นี้ ณ ตอนนี้** เพื่อให้นำไปปรับใช้กับเว็บอื่นได้
(ต้นแบบความคิดมาจากเว็บ demo-legend-pro: `<html data-theme="...">` + localStorage key `themeColor`)

- Stack ที่ใช้: Next.js (App Router) + Tailwind v4 + CSS variables
- มี 12 ธีม: `black-purple` (ค่าเริ่มต้น) + มืด 6 + สว่าง 5
- อัปเดตล่าสุดรวมถึง: ระบบ "บทบาทสี" (role-based), header ไม่มีช่องค้นหา (โลโก้ชิดซ้าย + กระดิ่ง + ธงภาษาถัดจากโลโก้), dropdown ทึบตามธีม, เมนูหมวดเกมเทาเข้มในธีมสว่าง

---

## 1. ภาพรวมแนวคิด

```
ผู้ใช้กดเลือกธีมใน ThemeCustomizerModal
        │
        ▼
setTheme(key)  (lib/theme.ts)
   ├─ <html data-theme="key">          ← ตัวสลับ CSS ทั้งหมด
   ├─ <html data-mode="light|dark">    ← ใช้กับกฎที่ต่างกันระหว่างธีมสว่าง/มืด (เช่น โลโก้)
   ├─ localStorage["themeColor"] = key ← จำค่า
   └─ dispatch event "cosmic-theme-change" ← ให้ useTheme() อัปเดต UI

โหลดหน้าใหม่: inline script ใน <head> อ่าน localStorage แล้วตั้ง data-theme/data-mode
              "ก่อน paint ครั้งแรก" → ไม่มีจอกะพริบเป็นธีมเริ่มต้น

CSS: [data-theme="sunfire"] { --bg-app: ...; --card-solid: ...; --t-ga: ...; }
     คอมโพเนนต์ใช้ var(--token) อยู่แล้ว → เปลี่ยน token = เปลี่ยนทั้งเว็บ ไม่ต้องแก้ TSX
```

หลักคิด 3 ข้อ:
1. **ธีม = ชุด CSS variable** ที่ override ภายใต้ `[data-theme="key"]` (ธีมเริ่มต้นอยู่ใน `:root` ของ `tokens.css` ไม่มี block แยก)
2. **คอมโพเนนต์ต้องใช้ token ไม่ใช่ hex ตายตัว** (ถ้าเว็บปลายทางยังมี hex เยอะ ต้องแปลงก่อน — ดูหัวข้อ 8)
3. **ไฟล์ธีมทั้งหมดถูก "สร้าง" จากสคริปต์** แก้ที่สคริปต์แล้วรันใหม่ ไม่แก้ไฟล์ output ด้วยมือ

---

## 2. ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ | แก้มือได้ไหม |
|---|---|---|
| `scripts/themes/gen-themes.js` | **แหล่งความจริง** — ตารางธีม, ตารางบทบาทสี (`ROLES`), template ของ CSS | ✅ แก้ที่นี่ |
| `scripts/themes/themes-static.css` | กฎ CSS ที่ใช้ร่วมทุกธีม (โลโก้, ไอคอน, header/footer, dropdown, แท็บ) — ถูกต่อท้าย themes.css | ✅ แก้ที่นี่ |
| `app/styles/themes.css` | **generated** — block `[data-theme="..."]` ต่อธีม + กฎ static | ❌ ถูกเขียนทับ |
| `lib/themes.ts` | **generated** — `THEMES`, `THEME_KEYS`, `LIGHT_THEME_KEYS`, `DEFAULT_THEME`, `THEME_STORAGE_KEY` | ❌ ถูกเขียนทับ |
| `lib/theme.ts` | `setTheme()` + hook `useTheme()` | ✅ |
| `app/[lang]/layout.tsx` | `THEME_INIT_SCRIPT` ใน `<head>` + `suppressHydrationWarning` บน `<html>` | ✅ |
| `components/ThemeCustomizerModal.tsx` | UI เลือกธีม (กริด Dark / Light) | ✅ |
| `app/styles/globals-lottery.css` | `@import "./themes.css";` **เป็นบรรทัดสุดท้าย** (ต้องมาหลัง tokens ทั้งหมด) | ✅ |
| `app/styles/tokens.css` | ค่า token ของธีมเริ่มต้น (black-purple) + token ที่ธีมอื่น override | ✅ |
| `components/brand/CosmicLogo.tsx` | เรนเดอร์โลโก้ 2 รูป (dark/light) ให้ CSS สลับ | ✅ |
| `public/cosmic-dark.png`, `public/cosmic-light.png` | โลโก้สำหรับพื้นมืด / พื้นสว่าง | — |

คำสั่งสร้างไฟล์ธีมใหม่ (รันที่ root โปรเจกต์ ไม่ต้องติดตั้งแพ็กเกจเพิ่ม):

```bash
node scripts/themes/gen-themes.js
```

---

## 3. ส่วนประกอบทีละชิ้น

### 3.1 `lib/theme.ts` — ตั้งธีม + hook

```ts
"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_THEME, LIGHT_THEME_KEYS, THEME_KEYS, THEME_STORAGE_KEY } from "@/lib/themes";

const THEME_EVENT = "cosmic-theme-change";

function readTheme(): string {
  const key = document.documentElement.dataset.theme;
  return key && THEME_KEYS.includes(key) ? key : DEFAULT_THEME;
}

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onChange);   // sync ข้ามแท็บ
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setTheme(key: string) {
  if (!THEME_KEYS.includes(key)) return;
  document.documentElement.dataset.theme = key;
  document.documentElement.dataset.mode = LIGHT_THEME_KEYS.includes(key) ? "light" : "dark";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, key);
  } catch {
    /* private mode / storage ปิด — ใช้ได้เฉพาะ session นี้ */
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
  const select = useCallback((key: string) => setTheme(key), []);
  return { theme, setTheme: select };
}
```

จุดสำคัญ: state ของธีม "อยู่ที่ attribute บน `<html>`" ไม่ใช่ React state / Context → ไม่ต้องมี Provider และไม่ re-render ทั้งแอป

### 3.2 `app/[lang]/layout.tsx` — กันจอกะพริบ

```tsx
const THEME_INIT_SCRIPT = `try{var k=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=document.documentElement;if(!(k&&${JSON.stringify(THEME_KEYS)}.indexOf(k)>-1))k=${JSON.stringify(DEFAULT_THEME)};d.dataset.theme=k;d.dataset.mode=${JSON.stringify(LIGHT_THEME_KEYS)}.indexOf(k)>-1?"light":"dark"}catch(e){}`;

// ...
<html lang={...} suppressHydrationWarning>
  <head>
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
  </head>
  <body className="min-h-full flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
```

- `suppressHydrationWarning` จำเป็น เพราะ script เปลี่ยน attribute ของ `<html>` ก่อน React hydrate
- `body` ต้องใช้ `bg-[var(--bg-app)] text-[var(--text-primary)]` (ไม่ hardcode สี) ไม่งั้นพื้นหลังไม่เปลี่ยนตามธีม

### 3.3 `components/ThemeCustomizerModal.tsx` — UI เลือกธีม

- props มีแค่ `isOpen`, `onClose` (ไม่มี state/props ธีมจากภายนอก — ใช้ `useTheme()` ข้างใน)
- แสดง 2 กริด: Dark (`THEMES.filter(t => t.isDark)`) และ Light
- การ์ดแต่ละใบวาดตัวอย่างจาก `theme.colors` (3 สี) + `theme.bgColor` + `theme.isDark` (สีตัวอักษร)
- กดเลือก → `setTheme(key)` แล้ว `onClose()`
- เรียกใช้จาก 4 จุด: `HomePageClient`, `LotteryRouteShell`, `profile/account/page`, `referral/page` ด้วย
  `<ThemeCustomizerModal isOpen={...} onClose={...} />`
- ปุ่มเปิด modal: เมนู dropdown ผู้ใช้ใน `HeaderBar` ("เปลี่ยนธีมหน้าเว็บ") และปุ่มลอย (FAB) ผ่าน `onOpenTheme`

### 3.4 `lib/themes.ts` (generated)

```ts
export const DEFAULT_THEME = "black-purple";
export const THEME_STORAGE_KEY = "themeColor";
export interface ThemeOption { key: string; name: string; isDark: boolean; colors: string[]; bgColor: string; }
export const THEMES: ThemeOption[] = [ /* black-purple + 11 ธีม */ ];
export const THEME_KEYS: string[] = THEMES.map((t) => t.key);
export const LIGHT_THEME_KEYS: string[] = THEMES.filter((t) => !t.isDark).map((t) => t.key);
```

`colors` / `bgColor` ใช้วาดการ์ดตัวอย่างใน modal เท่านั้น ค่า token จริงอยู่ใน `themes.css`

---

## 4. โครงสร้าง CSS ที่ generator สร้าง

`app/styles/themes.css` = (block ต่อธีม) + เนื้อหาของ `themes-static.css`

### 4.1 Block ต่อธีม

**ธีมมืด** (`darkBlock`): override พื้นผิวและ token ที่ธีมเริ่มต้นกำหนด

| กลุ่ม token | ตัวอย่าง |
|---|---|
| พื้นหลัง | `--bg-app`, `--bg-nav`, `--bg-surface`, `--bg-surface-2`, `--bg-input`, `--surface-4`, `--page-ambient` |
| การ์ด | `--card-solid` (การ์ดนอก), `--card-solid-2`, `--inner-card-gray` (การ์ดซ้อนใน) |
| เส้นขอบ | `--surface-border`, `--border-subtle/default/strong` |
| แท็บ | `--tab-solid-bg(-hover)`, `--tab-active-bg`, `--tab-border` |

**ธีมสว่าง** (`lightBlock`): ใช้ `LIGHT_BASE` ชุดเดียวกันทุกธีมสว่าง แล้วกลับสเกล

- พื้นขาว/เทาอ่อน, ตัวอักษร `--text-*` เป็นสีเข้ม
- **กลับสเกลตัวแปร Tailwind**: `--color-white` → `#111827` และ `--color-zinc-50..950` กลับด้าน
  ทำให้ class เดิมอย่าง `text-white`, `text-zinc-400`, `bg-white/5` กลายเป็นสีเข้มอัตโนมัติ **โดยไม่ต้องแก้ TSX**
  (ใช้ได้เพราะ Tailwind v4 utility อ่านค่าจาก `var(--color-*)` ที่ประกาศใน `@theme`)
- กลับสเกล `emerald/green/rose/red/amber/yellow` ให้เข้มพอบนพื้นขาว
- กำหนด semantic tokens: `--semantic-success/warning/danger/info/reward/...`

**ทั้งสองแบบ** ต่อท้ายด้วย `common(t)` — token ที่ได้จาก "บทบาทสี" (หัวข้อ 5): `--t-ga`, `--t-gb`, `--t-icon`, `--t-action`, `--t-active`, `--t-active-text`, `--chrome-bg`, `--card-head-bg`, `--primary-*`, `--cta-*`, `--gradient-brand` ฯลฯ

### 4.2 กฎร่วม (`themes-static.css`)

ทุกกฎที่ไม่ใช่ธีมเริ่มต้นใช้ selector `[data-theme]:not([data-theme="black-purple"])` เพื่อไม่กระทบ black-purple

| กฎ | ผล |
|---|---|
| `[data-theme] [class*="primary-gradient"]` | สีข้อความบนปุ่มหลัก = `--primary-text` |
| `.cosmic-logo--dark/--light` + `[data-mode="light"]` | ธีมมืดใช้ `cosmic-dark.png`, ธีมสว่างใช้ `cosmic-light.png` |
| `.theme-brand-surface`, `.card-head` | พื้นไล่สีที่ตัวอักษร/ไอคอนต้องขาวเสมอ (override `--color-white`, `--text-*`, `--icon-accent`) |
| `.theme-brand-surface .cosmic-logo--dark` | โลโก้บนพื้นไล่สี = ขาวล้วน (`filter: brightness(0) invert(1)`) |
| `.theme-brand-surface [class*="bg-[var(--bg-surface"]:not(.theme-dropdown)` | ช่อง/ปุ่มวงกลมใน header → พื้นดำโปร่ง 22% |
| `.theme-brand-surface .theme-dropdown` | dropdown ที่หล่นจาก header → **พื้นทึบ** `var(--chrome-bg)` + ขอบขาวจาง |
| `.theme-brand-surface .text-meta-gold`, `.btn-gold-outline svg` | ข้อความ VIP / ไอคอนในปุ่ม outline บน header = ขาว |
| `[data-mode="light"] .theme-dropdown .text-red-400` | ปุ่มออกจากระบบบนพื้นแดง = ชมพูอ่อน |
| `[data-mode="light"] .category-nav-desktop` | แถบเมนูหมวดเกม desktop ในธีมสว่าง = เทาเข้ม `#1b1e25` |
| `.mobile-chrome-surface--top`, `.theme-footer-brand`, `.card-head` | พื้นหลัง = `--chrome-bg` / `--card-head-bg` (ไล่สี) |
| `svg.lucide[class*="text-zinc-"]` | ไอคอน lucide สีเทา = `--t-icon` (บนพื้นไล่สี = ขาว) |
| `.tab-btn.active`, `.quick-nav-item-active`, `.cosmic-line-tab[aria-selected]` | สี active = `--t-active` / `--t-active-text` |
| `[data-mode="light"] [class*="from-black"], .game-media-thumb` | ข้อความทับรูป/overlay ดำ คงเป็นสีขาวแม้ธีมสว่าง |

---

## 5. ระบบ "บทบาทสี" (Role-based colors)

แต่ละธีมกำหนดสีแค่ **3 สีหลัก** แล้วแมปเป็นบทบาท ใน `ROLES` ของ `gen-themes.js`:

| บทบาท | key ใน ROLES | ใช้กับ |
|---|---|---|
| สี 1 → สี 2 ไล่แนวตั้ง | `ga` → `gb` | header, footer, แถบหัวการ์ด (`.card-head`), พื้น header, dropdown |
| สีไอคอน | `icon` | ไอคอน lucide, ขอบปุ่ม outline (ยกเว้นบนพื้นไล่สีจะเป็นขาว) |
| สีปุ่ม action | `action` (+ ตัวอักษร `at`) | ปุ่มเติมเงิน/หลักทั้งแอป (`--primary-*`, `--cta-gold-fg`) |
| สี active | `active` (+ ตัวอักษร `act`) | แท็บ active, line tab, quick-nav active |

ค่าปัจจุบัน:

| ธีม | โหมด | ga → gb | icon | action (ตัวอักษร) | active (ตัวอักษร) |
|---|---|---|---|---|---|
| thunder-x | มืด | #202020 → #0b0d11 | #ffd600 | #ffd600 (#111) | #ffd600 (#111) |
| dark-mix-berry | มืด | #ff2d95 → #b5179e | #ff7ac3 | #ff7ac3 (#2a0a1c) | #ff2d95 (#fff) |
| tron | มืด | #102993 → #050f3b | #51b0ff | #51b0ff (#04123a) | #102993 (#fff) |
| sanim | มืด | #202020 → #0b0d11 | #df6709 | #df6709 (#fff) | #df6709 (#fff) |
| gatsby | มืด | #101421 → #002830 | #fef1cf | #fef1cf (#1a1405) | #fef1cf (#1a1405) |
| wisdom | มืด | #772639 → #400a1a | #e6e6e6 | #e6e6e6 (#2a0a14) | #772639 (#fff) |
| sunfire | สว่าง | #d9202e → #99121d | #99121d | #ffd864 (#3a2a00) | #d9202e (#fff) |
| blue-syrah | สว่าง | #4ea8ff → #0078ab | #0078ab | #ffd864 (#3a2a00) | #4ea8ff (#08233d) |
| good-witch | สว่าง | #5ed076 → #10943e | #10943e | #ffd864 (#3a2a00) | #5ed076 (#0a2a14) |
| mix-berry | สว่าง | #df5c90 → #741a61 | #741a61 | #ffd864 (#3a2a00) | #df5c90 (#fff) |
| mr-bond | สว่าง | #1f2735 → #0e131c | #0e131c | #72a3f9 (#0b1530) | #1f2735 (#fff) |

ข้อควรรู้ของบทบาทสี:
- **ธีมมืดที่ ga/gb เกือบดำ** (thunder-x, sanim, gatsby, wisdom) ใช้สี 3 (ทอง/ส้ม/ครีม/เทาอ่อน) เป็น icon, action, active เพราะสี 2 เกือบดำ ไอคอนจะมองไม่เห็น
- **ธีมที่ `active` เป็นสีอ่อน** (blue-syrah, good-witch, gatsby, thunder-x) ตัวอักษรบนแท็บ active (`act`) ต้องเป็นสีเข้ม
- บนพื้นไล่สี (header/footer/หัวการ์ด) ไอคอนและขอบปุ่ม outline ถูกบังคับเป็น **ขาว** เพราะ `icon` (สีเข้ม) จะมองไม่เห็นบนพื้นสี

---

## 6. Markup ที่ต้องมีใน TSX (class "ตะขอ" ให้ CSS จับ)

generator + static CSS ไม่ทำงานเองถ้าไม่มี class เหล่านี้บน element:

| class | ใส่ที่ | ผล |
|---|---|---|
| `theme-brand-surface` | container ของ header (mobile fixed + desktop) และ `<footer>` | พื้นไล่สี + ตัวหนังสือขาว + โลโก้ขาว |
| `theme-footer-brand` | `<footer>` | พื้น footer = chrome-bg |
| `mobile-chrome-surface mobile-chrome-surface--top` | container header | พื้น header = chrome-bg |
| `card-head` | แถบหัวการ์ด/หัว section (GameLobbySection, MostOnlineSection, หัวใน JackpotSidebar) | พื้นไล่สี + ขาว |
| `theme-dropdown` | dropdown ที่ลอยจาก header (เมนูผู้ใช้ใน `HeaderBar`, `NotificationDesktopPopover`) | พื้นทึบสีธีม |
| `cosmic-logo--dark` / `--light` | `CosmicLogo.tsx` เรนเดอร์ทั้งสองรูป | CSS ซ่อน/แสดงตาม `data-mode` |
| `tab-btn.active`, `quick-nav-item-active`, `cosmic-line-tab` | คอมโพเนนต์แท็บเดิม | สี active ตามธีม |

ตัวอย่าง header (ย่อ):

```tsx
<div className="theme-brand-surface hidden md:block mobile-chrome-surface mobile-chrome-surface--top">
  {/* โลโก้ชิดซ้าย + กระดิ่ง + ธงภาษา ถัดจากโลโก้ */}
  <CosmicLogoLink size="hero" priority className="transition-transform hover:scale-105" />
  <div className="ml-4 flex items-center gap-2.5">
    {isLoggedIn && <NotificationDesktopPopover unreadCount={unreadNotiCount} />}
    <button onClick={openLanguagePicker}> <LocaleFlag .../> </button>
  </div>
  {/* ขวา: ยอดเครดิต, เติมเงิน, ถอน, เมนูผู้ใช้ (dropdown ใช้ class theme-dropdown) */}
</div>
```

หมายเหตุ: กล่องแจ้งเตือนอยู่ซ้าย จึงใช้ `left-0` (ไม่ใช่ `right-0`) เพื่อไม่ให้ล้นขอบจอ

---

## 7. ขั้นตอนนำไปใช้กับเว็บอื่น (Checklist)

1. **คัดลอกไฟล์**: `scripts/themes/*`, `lib/theme.ts`, `components/ThemeCustomizerModal.tsx` (ปรับ import ให้ตรง alias ของเว็บปลายทาง เช่น `@/lib/usePresence`, `@/lib/themes`)
2. **ทำ token ให้ครบก่อน** — เว็บปลายทางต้องมี CSS variable สำหรับ พื้นหลัง/การ์ด/ตัวอักษร/เส้นขอบ/สีปุ่มหลัก ใน `:root` ถ้าไม่มี ให้สร้างไฟล์ `tokens.css` แล้วเปลี่ยน hex ใน TSX/CSS เป็น `var(--token)` (หัวข้อ 8)
3. **ปรับชื่อ token ใน `gen-themes.js`** (`darkBlock`, `LIGHT_BASE`, `common`) ให้ตรงกับชื่อ token ของเว็บปลายทาง — เดิมใช้ชื่อ `--bg-app`, `--bg-nav`, `--bg-surface`, `--card-solid`, `--inner-card-gray`, `--primary-*` ฯลฯ
4. **แก้ตารางธีม `T` และ `ROLES`** ใส่ธีม/สีของเว็บปลายทาง (key ต้องเป็น kebab-case, `dark: true/false`)
5. **แก้ `DEFAULT_THEME` ใน generator** ให้ตรงกับธีมที่อยู่ใน `:root` ของเว็บปลายทาง และถ้าเว็บใหม่ไม่ได้เรียกธีมเริ่มต้นว่า `black-purple` ให้เปลี่ยน `:not([data-theme="black-purple"])` ใน `themes-static.css` ทุกจุดให้ตรงกัน (ใช้ find & replace)
6. **รัน** `node scripts/themes/gen-themes.js` → ได้ `app/styles/themes.css` + `lib/themes.ts`
7. **import `themes.css` เป็นลำดับสุดท้าย** ของ CSS หลัก (หลัง tokens และ utility ทั้งหมด) — ถ้ามาก่อน token จะถูกเขียนทับกลับ
8. **layout**: เพิ่ม `THEME_INIT_SCRIPT` ใน `<head>`, `suppressHydrationWarning` บน `<html>`, ให้ `body` ใช้ `var(--bg-app)` / `var(--text-primary)`
9. **โลโก้**: เตรียมโลโก้ 2 เวอร์ชัน (พื้นมืด/พื้นสว่าง) แล้วทำคอมโพเนนต์ให้เรนเดอร์ทั้งคู่ด้วย class `cosmic-logo--dark/--light` (หรือเปลี่ยนชื่อ class ใน `themes-static.css`)
10. **ใส่ class ตะขอ** ตามหัวข้อ 6 บน header / footer / หัวการ์ด / dropdown
11. **เพิ่มปุ่มเปิด modal** ที่ใดก็ได้ (`<ThemeCustomizerModal isOpen onClose />`)
12. **ทดสอบ**: เลือกทุกธีม → รีเฟรช (ต้องคงธีม ไม่กะพริบ) → ลองหน้าหลัก, หน้าที่มี modal, dropdown, footer ทั้งมือถือและ desktop

### เพิ่ม/ลบธีมใน generator

1. เพิ่มแถวใน `T` (สีพื้นผิวสำหรับธีมมืด: `page/nav/card/card2/inner`, ปุ่ม: `ps/pe/accent/on`, ตัวอย่างใน modal: `colors/bg`)
2. เพิ่มแถวใน `ROLES` (`ga, gb, icon, action, at, active, act`)
3. รัน `node scripts/themes/gen-themes.js` — ไม่ต้องแก้ไฟล์อื่น modal จะแสดงธีมใหม่เองจาก `THEMES`

### ปรับสีบทบาทของธีมเดียว

แก้ค่าใน `ROLES["sunfire"]` แล้วรัน generator ใหม่ (ตัวอย่าง: เปลี่ยนปุ่ม action เป็นสีอื่น = แก้ `action` + `at`)

---

## 8. การทำให้คอมโพเนนต์ "ตามธีมได้" (ถ้าเว็บปลายทางยังมี hardcode)

ในโปรเจกต์นี้ทำไปแล้ว:
- hex พื้นหลังคงที่ (`#18212c`, `#121a24`, `#0b121b`, `#1d2733`, `#070c13`) → `var(--bg-surface-2)`, `--bg-surface`, `--bg-nav`, `--surface-4`, `--bg-app`; แบบมี opacity แปลงเป็น `color-mix(in srgb, var(--...) NN%, transparent)`
- gradient การ์ด → สีทึบ `--card-solid` / `--card-solid-2` (การ์ดนอก) และ `--inner-card-gray` (การ์ดซ้อนใน)
- ไอคอน accent: `text-icon-accent` = `var(--icon-accent, #a1a1aa)`
- ปุ่มหลัก: `--primary-gradient` ใช้ `color-mix` ที่จุดกลาง เพื่อให้ ps/pe เปลี่ยนแล้วไล่สีถูก

ขั้นตอนแนะนำสำหรับเว็บอื่น:
1. ค้นหา hex/rgb ที่ใช้เป็นพื้นหลัง/เส้นขอบใน TSX+CSS (`grep -rn "#[0-9a-fA-F]\{6\}"`)
2. จับคู่กับ token ที่ใกล้ที่สุด แล้วแทนที่ทีละไฟล์
3. ใช้ Tailwind class สีกลาง (`text-white`, `text-zinc-*`, `bg-white/5`) ได้ตามเดิม — ธีมสว่างกลับสเกลให้อัตโนมัติ (ดู 4.1) แต่ต้องใช้ **Tailwind v4 ที่ utility อ่านจาก `var(--color-*)`** ถ้าใช้ v3 หรือ `@theme inline` กับสีเหล่านี้ ต้องหาวิธี override อีกแบบ

---

## 9. ข้อควรระวัง / ปัญหาที่เจอมาแล้ว

- **ลำดับ import**: `themes.css` ต้องเป็นตัวสุดท้าย ไม่งั้นถูก token ธีมเริ่มต้นทับ
- **Dev server ไม่อัปเดต CSS** หลังรัน generator: Turbopack บางครั้งไม่เห็นการเปลี่ยนของ `themes.css` ที่ถูกเขียนทับจาก script ให้แก้ไฟล์ที่ import มัน (เช่นเติมบรรทัดว่างใน `globals-lottery.css` แล้วลบออก) หรือ restart dev server
- **generator เขียนทับ `lib/themes.ts`** ทุกครั้ง: ถ้าอยากเพิ่ม export ใหม่ ต้องเพิ่มใน template ของ `gen-themes.js` (เคยพลาดจน `LIGHT_THEME_KEYS` หายและ build พัง)
- **การแก้ไฟล์ด้วยสคริปต์ shell**: backslash ใน `node -e '...'`, heredoc, `sed` จะถูกกลืน — ใช้ไฟล์ .js และ `split/join` แทน regex เวลาแก้ไฟล์จำนวนมาก (เคยทำให้ 35 ไฟล์พังมาแล้ว)
- **ไฟล์ CRLF**: โปรเจกต์นี้มีไฟล์ CRLF — อ่านแล้ว normalize → แก้ → เขียนกลับตามเดิม
- **localStorage ใช้ไม่ได้** (private mode): `setTheme` จับ error แล้วใช้ได้เฉพาะ session นั้น
- **SSR**: server เรนเดอร์เป็น `DEFAULT_THEME` เสมอ (`getServerSnapshot`) ค่าจริงถูกตั้งด้วย inline script ก่อน paint จึงไม่กะพริบ

## 10. ข้อจำกัดที่ยังมีอยู่ (ตรงกับสถานะปัจจุบัน)

- ไอคอนที่เป็นรูปภาพ (ไอคอนหมวดเกมสีทอง `.avif/.png`) ไม่เปลี่ยนสีตามธีม เปลี่ยนเฉพาะไอคอน lucide ที่ใช้ `text-zinc-*`
- Bottom nav (มือถือ) ยังไม่ไล่สีตามธีม ใช้สีการ์ด/ขาวในธีมสว่าง
- `.card-head` ใส่แล้ว 4 จุด (Hot Games, MostOnline, หัวสองแห่งใน JackpotSidebar) — หัวการ์ดอื่น (HallOfFame, Providers ฯลฯ) ยังเป็นสไตล์เดิม
- hex/gradient/คลาสสี Tailwind บางจุด (purple/blue scale) ที่ยังไม่ได้แปลงเป็น token จะไม่ตามธีม
- แท็บ "My Level" ที่เลือกอยู่ในหน้า VIP ข้อความจางในธีมสว่าง
- ต้นฉบับ demo-legend-pro ตอน `setTheme` ยังโหลดโลโก้ provider ตามธีมด้วย — **โปรเจกต์นี้ยังไม่ได้ทำส่วนนี้**
- ธีมที่ตรวจดูด้วยสายตาแล้ว: Sunfire, Good Witch, Blue Syrah, Mix Berry, Mr Bond, Thunder X, Tron — ส่วน Sanim, Gatsby, Wisdom, Dark Mix Berry ยังไม่ได้ไล่ตรวจทุกหน้า

## 11. การใช้งานใน glass (ฉบับปรับใช้จริง)

คู่มือข้างบนเป็นต้นแบบจาก black-purple — **glass ใช้ชื่อ token ของตัวเอง** (ไม่มี `--bg-app`, `--card-solid`, `--primary-*`):

| บทบาท | token ของ glass ที่ธีมเขียนทับ |
|---|---|
| พื้นหน้า / nebula | `--cosmic-page-base`, `--cosmic-nebula-bg-image`, `--nebula-*`, `--surface-start/mid/end`, `--surface-hover/selected` |
| การ์ดนอก/ใน, sheet | `--surface-solid-outer/inner`, `--sheet-row-fill*`, `--sheet-field-*`, `--cosmic-dialog-shell-bg`, `--cosmic-mobile-sheet-bg`, `--hub-*`, `--vip-panel-bg` |
| chrome ga→gb | `--header-desktop-chrome-start/end/gradient` (header + footer desktop), `--bottom-nav-bg/-radial`, `--nav-*`, `--lobby-section-title-band-*` · header มือถือ/หัวแถวเกมใช้ `--t-chrome-bg` ผ่าน themes-static.css |
| ปุ่มหลัก / active | `--btn-primary-gradient/-fg` (.btn-primary), `--auth-register-gradient`, `--action-*`, `--cta-primary-*`, `--primary(-foreground)`, `--category-active-gradient`, `--line-tab-neon-*`, `--accent-primary`, `--focus-ring` |
| ธีมสว่าง | `--text-*`, `--icon-*`, `--border-subtle`, `--color-white` / `--color-zinc-*` กลับสเกล + พื้นที่กราไฟต์เข้มเสมอ (`.hub-modal-shell`, `.menu-panel`, `.vip-rank-stack`) คืนค่าฝั่งมืด |

- ธีมเริ่มต้น = **`cosmic`** (token ใน `:root` ของ `tokens.css` ไม่มี block แยก) · selector ร่วมใช้ `:not([data-theme="cosmic"])`
- `.btn-primary` / ปุ่มสมัคร / chip header ใน CSS ใช้ `var(--token, ค่าเดิม)` — ธีมเริ่มต้นไม่เปลี่ยนหน้าตา
- `app/[lang]/layout.tsx`: `THEME_INIT_SCRIPT` ใน `<head>` + `suppressHydrationWarning` · ธีมสว่างถอด class `dark` (ทำใน init script และ `setTheme`)
- `CosmicbetLogo` เรนเดอร์ `cosmic-dark.png` + `cosmic-light.png` สลับด้วย `[data-mode]` · BottomNav ใส่ class `theme-brand-surface`
- UI: `app/components/theme/ThemePickerSheet.tsx` (sheet เลือกธีม, ข้อความใน `common.theme.*`) และ `app/components/layout/FloatingActions.tsx` (ปุ่มลอยล่างขวา ธีม + live chat → toast ยังไม่เชื่อมต่อ; ซ่อนบน `/play` และหน้าเลือกเลขหวยที่มี action bar) mount ใน `app/providers.tsx`
- ยังไม่ได้ทำ: tokenize hex พื้นผิวที่ฝังใน `menu-drawer.css` / `hub-modals.css` ทั้งหมด (ธีมมืดยังเป็นกราไฟต์เดิมในพื้นที่เหล่านั้น), ภาษาอื่น 7 ภาษาใช้ fallback th/en สำหรับคีย์ `common.theme.*`
