import { PageSkeleton } from "@/app/components/ui/PageSkeleton";

/** สถานะรอระหว่างเปลี่ยนหน้า (Suspense ของทุก route) — skeleton โครงหน้าแทน spinner */
export default function Loading() {
  return <PageSkeleton />;
}
