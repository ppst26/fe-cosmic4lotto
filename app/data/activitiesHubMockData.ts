/** ข้อมูล mock หน้ากิจกรรม (/event) — รายการซ้าย + รายละเอียดขวา (desktop) */

import type {
  ActivityHubCategoryTabItem,
  ActivityTierRow,
  ActivityHubItem,
} from "@/app/types/activities";

export const ACTIVITY_HUB_CATEGORY_TABS: ActivityHubCategoryTabItem[] = [
  { id: "slots", labelKey: "activities.categories.slots" },
  { id: "casino", labelKey: "activities.categories.casino" },
];

const TURN_TIERS_SLOTS: ActivityTierRow[] = [
  { rank: 1, turnRequired: 5_000, bonus: 49, claimState: "locked" },
  { rank: 2, turnRequired: 30_000, bonus: 69, claimState: "locked" },
  { rank: 3, turnRequired: 100_000, bonus: 89, claimState: "locked" },
  { rank: 4, turnRequired: 700_000, bonus: 129, claimState: "locked" },
  { rank: 5, turnRequired: 5_000_000, bonus: 289, claimState: "locked" },
  { rank: 6, turnRequired: 10_000_000, bonus: 589, claimState: "locked" },
  { rank: 7, turnRequired: 20_000_000, bonus: 999, claimState: "locked" },
  { rank: 8, turnRequired: 30_000_000, bonus: 1_999, claimState: "locked" },
  { rank: 9, turnRequired: 40_000_000, bonus: 4_999, claimState: "locked" },
  { rank: 10, turnRequired: 50_000_000, bonus: 19_999, claimState: "locked" },
];

const TURN_TIERS_CASINO: ActivityTierRow[] = TURN_TIERS_SLOTS.map((row) => ({
  ...row,
  bonus: Math.round(row.bonus * 1.15),
}));

export const ACTIVITIES_HUB_ITEMS: ActivityHubItem[] = [
  {
    id: "act-turn-rewards",
    title: "ทำยอด Turn รับรางวัลจุใจ",
    imageUrl: "/event/ทายผลหหวย.avif",
    thumbTone: "turn",
    detailKind: "turn-tier",
    listMeta: "สะสมเทิร์นรับโบนัสตามลำดับ",
    period: "ทุกสัปดาห์ (รีเซ็ตทุกวันจันทร์ 00:00 น.)",
    categoryTabs: ["slots", "casino"],
    progress: {
      currentTurn: 0,
      rank1Target: 5_000,
      bonusEarned: 0,
      bonusCap: 39_000,
    },
    tiersByCategory: {
      slots: TURN_TIERS_SLOTS,
      casino: TURN_TIERS_CASINO,
    },
    rules: [
      "สมาชิก Cosmicbet ทุกระดับสามารถเข้าร่วมกิจกรรมสะสมยอด Turn ได้ทันทีโดยไม่ต้องลงทะเบียนล่วงหน้า",
      "ระบบจะคำนวณยอดเทิร์นโอเวอร์สะสมเฉพาะการเดิมพันในหมวดที่กำหนด (สล็อต / คาสิโนสด) ที่มีผลได้-เสียอย่างสมบูรณ์",
      "การเดิมพันที่มีผลเสมอ (Tie), การเดิมพันที่ถูกยกเลิก (Void/Cancelled), หรือการเดิมพันสองฝั่งตรงข้ามกัน จะไม่ถูกนับรวมในยอดเทิร์น",
      "เมื่อสะสมยอดเทิร์นครบตามแต่ละขั้นที่กำหนด ปุ่ม 'รับรางวัล' ในตารางจะปลดล็อก สามารถกดรับเครดิตโบนัสได้ทันที",
      "โบนัสที่ได้รับจะถูกโอนเข้าสู่กระเป๋าเครดิตหลักทันที มีเงื่อนไขทำเทิร์นโอเวอร์เพียง 1 เท่า ก่อนทำรายการถอนเงิน",
      "กิจกรรมนี้จะรีเซ็ตยอดเทิร์นสะสมและสิทธิ์การรับรางวัลทั้งหมดทุกวันจันทร์ เวลา 00:00 น. (GMT+7)",
      "ทางบริษัทฯ ขอสงวนสิทธิ์ในการระงับสิทธิ์หรือตัดสิทธิ์การรับรางวัล หากตรวจพบพฤติกรรมการทุจริต หรือการใช้ช่องโหว่ของระบบทุกกรณี",
    ],
  },
  {
    id: "act-football-predict",
    title: "ทายผลบอล",
    imageUrl: "/event/ทายผลหบอล.avif",
    thumbTone: "football",
    detailKind: "info",
    statusOverlay: "ยังไม่เปิดให้ทายผล",
    listMeta: "รอบถัดไปจะเปิดเร็ว ๆ นี้",
    period: "เปิดรับทายผลทุกวันเสาร์ - อาทิตย์",
    infoSummary: "กิจกรรมทายผลฟุตบอลลีกชั้นนำประจำสัปดาห์ ทายถูกรับเครดิตฟรีและของรางวัลมากมาย",
    infoBullets: [
      "ทายผลสกอร์และผู้ชนะก่อนเวลาคิกออฟ",
      "รางวัลใหญ่สำหรับผู้ที่ทายถูกครบทุกคู่ในแต่ละสัปดาห์",
      "ประกาศผลและแจกรางวัลภายใน 24 ชม. หลังจบการแข่งขัน",
    ],
    rules: [
      "สมาชิกต้องมียอดฝากสะสมอย่างน้อย 300 บาท ภายในสัปดาห์ที่มีการจัดกิจกรรม",
      "สามารถส่งผลการทายได้ 1 สิทธิ์ต่อ 1 สมาชิกก่อนเริ่มการแข่งขัน 30 นาที",
      "คำตัดสินของผลการแข่งขันจะยึดตามผลเวลาปกติ 90 นาทีรวมทดเวลาบาดเจ็บ (ไม่รวมต่อเวลาพิเศษและจุดโทษ)",
      "ของรางวัลและโบนัสจะโอนเข้าบัญชีสมาชิกโดยอัตโนมัติภายใน 24 ชั่วโมงหลังจบแมตช์",
    ],
  },
  {
    id: "act-boxing-predict",
    title: "ทายผลมวย",
    imageUrl: "/event/ทายผลมวย.avif",
    thumbTone: "turn",
    detailKind: "info",
    listMeta: "ศึกมวยคู่เอกประจำสัปดาห์",
    period: "เปิดทายผลทุกวันศุกร์ และ วันเสาร์",
    infoSummary: "ร่วมสนุกทายผลมวยคู่เอกประจำสัปดาห์ ลุ้นรับเครดิตฟรีและโบนัสพิเศษ",
    infoBullets: [
      "ทายผลผู้ชนะคู่เอก ศึกมวยเวทีมาตรฐาน",
      "ทายผลล่วงหน้าก่อนคู่ชกขึ้นเวที",
      "รับโบนัสพิเศษเมื่อทายถูกติดต่อกัน",
    ],
    rules: [
      "เปิดรับทายผลมวยเฉพาะคู่เอกที่ระบบกำหนดในแต่ละสัปดาห์เท่านั้น",
      "ปิดรับทายผลล่วงหน้า 15 นาทีก่อนคู่เอกขึ้นชก",
      "กรณีคู่มวยถูกเลื่อนการแข่งขัน หรือผลตัดสินเป็นโมฆะ จะถือว่ารอบการทายผลนั้นยกเลิก",
      "เงินรางวัลที่ได้รับต้องทำเทิร์นโอเวอร์ 1 เท่าในหมวดกีฬา จึงจะสามารถแจ้งถอนได้",
    ],
  },
];

