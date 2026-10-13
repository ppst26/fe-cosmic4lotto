/** รายการประเภทหวยสำหรับ carousel แทงหวย (ไม่ใช่การ์ดผลหวย) */
export type LottoBetTypeItem = {
  id: string;
  name: string;
  flagEmoji: string;
  href: string;
  closed?: boolean;
  statusLabel?: string;
};

export type LottoBetCarouselMode = "2peek" | "4peek";

export type LottoBetTypeSection = {
  id: string;
  title: string;
  items: LottoBetTypeItem[];
  /** desktop ≥1024 — default 4peek (หวยหุ้น) */
  carouselMode?: LottoBetCarouselMode;
};

function item(
  id: string,
  name: string,
  flagEmoji: string,
  extra?: Pick<LottoBetTypeItem, "closed" | "statusLabel">,
): LottoBetTypeItem {
  return {
    id,
    name,
    flagEmoji,
    href: `/enterlotto?lotto=${id}`,
    ...extra,
  };
}

export const LOTTO_BET_TYPE_SECTIONS: LottoBetTypeSection[] = [
  {
    id: "gov",
    title: "หวยรัฐบาล / สลากออมทรัพย์",
    carouselMode: "2peek",
    items: [
      item("thailotto", "หวยรัฐบาลไทย", "🇹🇭"),
      item("gsblotto", "สลากออมทรัพย์ หวยออมสิน", "🏦"),
      item("baaclotto", "หวย ธ.ก.ส.", "🏦"),
    ],
  },
  {
    id: "yeekee",
    title: "หวยจับยี่กี (จับเวลา)",
    carouselMode: "2peek",
    items: [
      item("yeekee5", "หวยยี่กี 5 นาที", "⏱️"),
      item("yeekee15", "หวยยี่กี 15 นาที", "⏱️"),
      item("yeekee30", "หวยยี่กี 30 นาที", "⏱️"),
    ],
  },
  {
    id: "foreign",
    title: "หวยต่างประเทศ (สลากเพื่อนบ้าน)",
    carouselMode: "2peek",
    items: [
      item("laoslotto", "หวยลาว", "🇱🇦"),
      item("hanoylotto", "หวยฮานอย (เวียดนาม)", "🇻🇳"),
      item("malaylotto", "หวยมาเลย์", "🇲🇾"),
    ],
  },
  {
    id: "stock",
    title: "หวยหุ้นต่างประเทศ",
    items: [
      item("dowjoneslotto", "หวยดาวโจนส์ (สหรัฐฯ)", "🇺🇸"),
      item("chinalotto", "หวยจีน", "🇨🇳"),
      item("germanlotto", "หวยเยอรมัน", "🇩🇪"),
      item("russialotto", "หวยรัสเซีย", "🇷🇺"),
      item("korealotto", "หวยเกาหลี", "🇰🇷"),
      item("nikkeilotto", "หวยนิเคอิ (ญี่ปุ่น)", "🇯🇵"),
      item("englandlotto", "หวยอังกฤษ", "🇬🇧"),
      item("hangsenlotto", "หวยฮั่งเส็ง (ฮ่องกง)", "🇭🇰"),
      item("taiwanlotto", "หวยไต้หวัน", "🇹🇼", {
        closed: true,
        statusLabel: "ปิดรับแทง",
      }),
      item("singaporelotto", "หวยสิงคโปร์", "🇸🇬"),
      item("indialotto", "หวยอินเดีย", "🇮🇳"),
      item("egyptlotto", "หวยอียิปต์", "🇪🇬"),
    ],
  },
];
