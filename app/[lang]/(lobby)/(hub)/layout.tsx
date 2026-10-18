import type { ReactNode } from "react";
import { HomeScreenShortcutPromo } from "@/app/components/home/HomeScreenShortcutPromo";
import { LottoHomePage } from "@/components/lotto/LottoHomePage";
import { getSessionUserId } from "@/lib/auth/session";

/**
 * Layout หน้าแรก (/) — หมวดเกม (/casino · /slots · /fishing · /sport · /cards) เป็นหน้า standalone ของตัวเอง
 * สถานะ login มาจาก session cookie จริง
 */
export default async function LobbyHubLayout({ children }: { children: ReactNode }) {
  void children;
  const loggedIn = (await getSessionUserId()) !== null;
  return (
    <>
      <LottoHomePage loggedIn={loggedIn} />
      {/* .lotto-page เว้นล่าง 100px สำหรับ bottom nav — ดึงส่วนนี้ขึ้นมาชดเชย แล้วเว้นล่างเองเท่ากัน */}
      <div
        className="mx-auto w-full max-w-[1240px] px-3 lg:hidden"
        style={{
          marginTop: "calc(12px - 100px - env(safe-area-inset-bottom, 0px))",
          paddingBottom: "calc(100px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <HomeScreenShortcutPromo className="lg:hidden" />
      </div>
    </>
  );
}
