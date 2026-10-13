"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * true หลัง hydrate บน client · false ตอน SSR และ render แรกของ hydration
 * แทน pattern useState(false) + useEffect(() => setMounted(true))
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
