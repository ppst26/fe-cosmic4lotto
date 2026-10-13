"use client";

import NextLink from "next/link";
import { useParams, usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";
import { useCallback, useMemo, type ComponentProps } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE_SEC, hasLocale, type Locale } from "./config";
import { splitLocale, withLocale } from "./routing";

/** ภาษาจาก segment [lang] */
export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  return hasLocale(params?.lang) ? params.lang : DEFAULT_LOCALE;
}

/** pathname ที่ตัด prefix ภาษาแล้ว — logic เทียบ path เดิมใช้ต่อได้ทันที */
export function usePathname(): string {
  return splitLocale(useNextPathname() ?? "/").path;
}

type NextRouter = ReturnType<typeof useNextRouter>;

/** router ที่เติม prefix ภาษาให้ push / replace / prefetch */
export function useRouter() {
  const router = useNextRouter();
  const locale = useLocale();
  return useMemo(
    () => ({
      back: router.back,
      forward: router.forward,
      refresh: router.refresh,
      push: (href: string, options?: Parameters<NextRouter["push"]>[1]) =>
        router.push(withLocale(href, locale), options),
      replace: (href: string, options?: Parameters<NextRouter["replace"]>[1]) =>
        router.replace(withLocale(href, locale), options),
      prefetch: (href: string, options?: Parameters<NextRouter["prefetch"]>[1]) =>
        router.prefetch(withLocale(href, locale), options),
    }),
    [router, locale],
  );
}

type LinkProps = ComponentProps<typeof NextLink>;

/** next/link ที่เติม prefix ภาษา — ใช้แทนแบบ drop-in (default export เหมือน next/link) */
export default function Link({ href, ...props }: LinkProps) {
  const locale = useLocale();
  const localized =
    typeof href === "string"
      ? withLocale(href, locale)
      : href.pathname
        ? { ...href, pathname: withLocale(href.pathname, locale) }
        : href;
  return <NextLink href={localized} {...props} />;
}

/**
 * สลับภาษา: ตั้ง cookie + เปลี่ยน prefix · href = path ปลายทาง (ค่าเริ่มต้นคง path/query/hash ปัจจุบัน)
 * root layout เปลี่ยนตาม [lang] จึงเป็นการโหลดหน้าใหม่ทั้งหน้า
 */
export function useSwitchLocale() {
  const router = useNextRouter();
  return useCallback(
    (next: Locale, href?: string) => {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE_SEC}; samesite=lax`;
      const { pathname, search, hash } = window.location;
      router.replace(withLocale(href ?? `${pathname}${search}${hash}`, next), { scroll: false });
    },
    [router],
  );
}
