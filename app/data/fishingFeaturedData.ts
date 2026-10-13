import type { GameItem } from "@/app/types/lobby";
import { FISHING_PROVIDER_COVERS } from "./fishingProvidersData";

/** แถวยิงปลาหน้าแรก — รูปจาก public/fishing (.avif) */
export const FISHING_FEATURED_ITEMS: GameItem[] = FISHING_PROVIDER_COVERS.map((item) => ({
  id: item.id,
  title: item.title,
  provider: item.provider,
  href: item.href,
  coverSrc: item.coverSrc,
}));
