import Image from "next/image";
import Link from "@/lib/i18n/navigation";

type LobbyProviderCardProps = {
  href: string;
  title: string;
  coverSrc?: string;
  /** ป้ายเล็กบนการ์ด เช่น LIVE / EXCLUSIVE / HOT */
  badges?: string[];
  ariaLabel?: string;
  /** แสดงชื่อค่ายใต้รูป (คาสิโน) — สล็อตแสดงเฉพาะรูป */
  showTitle?: boolean;
  priority?: boolean;
};

/** การ์ดค่ายเกม (สล็อต/คาสิโน) — รูปจัตุรัสจาก public/slots · public/casino */
export function LobbyProviderCard({
  href,
  title,
  coverSrc,
  badges,
  ariaLabel,
  showTitle = false,
  priority = false,
}: LobbyProviderCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? title}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--soft-card-elevated)] no-underline transition hover:border-[var(--brand)]/60 active:scale-[0.98]"
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
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-[var(--brand)]">
            {title.charAt(0).toUpperCase()}
          </span>
        )}
        {badges && badges.length > 0 ? (
          <div className="absolute left-1.5 top-1.5 flex flex-wrap gap-1">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded bg-[var(--brand)] px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-[#2a0607]"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {showTitle ? (
        <p className="truncate px-2 py-2 text-center text-xs font-semibold text-[var(--text-on-light)]">{title}</p>
      ) : null}
    </Link>
  );
}
