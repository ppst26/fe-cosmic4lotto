import Image from "next/image";
import Link from "@/lib/i18n/navigation";

type LobbyProviderCardProps = {
  href: string;
  title: string;
  coverSrc?: string;
  /** ป้ายเล็กบนการ์ด เช่น LIVE / EXCLUSIVE / HOT */
  badges?: string[];
  ariaLabel?: string;
  /** ไม่แสดงชื่อใต้รูปแล้ว (คงไว้เพื่อให้ผู้เรียกเดิมไม่พัง) */
  showTitle?: boolean;
  priority?: boolean;
};

/** การ์ดค่ายเกม (สล็อต/คาสิโน) — รูปจัตุรัสจาก public/slots · public/casino */
export function LobbyProviderCard({
  href,
  title,
  coverSrc,
  ariaLabel,
  priority = false,
}: LobbyProviderCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? title}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-md border border-white/10 bg-[var(--soft-card-elevated)] no-underline transition hover:border-[var(--brand)]/60 active:scale-[0.98]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--soft-surface)]">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 14vw, (min-width: 640px) 22vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
            priority={priority}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-[var(--brand)]">
            {title.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </Link>
  );
}
