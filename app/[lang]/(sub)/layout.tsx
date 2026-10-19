import type { ReactNode } from "react";
import { SubShellLayout } from "@/components/layout/SubShellLayout";

export default function SubLayout({ children }: { children: ReactNode }) {
  return <SubShellLayout>{children}</SubShellLayout>;
}
