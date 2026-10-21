"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import {
  FOOTER_COPYRIGHT,
  FOOTER_DESKTOP_COLUMNS,
  FOOTER_DESKTOP_SOCIAL,
  FOOTER_DISCLAIMER_KEY,
  FOOTER_PAYMENT_BANKS,
  FOOTER_TRUST_BADGES,
} from "@/app/data/footerMockData";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";
import type { FooterSocialIcon } from "@/app/types/footer";

/** คลาสปุ่ม/การ์ด glass ที่ styles/footer.css นิยามไว้ (แทน cosmicButtonClasses ของ glass) */
const COSMIC_BTN_GLASS_PILL = "glass-control glass-pill";
const COSMIC_SHEET_SOFT_GLASS = "cosmic-sheet-soft-glass";

/** โลโก้ตัวอักษร (แทน CosmicbetLogo ของ glass) */
function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-block text-xl font-semibold leading-none tracking-wide text-[var(--brand)]", className)}>
      CM-SaturnLotto
    </span>
  );
}

interface CosmicFooterProps {
  className?: string;
}

/**
 * ส่วนท้ายเว็บ — มือถือแบบเดิม · desktop อิง Dexsport (คอลัมน์ลิงก์ + trust + legal)
 */
export function CosmicFooter({ className = "" }: CosmicFooterProps) {
  const t = useT("nav");
  return (
    <footer className={`cosmic-footer ${className}`.trim()} aria-label={t("footer.label")}>
      <div className="cosmic-footer__container">
        <CosmicFooterMobile />
        <CosmicFooterDesktop />
      </div>
    </footer>
  );
}

/** Footer มือถือ — layout อิง Dexsport (CTA · social · trust · legal) */
function CosmicFooterMobile() {
  const t = useT("nav");
  return (
    <div className="cosmic-footer__dex-mobile lg:hidden">
      <Link href="/" className="cosmic-footer__logo-link" aria-label={t("footer.home")}>
        <BrandLogo className="sm:text-2xl" />
      </Link>

      <FooterCommunityChatCta className="cosmic-footer__cta-row w-full max-w-md" />

      <FooterPaymentMethodsBand variant="mobile" />

      <ul
        className="cosmic-footer__trust-grid cosmic-footer__trust-grid--three m-0 w-full max-w-md list-none p-0"
        aria-label={t("footer.certifications")}
      >
        {FOOTER_TRUST_BADGES.map((badge) => (
          <li key={badge.name} className={`cosmic-footer__trust-card ${COSMIC_SHEET_SOFT_GLASS}`}>
            <span className="cosmic-footer__trust-check" aria-hidden>✓</span>
            <span className="cosmic-footer__trust-copy">
              <span className="cosmic-footer__trust-label">{t(badge.labelKey)}</span>
              <strong className="cosmic-footer__trust-name">{badge.name}</strong>
            </span>
          </li>
        ))}
      </ul>

      <p className="cosmic-footer__disclaimer max-w-md text-center text-xs leading-relaxed text-[var(--text-secondary)]">
        {t(FOOTER_DISCLAIMER_KEY)}
      </p>

      <div className="cosmic-footer__compliance" aria-label={t("footer.playResponsibly")}>
        <span className="cosmic-footer__compliance-badge">{t("footer.playResponsibly")}</span>
        <span className="cosmic-footer__compliance-age" aria-label={t("footer.ageRestriction")}>
          18+
        </span>
        <span className="cosmic-footer__compliance-seal" aria-hidden />
      </div>

      <div className="cosmic-footer__bottom cosmic-footer__bottom--dex w-full max-w-md text-xs font-medium">
        <p>{FOOTER_COPYRIGHT}</p>
      </div>
    </div>
  );
}

/** ช่องทางการชำระเงิน — โลโก้ธนาคาร (footer mobile + desktop) */
function FooterPaymentMethodsBand({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const t = useT("nav");
  const isMobile = variant === "mobile";
  const titleId = isMobile ? "cosmic-footer-payment-title-mobile" : "cosmic-footer-payment-title";

  return (
    <section
      className={cn(
        "cosmic-footer__payment-band",
        isMobile && "cosmic-footer__payment-band--mobile",
      )}
      aria-labelledby={titleId}
    >
      <h3 id={titleId} className="cosmic-footer__payment-title">
        {t("footer.paymentMethods")}
      </h3>
      <ul className="cosmic-footer__payment-grid m-0 list-none p-0">
        {FOOTER_PAYMENT_BANKS.map((bank) => (
          <li key={bank.id}>
            <img
              src={bank.logoSrc}
              alt={bank.name}
              className="cosmic-footer__payment-icon"
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** ปุ่มชุมชน + แชทออนไลน์ — มือถือ Dexsport footer */
function FooterCommunityChatCta({ className }: { className?: string }) {
  const t = useT("nav");
  return (
    <div className={cn("grid grid-cols-2 gap-2.5", className)}>
      <Link
        href="/support"
        className={cn(
          COSMIC_BTN_GLASS_PILL,
          "cosmic-footer__cta-community inline-flex min-h-11 items-center justify-center rounded-full px-3 text-sm font-medium text-[var(--text-primary)]",
        )}
      >
        {t("footer.community")}
      </Link>
      <Link
        href="/support"
        className={cn(
          COSMIC_BTN_GLASS_PILL,
          "cosmic-footer__cta-chat inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-[var(--text-primary)]",
        )}
      >
        <span className="relative inline-flex">
          <HeadsetIcon className="text-[var(--icon-default)]" />
          <span className="cosmic-footer__chat-online" aria-hidden />
        </span>
        {t("footer.liveChat")}
      </Link>
    </div>
  );
}

/** Footer desktop — โลโก้ + social · 6 คอลัมน์ · trust · CTA · copyright */
function CosmicFooterDesktop() {
  const t = useT("nav");
  return (
    <div className="cosmic-footer__dex hidden lg:flex lg:flex-col lg:gap-8 lg:px-0 lg:py-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="cosmic-footer__brandmark text-2xl font-medium tracking-tight"
            aria-label={t("footer.home")}
          >
            CM-Saturn<span>Lotto</span>
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-2" aria-label={t("footer.social")}>
          {FOOTER_DESKTOP_SOCIAL.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full",
                "border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-elevated)_70%,transparent)]",
                "text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]",
              )}
              aria-label={item.label}
            >
              <FooterSocialGlyph icon={item.icon} />
            </Link>
          ))}
        </nav>
      </div>

      <nav
        className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 xl:grid-cols-6"
        aria-label={t("footer.links")}
      >
        {FOOTER_DESKTOP_COLUMNS.map((column) => (
          <div key={column.titleKey} className="min-w-0">
            <h3 className="mb-3 text-base font-medium text-[var(--text-primary)]">{t(column.titleKey)}</h3>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {column.links.map((link) => (
                <li key={`${column.titleKey}-${link.labelKey}`}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-9 items-center py-0.5 text-sm leading-snug text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <FooterPaymentMethodsBand />

      <div className="cosmic-footer__bottom !mt-0 border-t border-[var(--border-subtle)] pt-5 !text-sm !text-[var(--text-secondary)]">
        <p>{FOOTER_COPYRIGHT}</p>
      </div>
    </div>
  );
}

function FooterSocialGlyph({ icon }: { icon: FooterSocialIcon["icon"] }) {
  const common = "size-4 shrink-0";
  switch (icon) {
    case "telegram":
      return <TelegramIcon className={common} />;
    case "line":
      return <LineIcon className={common} />;
    case "x":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.7l-5.2-6.8L5.4 22H2.3l7.3-8.4L.8 2h6.9l4.7 6.2L18.9 2zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20z" />
        </svg>
      );
    case "discord":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M20.3 4.4A17.2 17.2 0 0 0 15.5 3c-.2.4-.5 1-.7 1.4a15.8 15.8 0 0 0-4.8 0C9.8 4 9.5 3.4 9.3 3a17.5 17.5 0 0 0-4.8 1.4C2.2 8.2 1.6 12 1.9 15.7a17.4 17.4 0 0 0 5.3 2.7c.4-.6.8-1.1 1.1-1.8-.6-.2-1.2-.5-1.7-.9.1-.1.3-.2.4-.3 3.2 1.5 6.7 1.5 9.8 0l.4.3c-.5.3-1.1.6-1.7.9.3.7.7 1.2 1.1 1.8a17.3 17.3 0 0 0 5.3-2.7c.4-4.3-.2-8.1-2.6-11.3zM8.7 13.6c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9zm6.6 0c-.9 0-1.7-.9-1.7-1.9s.7-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M23 12.3c0-.8-.1-1.6-.3-2.3-.2-.9-.9-1.6-1.8-1.8C19.2 7.8 12 7.8 12 7.8s-7.2 0-8.9.4c-.9.2-1.6.9-1.8 1.8-.2.7-.3 1.5-.3 2.3s.1 1.6.3 2.3c.2.9.9 1.6 1.8 1.8 1.7.4 8.9.4 8.9.4s7.2 0 8.9-.4c.9-.2 1.6-.9 1.8-1.8.2-.7.3-1.5.3-2.3zM9.8 15.5v-7l6.2 3.5-6.2 3.5z"
          />
        </svg>
      );
    case "medium":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4 5.5h4.2V18.5H4V5.5zm6.65 0H15v1.1h-.03c.5-.9 1.7-1.85 3.5-1.85 2.8 0 4.5 1.85 4.5 5.35V18.5h-4.2v-8.1c0-2.4-.85-3.55-2.6-3.55-1.8 0-2.9 1.3-2.9 3.55V18.5h-4.2V5.5z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.5 8.7H2.9V21h3.6V8.7zM4.7 2.9a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2zM9.2 8.7H12.6v1.8h.05c.5-.9 1.6-1.9 3.3-1.9 3.5 0 4.2 2.3 4.2 5.3V21h-3.7v-7.4c0-1.8-.03-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4v7.5H9.2V8.7z" />
        </svg>
      );
    case "reddit":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M14.5 11.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm-5 1.2a1.2 1.2 0 1 1 2.4 0 1.2 1.2 0 0 1-2.4 0zm10.2 4.9c.8 1.2-.2 2.7-1.9 2.7-1.1 0-2-.6-2.5-1.4a9.5 9.5 0 0 1-5.3 0c-.5.8-1.4 1.4-2.5 1.4-1.7 0-2.7-1.5-1.9-2.7.1-.2.3-.4.5-.5a6.2 6.2 0 0 1-2.4-5.1c0-3.4 2.8-6.2 6.2-6.2 1.4 0 2.7.5 3.7 1.3l2.3-2.2 1.7 1.7-2 1.9a6.2 6.2 0 0 1 2.2 4.7 6.2 6.2 0 0 1-2.4 5.1c.2.1.4.3.5.5zM8.6 17.1c.3.5.8.8 1.4.8.6 0 1.1-.3 1.4-.8a7.8 7.8 0 0 1-2.8 0zm6.4 0c.3.5.8.8 1.4.8.6 0 1.1-.3 1.4-.8a7.8 7.8 0 0 1-2.8 0z"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M16.5 5.2c.9 1.1 2.2 1.8 3.7 2v3.2a7.2 7.2 0 0 1-3.7-1v6.4a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.4a2.1 2.1 0 1 0 1.5 2v-9.2h3.1z"
          />
        </svg>
      );
    default:
      return null;
  }
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? ""} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20 11c0 5-5 8-10 10v-4C5 17 3 14 3 10s4-7 9-7 8 3 8 8Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10h10M7 13h6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? ""} aria-hidden="true" viewBox="0 0 24 24">
      <path d="m3 10 18-7-4 18-6-6-4 2 1-5 9-6-6 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" strokeLinecap="round" />
      <rect x="2" y="14" width="4" height="6" rx="1" />
      <rect x="18" y="14" width="4" height="6" rx="1" />
    </svg>
  );
}
