"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { usePwaInstall } from "@/app/components/pwa/PwaInstallProvider";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

type InstallPlatform = "android" | "ios";

const INSTALL_STEP_LAUNCH: MessageKey<"home"> = "a2hs.steps.launch";

const INSTALL_STEPS: Record<InstallPlatform, MessageKey<"home">[]> = {
  android: ["a2hs.steps.android1", "a2hs.steps.android2", "a2hs.steps.android3", INSTALL_STEP_LAUNCH],
  ios: ["a2hs.steps.ios1", "a2hs.steps.ios2", "a2hs.steps.ios3", INSTALL_STEP_LAUNCH],
};

/** โลโก้ตัวอักษร CM-SaturnLotto (ไม่พึ่งไฟล์รูป) */
function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-block text-lg font-black leading-none tracking-wide text-[var(--brand)]", className)}>
      CM-SaturnLotto
    </span>
  );
}

function AndroidIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.6 11.48l1.84-3.18c.16-.31.04-.69-.26-.85a.61.61 0 0 0-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 7.67a.61.61 0 0 0-.84-.22c-.3.16-.42.54-.26.85l1.84 3.18C3.16 13.27 1 16.73 1 21h22c0-4.27-2.16-7.73-5.4-9.52zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.42 2.19-1.19 3.01-.84.9-2.04 1.42-3.22 1.34-.14-1.09.45-2.23 1.22-3.01.84-.92 2.28-1.48 3.19-1.34zM20.88 17.17c-.57 1.3-.85 1.88-1.58 3.03-1.02 1.58-2.46 3.55-4.25 3.56-1.59.01-2.01-1.03-4.19-1.02-2.18.01-2.64 1.03-4.23 1.02-1.79-.01-3.14-1.62-4.16-3.2-2.86-4.38-3.16-9.51-1.4-12.23 1.24-1.9 3.2-3.01 5.14-3.01 1.91 0 3.11 1.03 4.69 1.03 1.51 0 2.43-1.03 4.61-1.03 1.65 0 3.4.9 4.64 2.45-4.08 2.22-3.42 7.98.68 9.4z" />
    </svg>
  );
}

/** ตรวจว่าเปิดจาก PWA / หน้าโฮมแล้วหรือยัง */
function useIsInstalledPwa() {
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standaloneMedia = window.matchMedia("(display-mode: standalone)");
    const iosStandalone =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const sync = () => {
      setInstalled(standaloneMedia.matches || iosStandalone);
    };

    sync();
    standaloneMedia.addEventListener("change", sync);
    return () => standaloneMedia.removeEventListener("change", sync);
  }, []);

  return installed;
}

/**
 * การ์ดชวนเพิ่มปุ่มลัดหน้าโฮม — มือถือเท่านั้น (lg:hidden)
 * ตรรกะเดียวกับ HomeScreenShortcutPromo ของ glass (usePwaInstall + ขั้นตอนติดตั้ง) · หน้าตาเป็นของ sport
 */
export function HomeScreenShortcutPromo({ className }: { className?: string }) {
  const t = useT("home");
  const isInstalled = useIsInstalledPwa();
  const { canPrompt, promptInstall } = usePwaInstall();
  const { showToast } = useToast();
  const [platform, setPlatform] = useState<InstallPlatform>("ios");
  const [stepsOpen, setStepsOpen] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // ตรวจแพลตฟอร์มได้เฉพาะฝั่ง client หลัง hydrate (กัน SSR ไม่ตรงกัน)
    const android = /android/i.test(window.navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(android ? "android" : "ios");
  }, []);

  if (isInstalled) return null;

  const openManualSteps = (next: InstallPlatform) => {
    setPlatform(next);
    setStepsOpen(true);
  };

  const handleAndroidClick = async () => {
    setPlatform("android");
    if (!canPrompt) {
      openManualSteps("android");
      return;
    }
    setInstalling(true);
    const outcome = await promptInstall();
    setInstalling(false);
    if (outcome === "accepted") {
      showToast(t("a2hs.installed"), "success");
      return;
    }
    if (outcome === "unavailable") openManualSteps("android");
  };

  const handleIosClick = () => {
    openManualSteps("ios");
  };

  const steps = INSTALL_STEPS[platform];
  const stepsPanelId = "home-a2hs-steps-panel";

  return (
    <section
      className={cn("mt-4 px-3 pb-6 md:px-6 lg:hidden", className)}
      aria-labelledby="home-shortcut-title"
    >
      <h2 id="home-shortcut-title" className="mb-2 text-sm font-bold text-[var(--text-on-light)]">
        {t("a2hs.title")}
      </h2>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#2e2e32] via-[#232327] to-[#1a1a1d] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] sm:p-5">
        <div className="flex items-stretch gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <BrandLogo />

            <p className="mt-3 text-base font-extrabold text-white sm:text-lg">{t("a2hs.cardTitle")}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/65 sm:text-sm">
              {t("a2hs.cardSubtitle")}
            </p>

            <div
              className="mt-4 flex flex-wrap gap-2"
              role="group"
              aria-label={t("a2hs.platformsAriaLabel")}
            >
              <button
                type="button"
                aria-pressed={platform === "android"}
                disabled={installing}
                onClick={() => void handleAndroidClick()}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-xl border-solid px-3 py-2 text-xs font-semibold disabled:opacity-60",
                  platform === "android"
                    ? "border-2 border-[var(--brand)] bg-black/50 text-white shadow-[0_0_12px_rgba(255,209,92,0.3)] hover:bg-black/65"
                    : "border border-white/15 bg-black/40 text-white/75 hover:bg-black/55",
                )}
              >
                <AndroidIcon />
                Android
              </button>
              <button
                type="button"
                aria-pressed={platform === "ios"}
                onClick={handleIosClick}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-xl border-solid px-3 py-2 text-xs font-semibold",
                  platform === "ios"
                    ? "border-2 border-[var(--brand)] bg-black/50 text-white shadow-[0_0_12px_rgba(255,209,92,0.3)] hover:bg-black/65"
                    : "border border-white/15 bg-black/40 text-white/75 hover:bg-black/55",
                )}
              >
                <AppleIcon />
                iOS
              </button>
            </div>
          </div>

          <div className="relative hidden w-[108px] shrink-0 sm:block sm:w-[120px]">
            <div
              className="absolute inset-y-2 right-0 aspect-square w-full rounded-full border-[3px] border-[var(--brand)] bg-gradient-to-br from-[#3a3118] via-[#1a1a1d] to-[#0d0d0f] shadow-[0_0_24px_rgba(255,209,92,0.4)]"
              aria-hidden
            >
              <div className="flex h-full items-center justify-center px-2">
                <BrandLogo className="text-base" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl bg-black/30">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between gap-2 border-0 bg-transparent px-3 py-2.5 text-left text-xs font-bold text-white"
            aria-expanded={stepsOpen}
            aria-controls={stepsPanelId}
            onClick={() => setStepsOpen((open) => !open)}
          >
            <span>{t("a2hs.stepsTitle", { platform: platform === "ios" ? "iOS" : "Android" })}</span>
            <ChevronDown
              className={cn("h-4 w-4 shrink-0 transition-transform duration-200", stepsOpen && "rotate-180")}
              aria-hidden
            />
          </button>
          <div id={stepsPanelId} hidden={!stepsOpen} className="px-3 pb-3">
            <ol className="m-0 flex list-none flex-col gap-2 p-0" aria-live="polite">
              {steps.map((step, index) => (
                <li key={`${platform}-${index}`} className="flex items-start gap-2.5 text-xs text-white/80">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-[11px] font-black text-[#2a0607]"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{t(step)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
