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
      <div className="mx-auto w-full max-w-[1240px] px-4 pb-24 lg:hidden">
        <HomeScreenShortcutPromo className="mt-6 lg:hidden" />
      </div>
    </>
  );
}
