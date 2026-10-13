/** ชื่อ/ธงสำหรับ map ผลหวยจาก dump API */
export type LottoCardMeta = {
  name: string;
  flagEmoji: string;
};

export const LOTTO_CARD_META: Record<string, LottoCardMeta> = {
  thailotto: { name: "หวยรัฐบาลไทย", flagEmoji: "🇹🇭" },
  gsblotto: { name: "หวย ออมสิน", flagEmoji: "🏦" },
  baaclotto: { name: "หวย ธกส.", flagEmoji: "🏦" },
  laoslotto: { name: "หวยลาว", flagEmoji: "🇱🇦" },
  hanoylotto: { name: "ฮานอย", flagEmoji: "🇻🇳" },
  laoslottoextra: { name: "หวยลาว Extra", flagEmoji: "🇱🇦" },
  laoslottotv: { name: "หวยลาว TV", flagEmoji: "🇱🇦" },
  laoslottohd: { name: "หวยลาว HD", flagEmoji: "🇱🇦" },
  hanoylottostar: { name: "ฮานอย Star", flagEmoji: "🇻🇳" },
};
