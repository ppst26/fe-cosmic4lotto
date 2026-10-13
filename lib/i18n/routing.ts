import { DEFAULT_LOCALE, hasLocale, type Locale } from "./config";
import { isProtectedPath } from "@/lib/auth/protectedPaths";

/** แยก prefix ภาษาออกจาก pathname — /en/vip → { locale: "en", path: "/vip" } */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const segment = pathname.split("/")[1];
  if (!hasLocale(segment)) return { locale: null, path: pathname || "/" };
  return { locale: segment, path: pathname.slice(segment.length + 1) || "/" };
}

/**
 * href ภายในตามภาษา — th (default) ไม่มี prefix, ภาษาอื่นมี prefix
 * href ภายนอก, //host, #hash ปล่อยตามเดิม · idempotent: /en/vip + "th" → /vip
 */
export function withLocale(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const pathname = cut === -1 ? href : href.slice(0, cut);
  const suffix = cut === -1 ? "" : href.slice(cut);
  const { path } = splitLocale(pathname);
  if (locale === DEFAULT_LOCALE) return `${path}${suffix}`;
  return `/${locale}${path === "/" ? "" : path}${suffix}`;
}

/** alias ของ tag ที่ browser ส่งมาแต่เราใช้ code อื่น */
const TAG_ALIASES: Record<string, Locale> = { tl: "fil", in: "id" };

/** เลือกภาษาที่รองรับจาก Accept-Language ตาม q-value — ไม่มีที่ตรง → null */
export function parseAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim(), q: q ? Number(q.trim().slice(2)) : 1, index };
    })
    .filter((entry) => entry.tag && !Number.isNaN(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { tag } of ranked) {
    if (hasLocale(tag)) return tag;
    const primary = tag.split("-")[0];
    if (hasLocale(primary)) return primary;
    if (primary in TAG_ALIASES) return TAG_ALIASES[primary];
  }
  return null;
}

/** ลำดับ: cookie → Accept-Language → th (ภาษาใน path จัดการก่อนเรียกฟังก์ชันนี้) */
export function resolveRequestLocale(input: {
  cookie: string | undefined;
  acceptLanguage: string | null;
}): Locale {
  if (hasLocale(input.cookie)) return input.cookie;
  return parseAcceptLanguage(input.acceptLanguage) ?? DEFAULT_LOCALE;
}

export type ProxyAction =
  | { type: "next" }
  | { type: "rewrite"; pathname: string }
  | { type: "redirect"; pathname: string; search: string };

/**
 * ตัดสินใจของ proxy.ts แบบ pure เพื่อให้ test ได้
 * 1) /th/... → redirect ไป URL ไม่มี prefix (th มี URL เดียว)
 * 2) ไม่มี prefix แต่ผู้ใช้เลือก/ใช้ภาษาอื่น (cookie → Accept-Language) → redirect /{locale}/...
 * 3) path ต้อง login แต่ไม่มี session → หน้าแรกของภาษานั้น ?layer=login
 * 4) ไม่มี prefix (ไทย) → rewrite ภายในไป /th/... ให้ตรง app/[lang] · มี prefix → ผ่าน
 */
export function decideProxyAction(input: {
  pathname: string;
  search: string;
  cookieLocale: string | undefined;
  acceptLanguage: string | null;
  hasSession: boolean;
}): ProxyAction {
  const split = splitLocale(input.pathname);
  const { path } = split;

  if (split.locale === DEFAULT_LOCALE) {
    return { type: "redirect", pathname: path, search: input.search };
  }

  let locale: Locale = split.locale ?? DEFAULT_LOCALE;
  if (!split.locale) {
    const preferred = resolveRequestLocale({ cookie: input.cookieLocale, acceptLanguage: input.acceptLanguage });
    if (preferred !== DEFAULT_LOCALE) {
      return { type: "redirect", pathname: withLocale(path, preferred), search: input.search };
    }
    locale = DEFAULT_LOCALE;
  }

  if (isProtectedPath(path) && !input.hasSession) {
    return { type: "redirect", pathname: withLocale("/", locale), search: "?layer=login" };
  }
  if (!split.locale) {
    return { type: "rewrite", pathname: `/${DEFAULT_LOCALE}${path === "/" ? "" : path}` };
  }
  return { type: "next" };
}
