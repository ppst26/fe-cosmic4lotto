import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "หวยออนไลน์เจ้าใหญ่ ให้เรทสูง จ่ายไว ได้ชัวร์ - XGB Official Sites",
  description:
    "No.1 ที่สุดแห่งความบันเทิง คาสิโนออนไลน์ตัวจริง! ฝาก-ถอนไว ไม่มีสะดุด โดย XGambet",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0d0d0f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`dark ${kanit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
