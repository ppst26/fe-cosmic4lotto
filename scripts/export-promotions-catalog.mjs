/**
 * สร้าง public/promotions/catalog.json จาก mock ปัจจุบัน + รูปใน public/promotions
 * รัน: node scripts/export-promotions-catalog.mjs
 */
import { writeFileSync } from "fs";
/** รูปจาก back office mock — path ใต้ public */
const BANNERS = {
  pro1: "/promotions/mock-pro1.avif",
  pro2: "/promotions/mock-pro2.avif",
  pro3: "/promotions/mock-pro3.avif",
};

// โหลดข้อมูลเดิมผ่าน ts compile ไม่ได้ — ฝัง catalog ตรงนี้ sync กับ promotionsHubMockData
const catalog = {
  version: 1,
  updatedAt: new Date().toISOString(),
  banners: BANNERS,
  mobileCategoryTabs: [
    { id: "all", label: "ทั้งหมด" },
    { id: "new-member", label: "สมาชิกใหม่" },
    { id: "daily", label: "ประจำวัน" },
    { id: "privilege", label: "สิทธิพิเศษ" },
  ],
  hubCategoryTabs: [
    { id: "all", label: "ทั้งหมด" },
    { id: "slots", label: "สล็อต" },
    { id: "casino", label: "คาสิโน" },
    { id: "sport", label: "กีฬา" },
  ],
  hero: {
    title: "สิทธิพิเศษ ต้อนรับคุณ",
    subtitle: "ค้นพบโปรโมชั่นที่เหมาะกับคุณ",
    ctaLabel: "ดูรายละเอียด",
    detailId: "welcome",
    categories: ["slots", "casino", "sport"],
  },
  featured: [
    {
      id: "featured-cashback",
      title: "คืนยอดเสีย",
      subtitle: "ตรวจสอบยอดคืนและรับโบนัสของคุณ",
      detailId: "promo-cashback",
      ctaLabel: "ดูรายละเอียด",
      categories: ["casino", "sport"],
    },
    {
      id: "featured-refer-friends",
      title: "ชวนเพื่อน รับรายได้ 2 ต่อ",
      subtitle: "แชร์ลิงก์และติดตามรายได้จากเพื่อน",
      detailId: "promo-refer-friends",
      ctaLabel: "ดูรายละเอียด",
      categories: ["slots", "casino", "sport"],
    },
    {
      id: "featured-vip",
      title: "สิทธิพิเศษ VIP",
      subtitle: "สำรวจรางวัลประจำระดับของคุณ",
      detailId: "promo-vip",
      ctaLabel: "ดูรายละเอียด",
      categories: ["casino"],
    },
    {
      id: "featured-slots-drops",
      title: "Drops & Wins สล็อต",
      subtitle: "ลุ้นรางวัลรายวันจาก Pragmatic Play",
      detailId: "welcome",
      ctaLabel: "ดูรายละเอียด",
      categories: ["slots"],
    },
    {
      id: "featured-sport-boost",
      title: "บูสต์คอมโบกีฬา",
      subtitle: "เพิ่มยอดชนะเมื่อแทงหลายคู่",
      detailId: "promo-cashback",
      ctaLabel: "ดูรายละเอียด",
      categories: ["sport"],
    },
  ],
  activities: [
    {
      id: "activity-check-in",
      title: "เช็คอินรายวัน",
      subtitle: "สะสมวัน รับรางวัลเครดิตฟรี",
      detailId: "promo-check-in",
      ctaLabel: "ดูรายละเอียด",
      categories: ["slots", "casino"],
    },
    {
      id: "activity-wheel",
      title: "วงล้อพารวย",
      subtitle: "ลุ้นรับรางวัลมากมายทุกวัน",
      detailId: "promo-wheel",
      ctaLabel: "ดูรายละเอียด",
      categories: ["slots", "sport"],
    },
  ],
  mobileList: [
    {
      id: "mobile-hero-welcome",
      title: "สิทธิพิเศษ ต้อนรับคุณ",
      detailId: "welcome",
      bannerSrc: BANNERS.pro1,
      expiresLabel: "31/12/2568",
      mobileCategories: ["new-member", "privilege"],
    },
    {
      id: "mobile-cashback",
      title: "คืนยอดเสีย สูงสุด 30,000",
      detailId: "promo-cashback",
      bannerSrc: BANNERS.pro2,
      expiresLabel: "31/12/2568",
      mobileCategories: ["daily", "privilege"],
    },
    {
      id: "mobile-refer",
      title: "ชวนเพื่อน รับรายได้ 2 ต่อ",
      detailId: "promo-refer-friends",
      bannerSrc: BANNERS.pro3,
      expiresLabel: "30/06/2569",
      mobileCategories: ["new-member"],
    },
    {
      id: "mobile-vip",
      title: "สิทธิพิเศษ VIP",
      detailId: "promo-vip",
      bannerSrc: BANNERS.pro1,
      expiresLabel: "31/12/2568",
      mobileCategories: ["privilege"],
    },
    {
      id: "mobile-slots-drops",
      title: "Drops & Wins สล็อต",
      detailId: "welcome",
      bannerSrc: BANNERS.pro2,
      expiresLabel: "15/08/2568",
      mobileCategories: ["daily"],
    },
    {
      id: "mobile-sport-boost",
      title: "บูสต์คอมโบกีฬา",
      detailId: "promo-cashback",
      bannerSrc: BANNERS.pro3,
      expiresLabel: "31/03/2569",
      mobileCategories: ["daily"],
    },
  ],
};

writeFileSync("public/promotions/catalog.json", JSON.stringify(catalog, null, 2));
console.log("catalog.json written");
