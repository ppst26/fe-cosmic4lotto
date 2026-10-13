import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { StatusState } from "@/app/components/ui/StatusState";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "ไม่พบหน้านี้ · Page not found — XGAMBET",
};

/**
 * 404 ของ URL ที่ไม่ตรง route ใดเลย (เช่น /xx/yy) — root layout อยู่ใต้ [lang] จึงต้องมีไฟล์นี้
 * ไม่ผ่าน layout ของแอป: ต้องมี <html> ฟอนต์ และ CSS เอง · ไม่รู้ภาษา จึงแสดงไทย + อังกฤษ
 */
export default function GlobalNotFound() {
  return (
    <html lang="th" className={`dark ${kanit.variable}`}>
      <body className="flex min-h-dvh items-center justify-center px-4">
        <StatusState
          icon={<span className="text-lg font-medium tabular-nums">404</span>}
          title="ไม่พบหน้าที่คุณต้องการ · Page not found"
          description="ลิงก์อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายไปแล้ว"
          primaryAction={{ label: "กลับหน้าแรก · Home", href: "/" }}
        />
      </body>
    </html>
  );
}
