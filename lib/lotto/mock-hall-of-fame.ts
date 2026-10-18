/** mock รายชื่อผู้ถูกรางวัลล่าสุด (Hall of Fame หน้าแรก) — รอเชื่อม API */

export type HallOfFameItem = {
  id: string;
  name: string;
  /** เลขรูป avatar ใน public/Avartar */
  avatar: number;
  lottoType: string;
  flagEmoji: string;
  round: string;
  /** เลขที่ถูกรางวัล (เรียงทีละหลัก) */
  numbers: string;
};

export const HALL_OF_FAME: HallOfFameItem[] = [
  { id: "h1", name: "som***89", avatar: 3, lottoType: "หวยรัฐบาลไทย", flagEmoji: "🇹🇭", round: "งวด 16 ก.ย. 69", numbers: "284701" },
  { id: "h2", name: "pae***24", avatar: 7, lottoType: "หวยลาว", flagEmoji: "🇱🇦", round: "รอบ 19 ต.ค. 69", numbers: "428" },
  { id: "h3", name: "nut***11", avatar: 10, lottoType: "หวยยี่กี 5 นาที", flagEmoji: "🎯", round: "รอบที่ 42", numbers: "903" },
  { id: "h4", name: "mint***07", avatar: 5, lottoType: "หวยฮานอย", flagEmoji: "🇻🇳", round: "รอบ 19 ต.ค. 69", numbers: "672" },
  { id: "h5", name: "boss***55", avatar: 12, lottoType: "หวยดาวโจนส์", flagEmoji: "🇺🇸", round: "รอบ 18 ต.ค. 69", numbers: "51438" },
  { id: "h6", name: "ice***63", avatar: 2, lottoType: "หวยมาเลย์", flagEmoji: "🇲🇾", round: "รอบ 19 ต.ค. 69", numbers: "584" },
];
