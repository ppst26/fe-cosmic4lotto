"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useAuthUI } from "@/context/AuthUIContext";
import { useDeposit } from "@/context/DepositContext";
import { useMenuUI } from "@/context/MenuUIContext";

/**
 * ทำให้ปุ่มใน component หน้าแรก (components/lotto/*) ทำงานโดยไม่แก้ component:
 * ดักคลิกที่ระดับ document (event delegation) แล้วจับคู่จากข้อความปุ่ม — component หน้าแรกถูกแช่แข็งตามข้อกำหนด
 * ปุ่มที่ component เติม onClick/Link เองแล้ว (event.defaultPrevented หรืออยู่ใน <a>) จะไม่ถูกแตะ
 */
/** id ของ checkbox ในปุ่มแฮมเบอร์เกอร์ของ components/lotto/LottoSiteHeader.tsx (แช่แข็ง) */
const MENU_CHECK_ID = "lotto-header-menu-check";

export function HomeActionBridge() {
  const router = useRouter();
  const { openLogin, openRegister } = useAuthUI();
  const { openDeposit, openWithdraw } = useDeposit();
  const { openMobileMenu } = useMenuUI();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;

      /* hamburger ใน header หน้าแรก: <label for=lotto-header-menu-check> + checkbox ซ่อน — ไม่ให้ checkbox สลับ แต่เปิดเมนู */
      if (target?.closest(`label[for="${MENU_CHECK_ID}"]`) || (target instanceof HTMLInputElement && target.id === MENU_CHECK_ID)) {
        event.preventDefault();
        openMobileMenu();
        return;
      }

      const button = target?.closest("button");
      if (!button || button.closest("a") || button.closest("[data-no-bridge]")) return;
      if (!button.closest(".lotto-page")) return;
      const label = (button.textContent ?? "").replace(/\s+/g, " ").trim();

      const go = (href: string) => {
        event.preventDefault();
        router.push(href);
      };

      switch (label) {
        case "เข้าสู่ระบบ":
          event.preventDefault();
          openLogin();
          return;
        case "สมัครสมาชิก":
          event.preventDefault();
          openRegister();
          return;
        case "ฝากเงิน":
          event.preventDefault();
          openDeposit();
          return;
        case "ถอนเงิน":
          event.preventDefault();
          openWithdraw();
          return;
        case "แทงหวย":
        case "ผลหวย":
          go("/lottery");
          return;
        case "เกมอื่นๆ":
          go("/slots");
          return;
        case "ดูทั้งหมด": {
          const heading = button.closest("section")?.querySelector("h2")?.textContent ?? "";
          if (heading.includes("คาสิโน")) go("/casino");
          else if (heading.includes("สล็อต")) go("/slots");
          return;
        }
        default:
          return;
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router, openLogin, openRegister, openDeposit, openWithdraw, openMobileMenu]);

  return null;
}
