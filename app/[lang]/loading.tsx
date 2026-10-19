import { LottoShellFrame } from "@/components/layout/LottoShellChrome";
import { PageSkeleton } from "@/app/components/ui/PageSkeleton";

/**
 * สถานะรอระหว่างเปลี่ยนหน้า — ใส่เปลือก (header / sidebar / bottom nav) ไว้ด้วย
 * เปลือกจึงไม่หายแล้วกลับมาตอนสลับหน้า (ต้นเหตุหลักของอาการ UI กระพริบ) เหลือแค่เนื้อหากลางจอที่เป็น skeleton
 */
export default function Loading() {
  return (
    <LottoShellFrame>
      <PageSkeleton />
    </LottoShellFrame>
  );
}
