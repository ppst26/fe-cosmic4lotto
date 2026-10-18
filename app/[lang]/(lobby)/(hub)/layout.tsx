import type { ReactNode } from "react";
import { HomeScreenShortcutPromo } from "@/app/components/home/HomeScreenShortcutPromo";
import { HomeOnly } from "@/components/lotto/HomeOnly";
import { LottoHomePage } from "@/components/lotto/LottoHomePage";
import { getSessionUserId } from "@/lib/auth/session";

/**
 * Layout ร่วมของหมวด lobby (/ · /casino · /slots · /fishing · /sport · /cards)
 * คงหน้าแรก (header · hero · เมนูหมวด · sidebar) ไว้ข้ามการสลับหมวด — แค่เนื้อหาด้านล่างเปลี่ยนตาม pathname (เหมือน glass)
 * สถานะ login มาจาก session cookie จริง
 */
export default async function LobbyHubLayout({ children }: { children: ReactNode }) {
  void children;
  const loggedIn = (await getSessionUserId()) !== null;
  return (
    <>
      <LottoHomePage loggedIn={loggedIn} />
      <HomeOnly>
        <div className="mx-auto w-full max-w-[1240px] px-4 pb-24 lg:hidden">
          <HomeScreenShortcutPromo className="mt-6 lg:hidden" />
        </div>
      </HomeOnly>
    </>
  );
}
