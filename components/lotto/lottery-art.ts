import { getLotteryIconSrc } from "@/app/data/lotteryIconAssets";
import { LOTTO_ID_TO_GLASS_SLUG } from "@/lib/lotto/glass-market-slugs";

/** id หวยของหน้าแรก → รูปใน public/lottery (ผ่าน slug ตลาดของ glass) — undefined ถ้าไม่มีรูป เช่น ออมสิน */
export function getLotteryArtSrc(id: string): string | undefined {
  const slug =
    LOTTO_ID_TO_GLASS_SLUG[id] ??
    LOTTO_ID_TO_GLASS_SLUG[id.replace(/(extra|tv|hd|star)$/, "")];
  return slug ? getLotteryIconSrc(slug) : undefined;
}
