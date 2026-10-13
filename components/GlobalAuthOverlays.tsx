"use client";

import { AuthSheet } from "@/components/auth/AuthSheet";
import { useAuthUI } from "@/context/AuthUIContext";

export function GlobalAuthOverlays() {
  const { mode, closeAuth, switchToLogin, switchToRegister } = useAuthUI();

  if (!mode) return null;

  return (
    <AuthSheet
      mode={mode}
      onClose={closeAuth}
      onSwitch={(next) => (next === "login" ? switchToLogin() : switchToRegister())}
    />
  );
}
