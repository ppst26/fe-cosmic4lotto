"use client";

import React, { useEffect, useState } from "react";
import { SoftLineTabs } from "@/app/components/ui/SoftLineTabs";
import dynamic from "next/dynamic";
import { ErrorState, LoadingState } from "@/app/components/ui/StatusState";
import { PromotionsMobileFeed } from "./PromotionsMobileFeed";
import { PromoHubDesktopMasterDetail } from "./PromoHubDesktopMasterDetail";
import { PromotionsCatalogProvider, usePromotionsCatalog } from "./PromotionsCatalogProvider";
import { useT } from "@/lib/i18n/I18nProvider";

const MyPromotionsPanel = dynamic(() => import("./MyPromotionsPanel").then((m) => m.MyPromotionsPanel), { ssr: false });

type PromoViewId = "all" | "mine";

/**
 * เนื้อหาหน้าโปรโมชั่น (/promotions) — ทุกขนาดจอใช้กริดการ์ด thumbnail (ภาพ · ชื่อใต้ภาพ · ปุ่มอ่านรายละเอียด)
 * กดโปรเปิดหน้ารายละเอียด /promotions/[id] · embedded (modal hub desktop) ใช้ master–detail
 */
export function PromotionsHubPageContent({ embedded = false }: { embedded?: boolean }) {
  return (
    <PromotionsCatalogProvider>
      <PromotionsHubPageContentInner embedded={embedded} />
    </PromotionsCatalogProvider>
  );
}

function PromotionsHubPageContentInner({ embedded }: { embedded: boolean }) {
  const t = useT("promotions");
  const { catalog, loading, error: loadError, reload } = usePromotionsCatalog();
  const [view, setView] = useState<PromoViewId>("all");
  /** ?tab=mine จากเมนูโปรไฟล์ — อ่านหลัง mount (เหมือน glass ไม่ใช้ useSearchParams) */
  useEffect(() => {
    // อ่าน URL หลัง mount (SSR ไม่มี window) จึงต้อง setState ใน effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (new URLSearchParams(window.location.search).get("tab") === "mine") setView("mine");
  }, []);

  const viewTabs = (
    <SoftLineTabs
      tabs={[
        { id: "all" as const, label: t("my.all") },
        { id: "mine" as const, label: t("my.tab") },
      ]}
      activeId={view}
      onSelect={setView}
      ariaLabel={t("my.tabsAria")}
      className="mb-3"
    />
  );

  if (view === "mine") {
    return (
      <>
        {viewTabs}
        <MyPromotionsPanel />
      </>
    );
  }

  return (
    <>
      {viewTabs}
      {loading ? <LoadingState label={t("loading")} /> : null}
      {!loading && loadError && !catalog ? (
        <div className="flex justify-center">
          <ErrorState
            title={t("loadError")}
            description={t("loadErrorDesc")}
            primaryAction={{ label: t("retry"), onClick: reload }}
          />
        </div>
      ) : null}

      {catalog && embedded ? (
        <div className="hidden pb-2 lg:block">
          <PromoHubDesktopMasterDetail />
        </div>
      ) : null}

      {catalog ? (
        <div className={embedded ? "lg:hidden" : undefined}>
          <PromotionsMobileFeed />
        </div>
      ) : null}
    </>
  );
}
