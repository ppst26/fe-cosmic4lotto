"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { useUrlSearchParams } from "@/app/hooks/useUrlSearchParams";
import {
  OVERLAY_LAYER_KEY,
  clearLayerParams,
  readOverlayLayer,
  type OverlayLayer,
} from "@/lib/overlayUrl";

/**
 * เปิด/ปิด overlay แล้ว sync ?layer= กับ URL (รองรับปุ่มย้อนในเบราว์เซอร์)
 */
export function useOverlayLayer(layer: OverlayLayer) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useUrlSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  /** URL เปลี่ยน (รวมปุ่มย้อน) → sync isOpen ระหว่าง render แทน effect */
  const [syncedFrom, setSyncedFrom] = useState<{
    searchParams: typeof searchParams;
    layer: OverlayLayer;
  } | null>(null);
  if (syncedFrom?.searchParams !== searchParams || syncedFrom.layer !== layer) {
    setSyncedFrom({ searchParams, layer });
    setIsOpen(readOverlayLayer(searchParams) === layer);
  }

  const open = useCallback(
    (extra?: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(OVERLAY_LAYER_KEY, layer);
      if (extra) {
        for (const [key, value] of Object.entries(extra)) {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setIsOpen(true);
    },
    [layer, pathname, router, searchParams],
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    clearLayerParams(params, layer);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setIsOpen(false);
  }, [layer, pathname, router, searchParams]);

  return { isOpen, open, close, setIsOpen };
}
