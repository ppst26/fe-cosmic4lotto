import { fetchLotteryCatalog } from "@/lib/api/lotteryContent";

/** ตลาดที่มีโฟลเดอร์ของตัวเองแล้ว (thai-government / yiki-*) — ไม่ต้องสร้างซ้ำใน [marketId] */
const DEDICATED_MARKET_ROUTES = new Set(["thai-government", "yiki-5", "yiki-15", "yiki-30"]);

/** prerender ทุกตลาดใน catalog — กดเปลี่ยนตลาดได้ทันทีเหมือนหน้า static (ไม่ต้องรอ render ฝั่ง server) */
export async function generateStaticParams() {
  const res = await fetchLotteryCatalog();
  /** โหลดแคตตาล็อกไม่ได้ตอน build → ไม่ prerender (หน้ายัง render ตามคำขอได้ · ตลาดไม่พบแสดงจากฝั่ง client) */
  if (!res.ok) return [];
  return res.data.filter((entry) => !DEDICATED_MARKET_ROUTES.has(entry.slug)).map((entry) => ({
    marketId: entry.slug,
  }));
}

/**
 * Step 2 — รายการรอบหวยตลาดทั่วไป (/lottery/[marketId])
 * เนื้อหาอยู่ใน lottery/layout.tsx → LotteryMarketsLayout (ตลาดที่ไม่อยู่ใน catalog แสดง "ไม่พบตลาด" จากที่นั่น)
 */
export default function LotteryMarketRoundsPage() {
  return null;
}
