import { localizedRedirect } from "@/lib/i18n/server";

/** ข้อมูลบัญชีอยู่ที่ /profile/account — หน้า /profile redirect ไปหน้าแรกเหมือน glass */
export default async function ProfilePage() {
  await localizedRedirect("/");
}
