/** ธงของการ์ดผลหวยหน้าแรก + แถวผลหวยของ glass (LOTTERY_LATEST_RESULTS) ที่ใช้เป็นแหล่งข้อมูล */
export type LottoCardMeta = {
  /** id แถวใน app/data/lotteryHubMockData.ts → LOTTERY_LATEST_RESULTS */
  rowId: string;
  flagEmoji: string;
};

export const LOTTO_CARD_META: Record<string, LottoCardMeta> = {
  laoslotto: { rowId: "res-la", flagEmoji: "🇱🇦" },
  hanoylotto: { rowId: "res-hn", flagEmoji: "🇻🇳" },
  malaylotto: { rowId: "res-my", flagEmoji: "🇲🇾" },
  chinalotto: { rowId: "res-cn", flagEmoji: "🇨🇳" },
  nikkeilotto: { rowId: "res-jp", flagEmoji: "🇯🇵" },
  korealotto: { rowId: "res-kr", flagEmoji: "🇰🇷" },
  dowjoneslotto: { rowId: "res-us", flagEmoji: "🇺🇸" },
  thailotto: { rowId: "res-th", flagEmoji: "🇹🇭" },
};
