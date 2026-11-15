import React from "react";

/** ส่วนขยายท้ายชื่อ เช่น "5 นาที" · "รอบเช้า" · "VIP" · "Super" · "(Morning)" */
const QUALIFIER = /\s+(\(.+\)|\d+\s*(?:นาที|-?\s?minutes?|-?\s?min)|รอบ\S+|พิเศษ|Super|VIP|Special|Morning|Afternoon|Evening)$/i;

/**
 * แยกชื่อตลาดเป็นชื่อหลัก + ส่วนขยาย — ใช้จัดตัวอักษรให้ชื่อหลักหนา ส่วนขยายเล็กและบางกว่า
 * ไม่พบส่วนขยาย → sub เป็น null · เว้นวรรคหลังคำว่า "หวย" ใช้ non-breaking กันตัดบรรทัดเหลือคำเดียว
 */
export function splitMarketTitle(title: string): { main: string; sub: string | null } {
  const match = QUALIFIER.exec(title);
  const rawMain = match ? title.slice(0, match.index) : title;
  const sub = match ? match[1].replace(/^\((.*)\)$/, "$1").trim() : null;
  return { main: rawMain.replace(/^หวย /, "หวย\u00A0"), sub };
}

/** ชื่อตลาดแบบสองระดับ — สไตล์ใน lottery css (.lottery-market-title__main / __sub) */
export function LotteryMarketTitle({ title }: { title: string }) {
  const { main, sub } = splitMarketTitle(title);
  return (
    <>
      <span className="lottery-market-title__main">{main}</span>
      {sub ? <span className="lottery-market-title__sub">{sub}</span> : null}
    </>
  );
}
