import { HomeScreenShortcutPromo } from "@/app/components/home/HomeScreenShortcutPromo";
import { LottoHomePage } from "@/components/lotto/LottoHomePage";

/** หน้าแรก — / (เปลือกอยู่ใน (tabs)/layout.tsx) */
export default function Home() {
  return (
    <>
      <LottoHomePage />
      <HomeScreenShortcutPromo className="lg:hidden" />
    </>
  );
}
