"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { HeaderBar } from "@/components/layout/HeaderBar";
import { MockGameViewport } from "@/app/components/game/MockGameViewport";

function GamePlayMock() {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawId = (params?.gameId as string) || "unknown";
  let gameId = rawId;
  try {
    gameId = decodeURIComponent(rawId);
  } catch {
    /* id ไม่ใช่ URI ที่ถูกต้อง — ใช้ค่าดิบ */
  }
  const title = searchParams.get("title")?.trim() || gameId;
  const provider = searchParams.get("provider")?.trim() || undefined;

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[var(--body)]">
      <HeaderBar />
      <main className="min-h-0 flex-1">
        <MockGameViewport gameId={gameId} title={title} provider={provider} />
      </main>
    </div>
  );
}

/** หน้า mock เล่นเกม — Header หลักอย่างเดียว · พื้นที่เกมเต็มจอ */
export default function GamePlayMockPage() {
  return (
    <Suspense fallback={null}>
      <GamePlayMock />
    </Suspense>
  );
}
