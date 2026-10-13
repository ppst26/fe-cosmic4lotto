import type { GameItem } from "@/app/types/lobby";
import { SPORT_PROVIDER_COVERS } from "./sportProvidersData";

/** แถวกีฬาหน้าแรก — รูปจาก public/sport (.avif) */
export const SPORT_FEATURED_ITEMS: GameItem[] = SPORT_PROVIDER_COVERS.map((item) => ({
  id: item.id,
  title: item.title,
  provider: item.provider,
  href: item.href,
  coverSrc: item.coverSrc,
}));
