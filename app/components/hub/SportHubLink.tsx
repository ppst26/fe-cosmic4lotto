"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import type { LinkProps } from "next/link";
import { parseHubFromHref, type OpenHubOptions } from "./hubModalRegistry";
import { useDesktopHubModal } from "./DesktopHubModalProvider";
import { getIsDesktopViewport } from "./useIsDesktop";

/**
 * route ของ sport ที่ชื่อต่างจาก glass — ใช้แปลงเฉพาะตอนจับคู่กับ hub registry
 * (ลิงก์จริงยังไปที่ route ของ sport)
 */
const SPORT_TO_GLASS_HUB_PATH: Record<string, string> = {
  "/shop": "/gems-store",
  "/check-in": "/missions/check-in",
  "/activities": "/event",
};

function toGlassHubHref(href: string): string {
  const [path, rest] = href.split("?");
  const mapped = SPORT_TO_GLASS_HUB_PATH[path] ?? path;
  return rest ? `${mapped}?${rest}` : mapped;
}

type SportHubLinkProps = Omit<LinkProps, "href"> & {
  href: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
  openOptions?: OpenHubOptions;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

/** เหมือน HubNavLink ของ glass (มือถือไป route ปกติ · desktop เปิด modal) แต่รู้จักชื่อ route ของ sport */
export function SportHubLink({ href, className, children, title, openOptions, onClick, ...linkProps }: SportHubLinkProps) {
  const { openHub } = useDesktopHubModal();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (!getIsDesktopViewport()) return;
    const parsed = parseHubFromHref(toGlassHubHref(href));
    if (!parsed.id) return;
    event.preventDefault();
    openHub(parsed.id, openOptions ?? parsed.options);
  };

  return (
    <Link href={href} className={className} title={title} onClick={handleClick} {...linkProps}>
      {children}
    </Link>
  );
}
