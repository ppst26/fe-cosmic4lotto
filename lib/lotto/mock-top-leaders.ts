/** mock ผู้ชนะรางวัลสูงสุดประจำวัน (หน้าแรก) — รอเชื่อม API */

export type TopLeaderItem = {
  rank: number;
  /** ชื่อผู้เล่น (ปิดบางส่วน) */
  name: string;
  /** เลขรูป avatar ใน public/Avartar */
  avatar: number;
  /** รางวัลที่ได้ (บาท) */
  prize: number;
  lottoType: string;
  flagEmoji: string;
  /** เลขที่ถูกรางวัล */
  number: string;
  /** รอบ/งวดที่ได้รางวัล */
  round: string;
};

export const TOP_LEADERS: TopLeaderItem[] = [
  { rank: 1, name: "som***89", avatar: 3, prize: 744000, lottoType: "หวยรัฐบาลไทย", flagEmoji: "🇹🇭", number: "284701", round: "งวด 16 ก.ย. 69" },
  { rank: 2, name: "pae***24", avatar: 7, prize: 527000, lottoType: "หวยลาว", flagEmoji: "🇱🇦", number: "428", round: "รอบ 19 ต.ค. 69" },
  { rank: 3, name: "nut***11", avatar: 10, prize: 377000, lottoType: "หวยยี่กี 5 นาที", flagEmoji: "🎯", number: "903", round: "รอบที่ 42" },
  { rank: 4, name: "mint***07", avatar: 5, prize: 320000, lottoType: "หวยฮานอย", flagEmoji: "🇻🇳", number: "672", round: "รอบ 19 ต.ค. 69" },
  { rank: 5, name: "boss***55", avatar: 12, prize: 310000, lottoType: "หวยดาวโจนส์", flagEmoji: "🇺🇸", number: "514", round: "รอบ 18 ต.ค. 69" },
];
