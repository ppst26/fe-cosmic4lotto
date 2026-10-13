import type {
  LotteryMessageKey,
  ThaiLottoBetType,
  ThaiLottoDigitGroup,
  ThaiLottoDraw,
  ThaiLottoResult,
} from "@/app/types/lottery";

/** แท็บกลุ่มจำนวนหลัก — ใช้ใน ThaiLottoBetTypePicker */
export const THAI_LOTTO_GROUPS: { id: ThaiLottoDigitGroup; labelKey: LotteryMessageKey }[] = [
  { id: "three", labelKey: "groups.three" },
  { id: "two", labelKey: "groups.two" },
  { id: "run", labelKey: "groups.run" },
];

/** ประเภทการแทง + อัตราจ่าย (mock — รอค่าจริงจาก API) */
export const THAI_LOTTO_BET_TYPES: ThaiLottoBetType[] = [
  { id: "three_top", labelKey: "betTypes.threeTop", group: "three", digits: 3, payoutRate: 900 },
  { id: "three_tod", labelKey: "betTypes.threeTod", group: "three", digits: 3, payoutRate: 150 },
  { id: "three_front", labelKey: "betTypes.threeFront", group: "three", digits: 3, payoutRate: 450 },
  { id: "three_back", labelKey: "betTypes.threeBottom", group: "three", digits: 3, payoutRate: 450 },
  { id: "two_top", labelKey: "betTypes.twoTop", group: "two", digits: 2, payoutRate: 90 },
  { id: "two_bottom", labelKey: "betTypes.twoBottom", group: "two", digits: 2, payoutRate: 90 },
  { id: "run_top", labelKey: "betTypes.runTop", group: "run", digits: 1, payoutRate: 3.2 },
  { id: "run_bottom", labelKey: "betTypes.runBottom", group: "run", digits: 1, payoutRate: 4.2 },
];

/** งวดที่เปิดรับแทง (mock) — งวด 1 ต.ค. 2569 */
export const THAI_LOTTO_CURRENT_DRAW: ThaiLottoDraw = {
  id: "th-gov-2026-10-01",
  drawLabel: { kind: "draw", date: "2026-10-01T16:00:00+07:00" },
  closeAt: "2026-10-01T15:00:00+07:00",
  minBet: 1,
  maxBet: 5000,
};

/** ผลรางวัลงวดก่อน (mock) — งวด 16 ก.ย. 2569 */
export const THAI_LOTTO_LAST_RESULT: ThaiLottoResult = {
  drawLabel: { kind: "draw", date: "2026-09-16T16:00:00+07:00" },
  firstPrize: "284701",
  front3: ["019", "552"],
  back3: ["731", "468"],
  bottom2: "56",
};
