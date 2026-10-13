/**
 * แผนที่จุดเรียก — agent ต่อ backend โดยแก้เฉพาะฟังก์ชันใน lib/api/
 * ชนิดข้อมูลที่คืนต้องตรงของเดิม path รูปต้องมากับข้อมูลที่คืน
 * ห้ามใส่หน้าโหลดในรอบที่เปลี่ยนจาก mock เป็น HTTP
 * ปุ่มนำทาง ไอคอนเมนู และฟุตเตอร์ไม่ใช่ endpoint
 */

export interface EndpointDef {
  method: "GET" | "POST" | "PATCH";
  path: string;
  auth: boolean;
  client: string;
}

export const ENDPOINTS = {
  fetchDepositMethods: { method: "GET", path: "/api/deposit/methods", auth: true, client: "fetchDepositMethods" },
  fetchDepositBankAccount: { method: "GET", path: "/api/deposit/bank-account", auth: true, client: "fetchDepositBankAccount" },
  fetchDepositQuickAmounts: { method: "GET", path: "/api/deposit/quick-amounts", auth: true, client: "fetchDepositQuickAmounts" },
  submitDeposit: { method: "POST", path: "/api/deposit", auth: true, client: "submitDeposit" },
  fetchWithdrawAccount: { method: "GET", path: "/api/withdraw/account", auth: true, client: "fetchWithdrawAccount" },
  fetchWithdrawBalance: { method: "GET", path: "/api/withdraw/balance", auth: true, client: "fetchWithdrawBalance" },
  fetchWithdrawQuickAmounts: { method: "GET", path: "/api/withdraw/quick-amounts", auth: true, client: "fetchWithdrawQuickAmounts" },
  submitWithdraw: { method: "POST", path: "/api/withdraw", auth: true, client: "submitWithdraw" },
  submitCoupon: { method: "POST", path: "/api/coupons/redeem", auth: true, client: "submitCoupon" },
  fetchVipPlayer: { method: "GET", path: "/api/vip/player", auth: true, client: "fetchVipPlayer" },
  fetchVipRanks: { method: "GET", path: "/api/vip/ranks", auth: false, client: "fetchVipRanks" },
  fetchVipBenefits: { method: "GET", path: "/api/vip/benefits", auth: false, client: "fetchVipBenefits" },
  fetchReferralOverview: { method: "GET", path: "/api/referral/overview", auth: true, client: "fetchReferralOverview" },
  fetchReferralUsers: { method: "GET", path: "/api/referral/users", auth: true, client: "fetchReferralUsers" },
  fetchReferralEarnings: { method: "GET", path: "/api/referral/earnings", auth: true, client: "fetchReferralEarnings" },
  fetchCashbackPanels: { method: "GET", path: "/api/cashback", auth: true, client: "fetchCashbackPanels" },
  fetchLossRebate: { method: "GET", path: "/api/cashback/loss-rebate", auth: true, client: "fetchLossRebate" },
  fetchCheckIn: { method: "GET", path: "/api/missions/check-in", auth: true, client: "fetchCheckIn" },
  fetchGemsStore: { method: "GET", path: "/api/gems-store", auth: true, client: "fetchGemsStore" },
  fetchWheel: { method: "GET", path: "/api/wheel", auth: true, client: "fetchWheel" },
  fetchTransactions: { method: "GET", path: "/api/transactions", auth: true, client: "fetchTransactions" },
  fetchActivities: { method: "GET", path: "/api/activities", auth: false, client: "fetchActivities" },
  fetchProfileHubStats: { method: "GET", path: "/api/profile/hub-stats", auth: true, client: "fetchProfileHubStats" },
  fetchWalletBalance: { method: "GET", path: "/api/wallet/balance", auth: true, client: "fetchWalletBalance" },
  fetchSignUpOptions: { method: "GET", path: "/api/auth/sign-up-options", auth: false, client: "fetchSignUpOptions" },
  fetchMenuTicketCount: { method: "GET", path: "/api/menu/ticket-count", auth: true, client: "fetchMenuTicketCount" },
  fetchHomeBanners: { method: "GET", path: "/api/lobby/banners", auth: false, client: "fetchHomeBanners" },
  fetchHomeHighlights: { method: "GET", path: "/api/lobby/highlights", auth: false, client: "fetchHomeHighlights" },
  fetchHomeGames: { method: "GET", path: "/api/lobby/games", auth: false, client: "fetchHomeGames" },
  fetchHomeProviders: { method: "GET", path: "/api/lobby/providers", auth: false, client: "fetchHomeProviders" },
  fetchHomeFeatureActions: { method: "GET", path: "/api/lobby/feature-actions", auth: false, client: "fetchHomeFeatureActions" },
  fetchHomeTournaments: { method: "GET", path: "/api/lobby/tournaments", auth: false, client: "fetchHomeTournaments" },
  fetchHomeMostOnline: { method: "GET", path: "/api/lobby/most-online", auth: false, client: "fetchHomeMostOnline" },
  fetchLobbyAnnouncements: { method: "GET", path: "/api/lobby/announcements", auth: false, client: "fetchLobbyAnnouncements" },
  fetchHallOfFame: { method: "GET", path: "/api/lobby/hall-of-fame", auth: false, client: "fetchHallOfFame" },
  fetchDesktopPlayerPanel: { method: "GET", path: "/api/lobby/desktop-player", auth: true, client: "fetchDesktopPlayerPanel" },
  fetchLotteryCatalog: { method: "GET", path: "/api/lottery/catalog", auth: false, client: "fetchLotteryCatalog" },
  fetchLotteryHub: { method: "GET", path: "/api/lottery/hub", auth: false, client: "fetchLotteryHub" },
  fetchLotteryMarkets: { method: "GET", path: "/api/lottery/markets", auth: false, client: "fetchLotteryMarkets" },
  fetchLotteryPlayRounds: { method: "GET", path: "/api/lottery/markets/:slug/rounds", auth: false, client: "fetchLotteryPlayRounds" },
  fetchYikiBoard: { method: "GET", path: "/api/lottery/yiki/board", auth: false, client: "fetchYikiBoard" },
  fetchThaiLottoBoard: { method: "GET", path: "/api/lottery/thai/board", auth: false, client: "fetchThaiLottoBoard" },
  fetchRewardHub: { method: "GET", path: "/api/reward/hub", auth: true, client: "fetchRewardHub" },
  fetchLuckyBox: { method: "GET", path: "/api/reward/lucky-box", auth: true, client: "fetchLuckyBox" },
  fetchRandomCard: { method: "GET", path: "/api/reward/random-card", auth: true, client: "fetchRandomCard" },
  fetchExchangeMoney: { method: "GET", path: "/api/reward/exchange-money", auth: true, client: "fetchExchangeMoney" },
  fetchFreespins: { method: "GET", path: "/api/reward/freespins", auth: true, client: "fetchFreespins" },
  // รายการด้านล่างเรียกผ่าน apiFetch แล้ว (lib/auth/client.ts · lib/lottery · lib/api/promotions.ts) — มี mock route ใน app/api
  fetchSession: { method: "GET", path: "/api/auth/session", auth: false, client: "fetchSession" },
  loginUser: { method: "POST", path: "/api/auth/login", auth: false, client: "loginUser" },
  registerUser: { method: "POST", path: "/api/auth/register", auth: false, client: "registerUser" },
  logoutUser: { method: "POST", path: "/api/auth/logout", auth: true, client: "logoutUser" },
  fetchProfile: { method: "GET", path: "/api/auth/profile", auth: true, client: "fetchProfile" },
  updateProfileAvatarPreset: { method: "PATCH", path: "/api/auth/profile", auth: true, client: "updateProfileAvatarPreset" },
  submitLotteryBetSlip: { method: "POST", path: "/api/lottery/bets", auth: true, client: "submitLotteryBetSlip" },
  fetchLotterySlipPage: { method: "GET", path: "/api/lottery/slips", auth: true, client: "fetchLotterySlipPage" },
  fetchLotterySlip: { method: "GET", path: "/api/lottery/slips/:slipId", auth: true, client: "fetchLotterySlip" },
  fetchPromotionsCatalog: { method: "GET", path: "/api/promotions", auth: false, client: "fetchPromotionsCatalog" },
  fetchPromotionDetail: { method: "GET", path: "/api/promotions/:id", auth: false, client: "fetchPromotionDetail" },
} as const satisfies Record<string, EndpointDef>;
