# PORTED_FROM_GLASS (lotto)

ไฟล์ที่ copy มาจาก `../../glass` (อ่านอย่างเดียว) — วิธีเดียวกับ `../../black-purple/PORTED_FROM_GLASS.md` และ `../../sport/PORTED_FROM_GLASS.md`

- glass HEAD ที่ใช้เป็นต้นฉบับ: `132f1b4cd803d00a89d68a1ac6ac8c2932e49c83`
- ไฟล์ที่ copy ใช้ path และเนื้อหาเดียวกับ glass (ไม่ refactor); ถ้ามีการปรับต้องระบุในคอลัมน์หมายเหตุ
- ข้อความ `lib/i18n/messages/**`: แทนชื่อแบรนด์ "Cosmicbet" เป็น "CM-SaturnLotto" (ตามผู้ใช้สั่ง) และตั้ง `meta.title`/`meta.description` (th, en)
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
| 4b-7,11 | `app/api/auth/login/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/auth/logout/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/auth/profile/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/auth/register/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/auth/session/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/lottery/bets/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/lottery/slips/[slipId]/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/lottery/slips/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/promotions/[id]/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/api/promotions/route.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/components/auth/AuthProvider.tsx` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/components/lottery/useLotteryI18n.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/activitiesHubMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/cashbackMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/casinoFeaturedData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/casinoProvidersData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/dailyCheckInMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/depositMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/desktopLobbyMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/fishingFeaturedData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/fishingProvidersData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/gemsStoreMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/hallOfFameMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/hotGamesFeaturedData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/lobbyAnnouncementMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/lobbyMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/lossRebateMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/lotteryCatalogMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/lotteryHubMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/lotteryIconAssets.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/lotteryMarketsMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/lotteryRoundsMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/luckyWheelMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/menuIconAssets.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/menuMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/mostOnlineLobbyMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/pendingTransactionMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/profileHubMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/referralMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/rewardFeaturesMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/slotProviderCoverData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/slotProvidersData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/sportFeaturedData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/sportProvidersData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/thaiLottoMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/transactionsMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/vipMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/walletMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/withdrawMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/data/yikiMockData.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/api/account.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/api/lottery.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/api/lotterySlips.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/api/member.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/api/money.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/api/promotions.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/api/transactions.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/apiStatus.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/apiStatus.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useApi.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useApiErrorText.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useCarouselAutoplay.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useFluctuatingOnlineCount.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useInfiniteSnapCarousel.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useIsClient.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useLazyOverlayMount.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useLobbyMobileHeaderHeight.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useLotteryBetSubmit.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useOverlayLayer.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useRequireAuthAction.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useUrlParams.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useUrlSearchParams.tsx` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/hooks/useUrlTab.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/activities.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/cashback.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/checkIn.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/lobby.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/lottery.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/lotteryBetApi.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/lotterySlip.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/menu.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/notifications.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/profile.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/promotions.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/providers.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/referral.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/reward.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/wallet.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `app/types/yiki.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/activities.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/cashback.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/checkIn.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/coupon.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/coupon.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/deposit.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/deposit.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/endpoints.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/endpoints.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/gemsStore.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/http.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/http.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/lobby.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/lobby.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/lotteryContent.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/lotteryContent.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/member.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/mock.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/profile.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/promotions.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/referral.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/rewardFeatures.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/transactions.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/transactions.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/vip.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/wheel.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/withdraw.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/api/withdraw.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/auth/client.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/categoryProviderPaths.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/domain/checkIn.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/domain/referral.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/gamePlayPaths.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/buildSubmittedSlip.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/buildSubmittedSlip.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/fetchLotterySlip.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/labels.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/mockSettlement.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/mockSlipSeed.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/mockSlipStore.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/resolvePlayRound.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/rules.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/rules.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/slipFilters.test.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/slipFilters.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/slipRange.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/submitBetSlip.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/lottery/yikiToThaiBetTypes.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/mostOnlineDisplayCount.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/overlayUrl.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/promotions/promotionCatalog.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `lib/promotions/promotionFilters.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `scripts/export-promotions-catalog.mjs` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `proxy.ts` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 4b-7,11 | `scripts/i18n-swap-imports.mjs` | 132f1b4 | f03ace8 | ลอกตามเดิม |
| 8-14 | `app/components/hub/DesktopHubModalProvider.tsx` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/hub/hubModalRegistry.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/hub/HubNavLink.tsx` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/hub/useIsDesktop.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/i18n/LanguagePickerProvider.tsx` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/i18n/LocaleFlag.tsx` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/lottery/lotteryUtils.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/notifications/NotificationProvider.tsx` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/promotions/promotionDetailHref.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/promotions/PromotionsCatalogProvider.tsx` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/pwa/PwaInstallProvider.tsx` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/components/vip/StackedAlphaVideo.tsx` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/data/notificationsMockData.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/data/providerGamesData.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/manifest.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/serwist/[path]/route.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `app/sw.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `lib/vipRoutes.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |
| 8-14 | `next.config.ts` | 132f1b4 | 95e4c5e | ลอกตามเดิม (manifest: ชื่อแบรนด์/สี) |

## ระบบธีมหลายสี (glass `6961fc6`)

| path (เหมือนใน glass) | glass commit | หมายเหตุ |
|---|---|---|
| `lib/theme.ts` | 6961fc6 | ลอกตามเดิม |
| `lib/themes.ts` | 6961fc6 | ลอกตามเดิม (รัน `node scripts/themes/gen-themes.js` ได้ผลเหมือนเดิม) |
| `app/styles/themes.css` | 6961fc6 | ลอกตามเดิม (ส่วนท้ายเป็นกฎของ glass ที่ lotto ไม่ได้ใช้) |
| `scripts/themes/gen-themes.js`, `scripts/themes/themes-static.css` | 6961fc6 | ลอกตามเดิม · eslint ignore `scripts/themes/**` |
| `docs/THEME-SWITCH-GUIDE.md` | 6961fc6 | ลอกตามเดิม |
| `lib/i18n/messages/{th,en}/common.json` | 6961fc6 | ทับทั้งไฟล์ (เพิ่ม `theme.*`, `logoutConfirm.success`) |
| `app/[lang]/layout.tsx` | 6961fc6 | เพิ่ม THEME_INIT_SCRIPT + suppressHydrationWarning ตาม glass |

ไฟล์ที่เขียนเองสไตล์ lotto (ไม่ใช่ logic ของ glass): `app/components/layout/FloatingActions.tsx`, `app/components/theme/ThemePickerSheet.tsx`, `styles/lotto-themes-bridge.css` (map บทบาทสี --t-* / --surface-* ของ glass → token lotto; ธีม cosmic = ดำ-ทองเดิม), `styles/lotto-floating-actions.css`

## Wallet flow (deposit / withdraw) — UI re-laid-out to glass structure

Logic (`lib/api/deposit.ts`, `lib/api/withdraw.ts`, `app/data/{deposit,withdraw,wallet}MockData.ts`, `app/types/wallet.ts`, `wallet.json`) was already byte-identical to glass.
Glass `DepositBottomSheet` / `WithdrawBottomSheet` flow reproduced in lotto style (`components/wallet/*`):
deposit = methods → bank + amount → confirm + slip → final confirm; withdraw = account + amount → confirm.
Replaces the single tabbed `components/WalletModal.tsx` (removed); `context/DepositContext.tsx` now mounts the two sheets by `?layer=deposit|withdraw`.
