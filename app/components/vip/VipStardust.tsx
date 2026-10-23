import type { CSSProperties } from "react";
import s from "./vip-page.module.css";

/** ค่า pseudo-random คงที่ (ไม่ใช้ Math.random — กัน hydration mismatch ระหว่าง server/client) */
function rnd(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const COUNT = 34;

/**
 * ประกายฝุ่นดาว (stardust) ด้านหลังตราแรงค์ — จุดเล็กลอยฟุ้งขึ้นด้านบนในทิศทางไม่แน่นอน แล้วค่อย ๆ เลือนหายไปกับพื้นหลัง
 * ใช้ CSS ล้วน (transform/opacity) · ปิดเมื่อ prefers-reduced-motion · สีตาม accent ของแรงค์
 */
export function VipStardust({ accent = "#f5c542" }: { accent?: string }) {
  return (
    <span className={s.stardust} style={{ "--sd-color": accent } as CSSProperties} aria-hidden>
      <span className={s.stardustGlow} />
      {Array.from({ length: COUNT }, (_, i) => {
        const style = {
          left: `${18 + rnd(i, 1) * 64}%`,
          top: `${30 + rnd(i, 2) * 50}%`,
          "--sd-size": `${2 + rnd(i, 3) * 4}px`,
          "--sd-dx": `${(rnd(i, 4) - 0.5) * 90}px`,
          "--sd-dy": `${-(60 + rnd(i, 5) * 120)}px`,
          "--sd-dur": `${4 + rnd(i, 6) * 5}s`,
          "--sd-delay": `${-rnd(i, 7) * 9}s`,
        } as CSSProperties;
        return <i key={i} className={s.stardustDot} style={style} />;
      })}
    </span>
  );
}
