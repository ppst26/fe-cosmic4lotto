import { LoadingState } from "@/app/components/ui/StatusState";

/** สถานะรอระหว่างเปลี่ยนหน้า (Suspense ของทุก route) — แสดงทันทีขณะโหลด segment ถัดไป */
export default function Loading() {
  return (
    <main className="flex min-h-[60dvh] w-full items-center justify-center px-4">
      <LoadingState label="กำลังโหลด..." />
    </main>
  );
}
