"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import Link from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import { PhoneMock, PhonePhoto, type PhoneScene } from "./PhoneMock";
import { usePwaInstall } from "./PwaInstallProvider";

type Platform = "android" | "ios";

interface StepDef {
  text: MessageKey<"home">;
  /** ภาพจริงในมือถือ (ถ้ามี) — ไม่มี = ใช้ฉากวาดด้วย SVG */
  photo?: string;
  scene: PhoneScene;
}

/** ขั้นตอนต่อแพลตฟอร์ม — ข้อความอยู่ใน home.json (a2hs.page.*) */
const STEPS: Record<Platform, StepDef[]> = {
  /* Android (Chrome): ปุ่มติดตั้ง → หน้าต่างติดตั้ง → กำลังติดตั้ง → ไอคอนบนหน้าจอโฮม — ภาพจริงใน public/pwa/android */
  android: [
    { text: "a2hs.page.android.s1", scene: "android-menu", photo: "/pwa/android/step-1.webp" },
    { text: "a2hs.page.android.s2", scene: "android-install", photo: "/pwa/android/step-2.webp" },
    { text: "a2hs.page.android.s3", scene: "home-icon", photo: "/pwa/android/step-3.webp" },
    { text: "a2hs.page.android.s4", scene: "app-open", photo: "/pwa/android/step-4.webp" },
  ],
  /* iOS (Safari รุ่นใหม่): … → แชร์ → ดูเพิ่มเติม → เพิ่มไปยังหน้าจอโฮม — ภาพจริงอยู่ใน public/pwa/ios */
  ios: [
    { text: "a2hs.page.ios.s1", scene: "ios-share", photo: "/pwa/ios/step-1.webp" },
    { text: "a2hs.page.ios.s2", scene: "ios-share", photo: "/pwa/ios/step-2.webp" },
    { text: "a2hs.page.ios.s3", scene: "ios-share", photo: "/pwa/ios/step-3.webp" },
    { text: "a2hs.page.ios.s4", scene: "ios-share", photo: "/pwa/ios/step-4.webp" },
    { text: "a2hs.page.ios.s5", scene: "ios-add", photo: "/pwa/ios/step-5.webp" },
  ],
};

const ACCENT = "var(--t-action,var(--brand,var(--action-solid,#7c3aed)))";

/**
 * หน้าดาวน์โหลดแอป (/download) — เต็มจอ (ครอบ chrome ของโปรเจค) · ปุ่มติดตั้ง + ขั้นตอนทีละภาพ
 * Android ที่เบราว์เซอร์พร้อม → ปุ่มเปิดหน้าต่างติดตั้งทันที · iPhone / อื่นๆ → เลื่อนไปที่ขั้นตอน
 * ใช้ในแบนเนอร์ PwaInstallBanner (ปุ่ม「เพิ่มปุ่มลัด」)
 */
export function DownloadAppPage() {
  const t = useT("home");
  const { canPrompt, promptInstall } = usePwaInstall();
  const [platform, setPlatform] = useState<Platform>("ios");
  const [standalone, setStandalone] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- ค่าอ่านได้เฉพาะฝั่ง browser หลัง mount */
  useEffect(() => {
    setPlatform(/android/i.test(window.navigator.userAgent) ? "android" : "ios");
    const nav = window.navigator as Navigator & { standalone?: boolean };
    setStandalone(window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const changePlatform = (next: Platform) => {
    setPlatform(next);
    trackRef.current?.scrollTo({ left: 0 });
  };

  const handleInstall = async () => {
    if (platform === "android" && canPrompt) {
      setInstalling(true);
      const outcome = await promptInstall();
      setInstalling(false);
      if (outcome === "accepted") {
        setJustInstalled(true);
        return;
      }
      if (outcome === "dismissed") return;
    }
    stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const installed = standalone || justInstalled;
  const steps = STEPS[platform];

  return (
    <main
      className="fixed inset-0 z-[90] overflow-y-auto overflow-x-hidden bg-[#07050f] text-white"
      style={
        {
          "--dl-accent": ACCENT,
          /* พื้นหลังกาแล็กซี่ (public/pwa/download-bg.webp) + ชั้นมืดบางๆ ให้ตัวอักษรอ่านง่าย — อยู่กับที่ขณะเลื่อน */
          background: "linear-gradient(rgb(7 5 15 / 0.3), rgb(7 5 15 / 0.5)), url(/pwa/download-bg.webp) center / cover no-repeat, #07050f",
        } as React.CSSProperties
      }
    >
      <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col gap-3 px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Link
          href="/"
          aria-label={t("a2hs.page.back")}
          className="absolute left-4 top-[max(0.75rem,env(safe-area-inset-top))] z-10 grid size-9 place-items-center rounded-full bg-white/10 text-white no-underline hover:bg-white/20"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>

        {/* หัวหน้า: โลโก้ (ไฟล์) อยู่บนกลุ่มข้อความ จัดกึ่งกลาง */}
        <header className="flex flex-col items-center gap-1 text-center">
          <Image src="/cosmic-dark.png" alt="cosmicbet" width={600} height={116} priority className="h-7 w-auto sm:h-9" />
          <h1 className="m-0 text-lg font-bold leading-tight sm:text-2xl">{t("a2hs.page.title")}</h1>
          <p className="m-0 text-xs text-white/80 sm:text-sm">{t("a2hs.page.subtitle")}</p>
        </header>

        {/* เลือกแพลตฟอร์ม */}
        <div
          role="tablist"
          aria-label={t("a2hs.platformsAriaLabel")}
          className="mx-auto grid w-full max-w-[14rem] grid-cols-2 gap-1 rounded-full bg-white/10 p-0.5"
        >
          {(["android", "ios"] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={platform === id}
              onClick={() => changePlatform(id)}
              className="cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-semibold text-white/70 aria-selected:text-white"
              style={platform === id ? { background: ACCENT } : { background: "transparent" }}
            >
              {id === "android" ? "Android" : "iOS"}
            </button>
          ))}
        </div>

        {platform === "ios" ? (
          <p className="m-0 text-center text-[11px] text-white/65">{t("a2hs.page.iosNote")}</p>
        ) : null}

        {/* ขั้นตอน — มือถือเลื่อนแนวนอน · จอใหญ่เรียงเป็นคอลัมน์ · ภาพมีสปอตไลต์ฝังในไฟล์ */}
        <div ref={stepsRef}>
          <div
            ref={trackRef}
            style={{ "--dl-cols": steps.length } as React.CSSProperties}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:[grid-template-columns:repeat(var(--dl-cols),minmax(0,1fr))] lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {steps.map((step, index) => (
              <section
                key={`${platform}-${step.text}`}
                className="flex w-[84%] shrink-0 snap-center flex-col items-center gap-2 rounded-3xl border border-white/10 bg-white/[0.06] px-3 pb-4 pt-4 sm:w-[48%] lg:w-auto"
              >
                {step.photo ? (
                  <PhonePhoto src={step.photo} variant={platform} className="w-56 max-w-full sm:w-60" />
                ) : (
                  <PhoneMock scene={step.scene} className="h-auto w-56 max-w-full sm:w-60" />
                )}
                <p className="m-0 mt-1 text-sm font-bold">{t("a2hs.page.stepLabel", { n: index + 1 })}</p>
                <p
                  className="m-0 text-center text-sm font-semibold leading-snug"
                  style={{ color: `color-mix(in srgb, ${ACCENT} 55%, #ffffff)` }}
                >
                  {t(step.text)}
                </p>
              </section>
            ))}
          </div>
        </div>

        {/* ปุ่มติดตั้งแอป — อยู่ด้านล่างใต้ขั้นตอน */}
        <div className="mt-2 flex justify-center">
          {installed ? (
            <span className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold">{t("a2hs.installed")}</span>
          ) : (
            <button
              type="button"
              onClick={() => void handleInstall()}
              disabled={installing}
              className="inline-flex min-w-48 cursor-pointer items-center justify-center gap-2 rounded-full border-0 px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              style={{ background: ACCENT }}
            >
              <Download size={18} aria-hidden="true" />
              {t("a2hs.page.install")}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
