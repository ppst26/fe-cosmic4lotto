/**
 * แปลง slug ใน URL หมวดคาสิโน/ยิงปลา/เกมไพ่ → providerId สำหรับ getGamesByProvider
 */

const CASINO_SLUG_TO_PROVIDER: Record<string, string> = {
  "pragmatic-play": "pragmatic",
  "pretty-gaming": "pretty-gaming",
  "sa-gaming": "sa-gaming",
  evolution: "evolution",
  "dream-gaming": "dream-gaming",
  "ae-sexy": "ae-sexy",
  allbet: "allbet",
  betgames: "betgames",
  microgaming: "microgaming",
  "mt-live": "mt-live",
  "vivo-gaming": "vivo-gaming",
  winfinity: "winfinity",
  "wm-casino": "wm-casino",
  "yb-live": "yb-live",
};

/** slug จาก /casino/[provider] · /fishing/[provider] · /cards/[provider] */
export function resolveCategoryProviderId(
  category: "casino" | "fishing" | "cards",
  slug: string,
): string {
  const normalized = slug.toLowerCase().trim();
  if (category === "casino" && CASINO_SLUG_TO_PROVIDER[normalized]) {
    return CASINO_SLUG_TO_PROVIDER[normalized];
  }
  return normalized;
}

export function casinoProviderHrefFromFile(file: string): string {
  const known: Record<string, string> = {
    pragmatic: "/casino/pragmatic-play",
    pretty: "/casino/pretty-gaming",
    sa: "/casino/sa-gaming",
  };
  return known[file] ?? `/casino/${file}`;
}
