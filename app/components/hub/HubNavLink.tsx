"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import type { LinkProps } from "next/link";
import { parseHubFromHref } from "./hubModalRegistry";
import { useDesktopHubModal } from "./DesktopHubModalProvider";
import { getIsDesktopViewport } from "./useIsDesktop";
import type { OpenHubOptions } from "./hubModalRegistry";

type HubNavLinkProps = Omit<LinkProps, "href"> & {
  href: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
  /** ตัวเลือกเปิด hub บน desktop (override parse จาก query) */
  openOptions?: OpenHubOptions;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

/**
 * ลิงก์ hub — มือถือไป route ปกติ · desktop (lg+) เปิด modal กลางจอ
 */
export function HubNavLink({
  href,
  className,
  children,
  title,
  openOptions,
  onClick,
  ...linkProps
}: HubNavLinkProps) {
  const { openHub } = useDesktopHubModal();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    if (!getIsDesktopViewport()) return;

    const parsed = parseHubFromHref(href);
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
