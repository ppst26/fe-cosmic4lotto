"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { fetchPromotionDetail, fetchPromotionsCatalog } from "@/lib/api/promotions";
import { useT } from "@/lib/i18n/I18nProvider";
import type {
  PromotionDetailContent,
  PromotionDetailId,
  PromotionsCatalogResponse,
} from "@/app/types/promotions";

interface PromotionsCatalogContextValue {
  catalog: PromotionsCatalogResponse | null;
  loading: boolean;
  error: string | null;
  /** โหลด catalog ใหม่หลังพลาด */
  reload: () => void;
  fetchDetail: (id: PromotionDetailId) => Promise<PromotionDetailContent | null>;
  getCachedDetail: (id: PromotionDetailId) => PromotionDetailContent | null;
}

const PromotionsCatalogContext = createContext<PromotionsCatalogContextValue | null>(null);

/**
 * โหลด catalog จาก /api/promotions — ใช้ห่อ PromotionsHubPageContent
 */
export function PromotionsCatalogProvider({ children }: { children: React.ReactNode }) {
  const t = useT("promotions");
  const loadErrorMessage = t("loadError");
  const { showToast } = useToast();
  const [catalog, setCatalog] = useState<PromotionsCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detailCacheRef = useRef<Partial<Record<PromotionDetailId, PromotionDetailContent>>>({});
  const loadErrorToastedRef = useRef(false);
  /** เพิ่มค่าเพื่อโหลด catalog ใหม่ (ปุ่มลองใหม่) */
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setError(null);
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchPromotionsCatalog().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setCatalog(res.data);
      } else {
        setError(loadErrorMessage);
        if (!loadErrorToastedRef.current) {
          loadErrorToastedRef.current = true;
          showToast(loadErrorMessage, "error");
        }
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [showToast, reloadKey, loadErrorMessage]);

  const getCachedDetail = useCallback((id: PromotionDetailId) => detailCacheRef.current[id] ?? null, []);

  const fetchDetail = useCallback(async (id: PromotionDetailId) => {
    const cached = detailCacheRef.current[id];
    if (cached) return cached;

    const detail = await fetchPromotionDetail(id);
    if (detail) detailCacheRef.current[id] = detail;
    return detail;
  }, []);

  const value = useMemo(
    () => ({ catalog, loading, error, reload, fetchDetail, getCachedDetail }),
    [catalog, loading, error, reload, fetchDetail, getCachedDetail],
  );

  return (
    <PromotionsCatalogContext.Provider value={value}>{children}</PromotionsCatalogContext.Provider>
  );
}

export function usePromotionsCatalog() {
  const ctx = useContext(PromotionsCatalogContext);
  if (!ctx) {
    throw new Error("usePromotionsCatalog ต้องใช้ภายใน PromotionsCatalogProvider");
  }
  return ctx;
}
