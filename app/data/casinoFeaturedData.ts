import type { GameItem } from "@/app/types/lobby";
import { CASINO_PROVIDER_COVERS } from "./casinoProvidersData";

/** แถวคาสิโนหน้าแรก — สูงสุด 15 ค่ายจาก public/casino */
export const CASINO_FEATURED_ITEMS: GameItem[] = CASINO_PROVIDER_COVERS.slice(0, 15).map(
  (item) => ({
    id: item.id,
    title: item.title,
    provider: item.provider,
    href: item.href,
    coverSrc: item.coverSrc,
  }),
);
