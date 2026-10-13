"use client";

import Link from "@/lib/i18n/navigation";
import { NOTIFICATION_POPOVER_SOCIAL } from "@/app/data/notificationsMockData";
import { useT } from "@/lib/i18n/I18nProvider";

/** แถบล่างกล่องแจ้งเตือน desktop — ลิงก์ติดต่อ */
export function NotificationPopoverFooter() {
  const t = useT("common");
  return (
    <footer
      className="flex items-center justify-center gap-3 border-t border-white/10 pt-3"
      aria-label={t("notifications.contactChannels")}
    >
      {NOTIFICATION_POPOVER_SOCIAL.map((item) => (
        <Link
          key={item.icon}
          href={item.href}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[var(--BG-Surface-Darker)] text-[var(--text-muted)] no-underline hover:text-[var(--brand)]"
          aria-label={item.label}
        >
          <NotificationSocialIcon icon={item.icon} />
        </Link>
      ))}
    </footer>
  );
}

function NotificationSocialIcon({ icon }: { icon: "line" | "telegram" }) {
  const common = "h-[1.125rem] w-[1.125rem] shrink-0";
  if (icon === "telegram") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M21.9 4.6 2.8 11.2c-1.1.4-1.1 1.1-.2 1.4l4.9 1.5 1.9 5.8c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.7-2.6 5.6 4.1c1 .6 1.7.3 2-1l3.3-15.4c.4-1.5-.6-2.2-1.9-1.7zM8.5 13.8l9.7-6.1c.5-.3.9-.1.5.2l-7.9 7.2-.3 3.2c0 .4-.2.5-.4.3l-1.2-3.9-2.4-2.3c-.2-.2-.1-.4.1-.5z" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M20 11c0 5-5 8-10 10v-4C5 17 3 14 3 10s4-7 9-7 8 3 8 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M7 10h10M7 13h6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
