"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, Trophy } from "lucide-react";
import { useWheel } from "@/app/hooks/api/member";
import type { WheelPrizeKind } from "@/app/types/reward";
import { WHEEL_LIST_MAX_ROWS } from "@/lib/domain/wheelList";
import { WHEEL_PRIZE_ICON_SRC } from "@/lib/domain/wheelPrizeIcon";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

/** แท็บตามชนิดรางวัล — รางวัลมีแค่เพชร / เครดิต */
const WINNER_TABS: readonly WheelPrizeKind[] = ["gems", "credit"];

/**
 * ตารางผู้ได้รับรางวัล — แท็บแบบโฟลเดอร์ (เพชร / เครดิต) + แถวการ์ด เลขปิดบัง · รางวัล
 * ข้อมูลทั้งหมดมาจาก useWheel().liveWinners (GET /api/wheel) — ไม่มีรายการ hardcode ในคอมโพเนนต์
 * สไตล์อยู่ใน app/styles/lucky-wheel.css (.wheel-winners)
 */
export function LuckyWheelLiveWinners({ variant = "default" }: { variant?: "default" | "sidebar" }) {
  const t = useT("rewards");
  const [tab, setTab] = useState<WheelPrizeKind>("gems");
  /** ใช้ cache เดียวกับ LuckyWheelPageContent (SWR) — ยังไม่มีข้อมูลแสดงรายการว่าง */
  const winners = (useWheel().data?.liveWinners ?? [])
    .filter((w) => w.prizeKind === tab)
    .slice(0, WHEEL_LIST_MAX_ROWS);

  return (
    <section
      className={cn("wheel-winners", variant === "sidebar" && "wheel-winners--sidebar")}
      aria-labelledby="wheel-live-title"
    >
      <header className="wheel-winners__head">
        <span className="wheel-winners__head-icon" aria-hidden="true">
          <Award size={28} strokeWidth={1.75} />
        </span>
        <h2 id="wheel-live-title" className="wheel-winners__title">
          {t("wheel.liveWinners.heading")}
        </h2>
      </header>

      <div className="wheel-winners__tabs" role="tablist" aria-label={t("wheel.liveWinners.heading")}>
        {WINNER_TABS.map((kind) => (
          <button
            key={kind}
            type="button"
            role="tab"
            aria-selected={tab === kind}
            className="wheel-winners__tab"
            onClick={() => setTab(kind)}
          >
            {t(`wheel.prizeKind.${kind}`)}
          </button>
        ))}
      </div>

      <div className="wheel-winners__panel" role="tabpanel">
        <div className="wheel-winners__bar">
          <Trophy size={18} className="wheel-winners__bar-icon" aria-hidden="true" />
          <span>{tab === "gems" ? t("wheel.liveWinners.latestGems") : t("wheel.liveWinners.latestCredit")}</span>
        </div>

        <ul className="wheel-winners__list">
          {winners.map((w) => (
            <li key={w.id} className="wheel-winners__row">
              <div className="wheel-winners__who">
                <span className="wheel-winners__handle">{w.handle}</span>
                <span className="wheel-winners__phone">{w.maskedPhone}</span>
              </div>
              <div className="wheel-winners__prize">
                <span className="wheel-winners__prize-visual">
                  <Image
                    src={w.prizeImageSrc ?? WHEEL_PRIZE_ICON_SRC[w.prizeKind]}
                    alt=""
                    width={44}
                    height={44}
                    className="wheel-winners__prize-img"
                  />
                </span>
                <span className="wheel-winners__prize-name">
                  {w.amount} {t(`wheel.prizeKind.${w.prizeKind}`)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
