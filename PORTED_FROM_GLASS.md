# PORTED_FROM_GLASS (lotto)

ไฟล์ที่ copy มาจาก `../../glass` (อ่านอย่างเดียว) — วิธีเดียวกับ `../../black-purple/PORTED_FROM_GLASS.md` และ `../../sport/PORTED_FROM_GLASS.md`

- glass HEAD ที่ใช้เป็นต้นฉบับ: `132f1b4cd803d00a89d68a1ac6ac8c2932e49c83`
- ไฟล์ที่ copy ใช้ path และเนื้อหาเดียวกับ glass (ไม่ refactor); ถ้ามีการปรับต้องระบุในคอลัมน์หมายเหตุ
- ข้อความ `lib/i18n/messages/**`: แทนชื่อแบรนด์ "Cosmicbet" เป็น "XGAMBET" (ชื่อที่ใช้อยู่ในหน้าแรกของ lotto) และตั้ง `meta.title`/`meta.description` (th, en)
- `lib/utils.ts` ใช้ `cn` แบบไม่มี dependency (ของ sport) แทน `export { cn } from "cn"` ของ glass

| ขั้น | path (เหมือนใน glass) | glass commit | commit ใน lotto | หมายเหตุ |
|---|---|---|---|---|
| 3-4a | `app/data/avatarPresets.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/data/signupMockData.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/lib/bangkokTime.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/lib/transactionDateUtils.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/types/auth.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/types/avatar.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/types/signup.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/types/transaction.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/types/vip.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `app/types/wheelTheme.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/auth/demoCredentials.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/auth/demoUser.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/auth/password.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/auth/profileFormat.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/auth/protectedPaths.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/auth/session.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/auth/session.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/auth/userStore.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/domain/transactions.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/domain/wheelTheme.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/domain/wheelTheme.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/fieldInput.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/format.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/format.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/I18nProvider.tsx` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/MessagesBoundary.tsx` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/config.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/fonts.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/auth.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/cashback.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/common.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/errors.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/games.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/home.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/index.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/lottery.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/meta.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/nav.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/profile.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/promotions.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/referral.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/rewards.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/transactions.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/vip.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/en/wallet.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/fil.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/id.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/km.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/lo.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/my.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/auth.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/cashback.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/common.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/errors.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/games.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/home.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/index.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/lottery.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/meta.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/nav.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/profile.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/promotions.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/referral.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/rewards.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/transactions.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/vip.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/th/wallet.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/vi.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/messages/zh.json` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/navigation.tsx` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/routing.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/routing.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/server.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/translate.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/translate.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/i18n/useFormat.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/semanticValue.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/semanticValue.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/server/rateLimit.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/server/rateLimit.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/server/request.test.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/server/request.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/uiConstants.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
| 3-4a | `lib/utils.ts` | 132f1b4 | 8b60b8d | ลอกตามเดิม (messages: แทนชื่อแบรนด์; utils: cn ไม่มี dependency) |
