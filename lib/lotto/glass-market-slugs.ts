/**
 * จับคู่ id ตลาดหวยของหน้าแรก lotto (`?lotto=<id>`) → slug ของ catalog ใน glass (`/lottery/<slug>`)
 * ใช้ใน route alias /enterlotto — ตลาดที่ glass ไม่มี (เช่น สลากออมสิน) ไปหน้า hub แทน
 */
export const LOTTO_ID_TO_GLASS_SLUG: Record<string, string> = {
  thailotto: "thai-government",
  baaclotto: "baac",
  yeekee5: "yiki-5",
  yeekee15: "yiki-15",
  yeekee30: "yiki-30",
  laoslotto: "laos",
  hanoylotto: "hanoi",
  malaylotto: "malaysia",
  dowjoneslotto: "dow-jones",
  chinalotto: "china",
  germanlotto: "germany",
  russialotto: "russia",
  korealotto: "korea",
  nikkeilotto: "nikkei",
  englandlotto: "uk",
  hangsenlotto: "hong-kong",
  taiwanlotto: "taiwan",
  singaporelotto: "singapore",
  indialotto: "india",
  egyptlotto: "egypt",
};

export function glassLotteryPathForLottoId(id: string | undefined): string {
  const slug = id ? LOTTO_ID_TO_GLASS_SLUG[id] : undefined;
  return slug ? `/lottery/${slug}` : "/lottery";
}
