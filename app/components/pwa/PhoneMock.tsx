import React from "react";

/** ฉากในมือถือจำลองของหน้า /download — วาดด้วย SVG ล้วน (ไม่ใช้ภาพหน้าจอจริง) */
export type PhoneScene =
  | "android-menu"
  | "android-install"
  | "ios-share"
  | "ios-sheet"
  | "ios-add"
  | "home-icon"
  | "app-open";

const ACCENT = { fill: "var(--dl-accent)" } as const;
const ACCENT_SOFT = { fill: "var(--dl-accent)", fillOpacity: 0.28 } as const;
const RING = { fill: "none", stroke: "var(--dl-accent)", strokeWidth: 2.5 } as const;

function StatusBar() {
  return (
    <g fill="#ffffff" fillOpacity="0.55">
      <rect x="18" y="12" width="16" height="4" rx="2" />
      <rect x="116" y="12" width="6" height="4" rx="1.5" />
      <rect x="125" y="12" width="9" height="4" rx="1.5" />
    </g>
  );
}

/** หน้าเว็บจำลอง (โครงกล่อง) */
function PageSkeleton({ top = 52 }: { top?: number }) {
  return (
    <g>
      <rect x="14" y={top} width="132" height="34" rx="8" fill="#ffffff" fillOpacity="0.1" />
      <rect x="14" y={top + 42} width="62" height="48" rx="8" fill="#ffffff" fillOpacity="0.08" />
      <rect x="84" y={top + 42} width="62" height="48" rx="8" fill="#ffffff" fillOpacity="0.08" />
      <rect x="14" y={top + 98} width="62" height="48" rx="8" fill="#ffffff" fillOpacity="0.08" />
      <rect x="84" y={top + 98} width="62" height="48" rx="8" fill="#ffffff" fillOpacity="0.08" />
      <rect x="14" y={top + 154} width="132" height="20" rx="6" fill="#ffffff" fillOpacity="0.06" />
    </g>
  );
}

function AppTile({ x, y, size = 30 }: { x: number; y: number; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={size * 0.24} style={ACCENT} />
      <rect x={x + size * 0.22} y={y + size * 0.4} width={size * 0.56} height={size * 0.2} rx={size * 0.1} fill="#ffffff" fillOpacity="0.9" />
    </g>
  );
}

function Scene({ scene }: { scene: PhoneScene }) {
  switch (scene) {
    case "android-menu":
      return (
        <g>
          <rect x="8" y="26" width="144" height="26" fill="#ffffff" fillOpacity="0.07" />
          <rect x="16" y="32" width="94" height="14" rx="7" fill="#ffffff" fillOpacity="0.12" />
          {[122, 130, 138].map((cx) => (
            <circle key={cx} cx={cx} cy="39" r="1.8" fill="#ffffff" fillOpacity="0.8" />
          ))}
          <circle cx="130" cy="39" r="10" {...RING} />
          <PageSkeleton top={62} />
          <rect x="62" y="48" width="86" height="76" rx="8" fill="#24213a" stroke="#ffffff" strokeOpacity="0.12" />
          <rect x="68" y="56" width="74" height="9" rx="4.5" fill="#ffffff" fillOpacity="0.14" />
          <rect x="68" y="71" width="74" height="9" rx="4.5" fill="#ffffff" fillOpacity="0.14" />
          <rect x="66" y="86" width="78" height="14" rx="6" style={ACCENT_SOFT} />
          <path d="M72 91v6m0 0 -3-3m3 3 3-3" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="82" y="91" width="50" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.85" />
          <rect x="68" y="106" width="74" height="9" rx="4.5" fill="#ffffff" fillOpacity="0.14" />
        </g>
      );
    case "android-install":
      return (
        <g>
          <rect x="8" y="26" width="144" height="26" fill="#ffffff" fillOpacity="0.07" />
          <PageSkeleton top={62} />
          <rect x="8" y="26" width="144" height="288" fill="#000000" fillOpacity="0.55" />
          <rect x="20" y="118" width="120" height="82" rx="12" fill="#f4f4f8" />
          <AppTile x={30} y={128} size={22} />
          <rect x="58" y="132" width="64" height="6" rx="3" fill="#1b1b22" fillOpacity="0.8" />
          <rect x="58" y="144" width="52" height="5" rx="2.5" fill="#1b1b22" fillOpacity="0.35" />
          <rect x="30" y="160" width="100" height="5" rx="2.5" fill="#1b1b22" fillOpacity="0.25" />
          <rect x="62" y="176" width="34" height="16" rx="8" fill="#1b1b22" fillOpacity="0.08" />
          <rect x="100" y="176" width="34" height="16" rx="8" style={ACCENT} />
          <circle cx="117" cy="184" r="16" {...RING} />
        </g>
      );
    case "ios-share":
      return (
        <g>
          <PageSkeleton top={34} />
          <rect x="8" y="270" width="144" height="44" fill="#ffffff" fillOpacity="0.08" />
          <rect x="22" y="278" width="116" height="16" rx="8" fill="#ffffff" fillOpacity="0.12" />
          <g stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 303l-5-4 5-4" />
            <path d="M52 303l5-4-5-4" />
            <path d="M80 304v-9m0 0-3.5 3.5M80 295l3.5 3.5M75 298h-2.5v8h15v-8H85" />
            <rect x="106" y="296" width="10" height="9" rx="2" />
            <rect x="130" y="296" width="10" height="9" rx="2" />
          </g>
          <circle cx="80" cy="299" r="15" {...RING} />
        </g>
      );
    case "ios-sheet":
      return (
        <g>
          <PageSkeleton top={34} />
          <rect x="8" y="26" width="144" height="288" fill="#000000" fillOpacity="0.5" />
          <rect x="8" y="132" width="144" height="182" rx="16" fill="#26233a" />
          <rect x="66" y="138" width="28" height="4" rx="2" fill="#ffffff" fillOpacity="0.3" />
          <rect x="18" y="152" width="124" height="22" rx="8" fill="#ffffff" fillOpacity="0.1" />
          <rect x="18" y="180" width="124" height="22" rx="8" style={ACCENT_SOFT} />
          <rect x="24" y="186" width="10" height="10" rx="2.5" fill="none" stroke="#ffffff" strokeWidth="1.6" />
          <path d="M29 188.5v5m-2.5-2.5h5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="42" y="188" width="70" height="6" rx="3" fill="#ffffff" fillOpacity="0.9" />
          <rect x="18" y="208" width="124" height="22" rx="8" fill="#ffffff" fillOpacity="0.1" />
          <rect x="18" y="236" width="124" height="22" rx="8" fill="#ffffff" fillOpacity="0.1" />
          <rect x="14" y="177" width="132" height="28" rx="10" {...RING} />
        </g>
      );
    case "ios-add":
      return (
        <g>
          <PageSkeleton top={34} />
          <rect x="8" y="26" width="144" height="288" fill="#000000" fillOpacity="0.5" />
          <rect x="8" y="64" width="144" height="190" rx="16" fill="#26233a" />
          <rect x="18" y="74" width="34" height="8" rx="4" fill="#ffffff" fillOpacity="0.45" />
          <rect x="102" y="70" width="38" height="16" rx="8" style={ACCENT} />
          <circle cx="121" cy="78" r="15" {...RING} />
          <AppTile x={22} y={104} size={36} />
          <rect x="68" y="110" width="68" height="7" rx="3.5" fill="#ffffff" fillOpacity="0.9" />
          <rect x="68" y="124" width="52" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.4" />
          <rect x="18" y="156" width="124" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.2" />
          <rect x="18" y="168" width="100" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.2" />
        </g>
      );
    case "home-icon":
      return (
        <g>
          <rect x="6" y="6" width="148" height="308" rx="17" fill="#2b2547" />
          {[0, 1, 2, 3].map((c) => (
            <circle key={`a${c}`} cx={30 + c * 34} cy="86" r="12" fill="#ffffff" fillOpacity="0.14" />
          ))}
          {[0, 1, 2].map((c) => (
            <circle key={`b${c}`} cx={30 + c * 34} cy="132" r="12" fill="#ffffff" fillOpacity="0.14" />
          ))}
          <AppTile x={116 - 15} y={132 - 15} size={30} />
          <rect x="100" y="117" width="32" height="32" rx="9" {...RING} />
          <rect x="22" y="272" width="116" height="26" rx="13" fill="#ffffff" fillOpacity="0.12" />
        </g>
      );
    case "app-open":
      return (
        <g>
          <rect x="8" y="26" width="144" height="22" fill="#ffffff" fillOpacity="0.07" />
          <AppTile x={14} y={30} size={14} />
          <rect x="34" y="35" width="40" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.6" />
          <rect x="14" y="56" width="132" height="62" rx="10" style={ACCENT_SOFT} />
          <rect x="22" y="68" width="70" height="8" rx="4" fill="#ffffff" fillOpacity="0.9" />
          <rect x="22" y="82" width="52" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.5" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={14 + i * 45} y="128" width="42" height="56" rx="8" fill="#ffffff" fillOpacity="0.1" />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={`r${i}`} x={14 + i * 45} y="192" width="42" height="56" rx="8" fill="#ffffff" fillOpacity="0.07" />
          ))}
          <rect x="8" y="276" width="144" height="38" fill="#ffffff" fillOpacity="0.07" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={`n${i}`} cx={30 + i * 33} cy="295" r="5" fill="#ffffff" fillOpacity={i === 0 ? 0.8 : 0.3} />
          ))}
        </g>
      );
  }
}

/** กรอบมือถือ + ฉาก — สีเน้นผ่านตัวแปร --dl-accent จากหน้า download */
export function PhoneMock({ scene, className }: { scene: PhoneScene; className?: string }) {
  return (
    <svg viewBox="0 0 160 320" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="157" height="317" rx="24" fill="#0a0912" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="3" />
      <rect x="6" y="6" width="148" height="308" rx="19" fill="#15122a" />
      <rect x="62" y="9" width="36" height="7" rx="3.5" fill="#000000" />
      <StatusBar />
      <Scene scene={scene} />
    </svg>
  );
}

/**
 * มือถือที่ใช้ภาพหน้าจอจริง — ภาพอยู่ด้านหลัง โครงมือถือ (SVG) ทับด้านบน
 * ios = ขอบโค้งมาก + Dynamic Island · android = ขอบโค้งน้อย ไม่มี notch
 * ภาพเป็นไฟล์ที่ตัดต่อแล้ว (ไม่มีข้อมูลส่วนตัว) — ไม่ใช้ component วาดทับ
 */
export function PhonePhoto({
  src,
  variant = "ios",
  className,
}: {
  src: string;
  variant?: "ios" | "android";
  className?: string;
}) {
  const android = variant === "android";
  return (
    <div className={`relative aspect-[1/2] ${className ?? ""}`} aria-hidden="true">
      <div
        className={`absolute overflow-hidden ${android ? "rounded-[4%/2%]" : "rounded-[12%/6%]"}`}
        style={android ? { left: "3.1%", top: "1.55%", width: "93.8%", height: "96.9%" } : { left: "3.75%", top: "1.9%", width: "92.5%", height: "96.2%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ภาพสถิตขนาดเล็กใน public/pwa */}
        <img src={src} alt="" className="h-full w-full object-cover object-top" draggable={false} loading="lazy" />
      </div>
      <svg viewBox="0 0 160 320" className="absolute inset-0 h-full w-full">
        <path
          fillRule="evenodd"
          fill="#0a0912"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="3"
          d={
            android
              ? "M11.5 1.5H148.5A10 10 0 0 1 158.5 11.5V308.5A10 10 0 0 1 148.5 318.5H11.5A10 10 0 0 1 1.5 308.5V11.5A10 10 0 0 1 11.5 1.5ZM11 5A6 6 0 0 0 5 11V309A6 6 0 0 0 11 315H149A6 6 0 0 0 155 309V11A6 6 0 0 0 149 5Z"
              : "M26 1.5h108a24.5 24.5 0 0 1 24.5 24.5v268A24.5 24.5 0 0 1 134 318.5H26A24.5 24.5 0 0 1 1.5 294V26A24.5 24.5 0 0 1 26 1.5ZM25 6a19 19 0 0 0-19 19v270a19 19 0 0 0 19 19h110a19 19 0 0 0 19-19V25a19 19 0 0 0-19-19Z"
          }
        />
        {android ? null : <rect x="58" y="9" width="44" height="9" rx="4.5" fill="#000000" />}
      </svg>
    </div>
  );
}
