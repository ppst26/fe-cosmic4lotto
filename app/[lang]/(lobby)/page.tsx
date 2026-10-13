import { HomeScreenShortcutPromo } from "@/app/components/home/HomeScreenShortcutPromo";
import { LottoHomePage } from "@/components/lotto/LottoHomePage";
import { getSessionUserId } from "@/lib/auth/session";

/** หน้าแรก — สถานะ login มาจาก session cookie จริง (ไม่ใช้ ?guest=1) */
export default async function Home() {
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
