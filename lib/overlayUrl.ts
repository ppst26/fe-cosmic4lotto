/** query ?layer=… — sync modal / bottom sheet กับ URL (ฝาก · ถอน · VIP ฯลฯ) */

export const OVERLAY_LAYER_KEY = "layer";
export const OVERLAY_VIP_TAB_KEY = "vipTab";
export const OVERLAY_HUB_KEY = "hub";

export type OverlayLayer =
  | "deposit"
  | "withdraw"
  | "vip"
  | "coupon"
  | "profile"
  | "hub"
  | "login"
  | "signup"
  | "menu"
  | "language";

const OVERLAY_LAYERS: OverlayLayer[] = [
  "deposit",
  "withdraw",
  "vip",
  "coupon",
  "profile",
  "hub",
  "login",
  "signup",
  "menu",
  "language",
];

export type VipModalTabParam = "my-level" | "rank" | "benefits";

export function parseVipModalTab(value: string | null): VipModalTabParam | null {
  if (value === "my-level" || value === "rank" || value === "benefits") return value;
  return null;
}

export function parseOverlayLayer(value: string | null): OverlayLayer | null {
  if (!value) return null;
  return OVERLAY_LAYERS.includes(value as OverlayLayer) ? (value as OverlayLayer) : null;
}

export function readOverlayLayer(params: URLSearchParams): OverlayLayer | null {
  return parseOverlayLayer(params.get(OVERLAY_LAYER_KEY));
}

/** ลบพารามิเตอร์ที่ผูกกับ layer นั้น */
export function clearLayerParams(params: URLSearchParams, layer: OverlayLayer): void {
  if (params.get(OVERLAY_LAYER_KEY) !== layer) return;
  params.delete(OVERLAY_LAYER_KEY);
  if (layer === "vip") params.delete(OVERLAY_VIP_TAB_KEY);
  if (layer === "hub") {
    params.delete(OVERLAY_HUB_KEY);
    params.delete(OVERLAY_VIP_TAB_KEY);
  }
}
