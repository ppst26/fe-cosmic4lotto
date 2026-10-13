"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { useUrlSearchParams } from "@/app/hooks/useUrlSearchParams";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { DesktopHubModal } from "./DesktopHubModal";
import type { DesktopHubId, OpenHubOptions } from "./hubModalRegistry";
import { HUB_REQUIRES_AUTH, isDesktopHubId } from "./hubModalRegistry";
import { vipPageHref } from "@/lib/vipRoutes";
import { getIsDesktopViewport } from "./useIsDesktop";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import {
  OVERLAY_HUB_KEY,
  OVERLAY_LAYER_KEY,
  OVERLAY_VIP_TAB_KEY,
  clearLayerParams,
  parseVipModalTab,
  readOverlayLayer,
} from "@/lib/overlayUrl";

interface HubModalState {
  id: DesktopHubId;
  options?: OpenHubOptions;
}

interface DesktopHubModalContextValue {
  openHub: (id: DesktopHubId, options?: OpenHubOptions) => void;
  closeHub: () => void;
  activeHub: DesktopHubId | null;
}

const DesktopHubModalContext = createContext<DesktopHubModalContextValue | null>(null);

/**
 * เปิด/ปิด hub modal บน desktop — sync ?layer=hub&hub=
 */
export function DesktopHubModalProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useUrlSearchParams();
  const [state, setState] = useState<HubModalState | null>(null);
  const { open: openLogin } = useOverlayLayer("login");

  /*
   * sync กับ URL (ระบบภายนอก) และสั่ง redirect / เปิด login ใน effect เดียวกัน — setState ที่นี่ตั้งใจ
   * แยกเป็น derived state ไม่ได้เพราะ openHub ใส่ options ที่ไม่อยู่ใน URL (เช่น cashbackTab)
   */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const layer = readOverlayLayer(searchParams);
    if (layer !== "hub") {
      setState(null);
      return;
    }
    const hubId = searchParams.get(OVERLAY_HUB_KEY);
    if (!isDesktopHubId(hubId)) {
      setState(null);
      return;
    }
    /** ข้อมูลบัญชี / VIP — modal เฉพาะ desktop · มือถือใช้หน้า stand-alone */
    if (typeof window !== "undefined" && !getIsDesktopViewport()) {
      if (hubId === "account") {
        setState(null);
        router.replace("/profile/account", { scroll: false });
        return;
      }
      if (hubId === "vip") {
        setState(null);
        const tab = parseVipModalTab(searchParams.get(OVERLAY_VIP_TAB_KEY)) ?? "my-level";
        router.replace(vipPageHref(tab), { scroll: false });
        return;
      }
    }
    if (!isLoading && HUB_REQUIRES_AUTH.has(hubId) && !isAuthenticated) {
      setState(null);
      const params = new URLSearchParams(searchParams.toString());
      clearLayerParams(params, "hub");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      openLogin();
      return;
    }
    const vipTab = hubId === "vip" ? parseVipModalTab(searchParams.get(OVERLAY_VIP_TAB_KEY)) : null;
    const options: OpenHubOptions | undefined =
      vipTab && vipTab !== "my-level" ? { vipTab } : undefined;
    setState((prev) => {
      if (prev?.id === hubId && prev.options?.vipTab === options?.vipTab) return prev;
      if (prev?.id === hubId && !options && !prev.options?.vipTab) return prev;
      return options ? { id: hubId, options } : prev?.id === hubId ? prev : { id: hubId };
    });
  }, [isAuthenticated, isLoading, openLogin, pathname, router, searchParams]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const closeHub = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    clearLayerParams(params, "hub");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setState(null);
  }, [pathname, router, searchParams]);

  const openHub = useCallback(
    (id: DesktopHubId, options?: OpenHubOptions) => {
      if (HUB_REQUIRES_AUTH.has(id) && !isLoading && !isAuthenticated) {
        openLogin();
        return;
      }
      if (typeof window !== "undefined" && !getIsDesktopViewport()) {
        if (id === "account") {
          router.push("/profile/account");
          return;
        }
        if (id === "vip") {
          router.push(vipPageHref(options?.vipTab ?? "my-level"));
          return;
        }
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set(OVERLAY_LAYER_KEY, "hub");
      params.set(OVERLAY_HUB_KEY, id);
      if (id === "vip" && options?.vipTab && options.vipTab !== "my-level") {
        params.set(OVERLAY_VIP_TAB_KEY, options.vipTab);
      } else {
        params.delete(OVERLAY_VIP_TAB_KEY);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setState({ id, options });
    },
    [isAuthenticated, isLoading, openLogin, pathname, router, searchParams],
  );

  const value = useMemo(
    () => ({
      openHub,
      closeHub,
      activeHub: state?.id ?? null,
    }),
    [openHub, closeHub, state?.id],
  );

  return (
    <DesktopHubModalContext.Provider value={value}>
      {children}
      <DesktopHubModal
        hubId={state?.id ?? null}
        options={state?.options}
        onClose={closeHub}
      />
    </DesktopHubModalContext.Provider>
  );
}

export function useDesktopHubModal(): DesktopHubModalContextValue {
  const ctx = useContext(DesktopHubModalContext);
  if (!ctx) {
    throw new Error("useDesktopHubModal ต้องใช้ภายใน DesktopHubModalProvider");
  }
  return ctx;
}
