import type { ValueRole } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";

/**
 * สีตัวเลขตามบทบาท (ValueRole จาก lib/semanticValue) — ใช้ token ของ sport (Dark Lavender / Plum)
 * แทน class `cosmic-value--*` ของ glass ที่ sport ไม่มี
 */
const TONE_CLASS: Record<ValueRole, string> = {
  emphasis: "text-[var(--text-on-light)] font-semibold",
  neutral: "text-[var(--text-on-light)]",
  muted: "text-[var(--text-muted)]",
  success: "text-emerald-400",
  danger: "text-red-400",
  warning: "text-amber-400",
  reward: "text-[var(--brand-strong)] font-semibold",
  accent: "text-[var(--brand)] font-semibold",
};

export function toneClass(role: ValueRole, extra?: string): string {
  return cn("tabular-nums", TONE_CLASS[role], extra);
}
