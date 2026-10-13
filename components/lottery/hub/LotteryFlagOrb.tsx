import type { LotteryFlagTone } from "@/app/types/lottery";

const FLAG_SIZE_CLASS: Record<"sm" | "md" | "lg", string> = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
};

export function LotteryFlagOrb({
  label,
  tone,
  size = "md",
  className,
}: {
  label: string;
  tone: LotteryFlagTone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={`lottery-flag lottery-flag--${size} lottery-flag--${tone} relative inline-flex shrink-0 ${FLAG_SIZE_CLASS[size]}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <span className="lottery-flag__sphere grid h-full w-full place-items-center rounded-full">
        {label.slice(0, 2)}
      </span>
      <span className="lottery-flag__coin absolute right-[-0.1rem] bottom-[0.05rem] h-[38%] w-[38%] rounded-full" />
    </span>
  );
}

function ClockMiniIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 4.5V8l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LotteryCountdown({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`lottery-countdown${className ? ` ${className}` : ""}`}>
      <ClockMiniIcon />
      <span className="tabular-nums">{label}</span>
    </span>
  );
}
