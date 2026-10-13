"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";

export type AuthUIMode = "login" | "register" | null;

interface AuthUIContextValue {
  mode: AuthUIMode;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  closeAuth: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
}

const AuthUIContext = createContext<AuthUIContextValue | null>(null);

/**
 * สถานะเปิด/ปิด login · สมัคร — sync กับ ?layer=login | signup (เหมือน glass · proxy ส่งมาที่ ?layer=login)
 * interface เดิมของ black-purple คงไว้ เพื่อให้ผู้เรียก useAuthUI() ไม่ต้องเปลี่ยน
 */
export function AuthUIProvider({ children }: { children: React.ReactNode }) {
  const login = useOverlayLayer("login");
  const signUp = useOverlayLayer("signup");

  const { isOpen: isLoginOpen, open: loginOpen, close: loginClose } = login;
  const { isOpen: isSignUpOpen, open: signUpOpen, close: signUpClose } = signUp;

  const openLogin = useCallback(() => loginOpen(), [loginOpen]);
  const openRegister = useCallback(() => signUpOpen(), [signUpOpen]);
  const closeAuth = useCallback(() => {
    if (isLoginOpen) loginClose();
    if (isSignUpOpen) signUpClose();
  }, [isLoginOpen, isSignUpOpen, loginClose, signUpClose]);

  const value = useMemo<AuthUIContextValue>(() => {
    const mode: AuthUIMode = isLoginOpen ? "login" : isSignUpOpen ? "register" : null;
    return {
      mode,
      isLoginOpen: mode === "login",
      isRegisterOpen: mode === "register",
      openLogin,
      openRegister,
      closeAuth,
      switchToRegister: openRegister,
      switchToLogin: openLogin,
    };
  }, [isLoginOpen, isSignUpOpen, openLogin, openRegister, closeAuth]);

  return <AuthUIContext.Provider value={value}>{children}</AuthUIContext.Provider>;
}

export function useAuthUI(): AuthUIContextValue {
  const ctx = useContext(AuthUIContext);
  if (!ctx) {
    throw new Error("useAuthUI ต้องใช้ภายใน AuthUIProvider");
  }
  return ctx;
}

/** ใช้เมื่อ provider ไม่ได้ mount (เช่น story) */
export function useAuthUIOptional(): AuthUIContextValue | null {
  return useContext(AuthUIContext);
}
