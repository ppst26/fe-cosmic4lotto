/** สุ่ม mock ผู้โชคดี (Hall of Fame) เพิ่มทีละแถวทุกรอบ — รอเชื่อม API */
import type { HallOfFameItem } from "./mock-hall-of-fame";

export const MOCK_ROTATE_MS = 10_000;

const AVATARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];
const NAME_PREFIX = ["som", "pae", "nut", "mint", "boss", "ice", "ploy", "fah", "ton", "beam", "aom", "game", "nong", "pang", "kim", "joy", "max", "tae"];

/** ประเภทหวย + จำนวนหลักของเลขที่ถูก + รูปแบบรอบ */
const TYPES = [
  { name: "หวยรัฐบาลไทย", flag: "🇹🇭", digits: 6, round: "date" },
  { name: "หวยลาว", flag: "🇱🇦", digits: 3, round: "date" },
  { name: "หวยฮานอย", flag: "🇻🇳", digits: 3, round: "date" },
  { name: "หวยดาวโจนส์", flag: "🇺🇸", digits: 5, round: "date" },
  { name: "หวยมาเลย์", flag: "🇲🇾", digits: 3, round: "date" },
  { name: "หวยจีน", flag: "🇨🇳", digits: 3, round: "date" },
  { name: "หวยยี่กี 5 นาที", flag: "🎯", digits: 3, round: "yeekee" },
  { name: "หวยยี่กี 15 นาที", flag: "🎯", digits: 3, round: "yeekee" },
] as const;

const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function randomName(): string {
  const n = Math.floor(Math.random() * 90) + 10;
  const m = Math.floor(Math.random() * 90) + 10;
  return `${pick(NAME_PREFIX)}***${m > 50 ? n : m}`;
}

function randomDigits(count: number): string {
  let out = "";
  for (let i = 0; i < count; i += 1) out += Math.floor(Math.random() * 10);
  return out;
}

function randomRound(kind: "date" | "yeekee"): string {
  if (kind === "yeekee") return `รอบที่ ${Math.floor(Math.random() * 120) + 1}`;
  const d = new Date(Date.now() - Math.floor(Math.random() * 3) * 86_400_000);
  const be = (d.getFullYear() + 543) % 100;
  return `รอบ ${d.getDate()} ${MONTHS[d.getMonth()]} ${be}`;
}

/** สุ่มรายการผู้ชนะโดยไม่ซ้ำชื่อ/ประเภทเดิมติดกัน */
function randomEntries(count: number) {
  const types = [...TYPES].sort(() => Math.random() - 0.5);
  const avatars = [...AVATARS].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    return {
      name: randomName(),
      avatar: avatars[i % avatars.length],
      lottoType: type.name,
      flagEmoji: type.flag,
      round: randomRound(type.round),
      numbers: randomDigits(type.digits),
    };
  });
}

/** ผู้โชคดีรายใหม่ 1 แถว (id ขึ้นต้นด้วย n- เพื่อให้แสดง animation เฉพาะแถวที่เพิ่งเข้า) */
export function randomHallOfFameEntry(seq: number): HallOfFameItem {
  return { id: `n-${seq}`, ...randomEntries(1)[0] };
}
