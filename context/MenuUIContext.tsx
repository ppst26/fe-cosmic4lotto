"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

interface MenuUIContextValue {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

const MenuUIContext = createContext<MenuUIContextValue | null>(null);

export function MenuUIProvider({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((v) => !v), []);

  const value = useMemo(
    () => ({
      isMobileMenuOpen,
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu,
    }),
    [isMobileMenuOpen, openMobileMenu, closeMobileMenu, toggleMobileMenu],
  );

  return <MenuUIContext.Provider value={value}>{children}</MenuUIContext.Provider>;
}

export function useMenuUI(): MenuUIContextValue {
  const ctx = useContext(MenuUIContext);
  if (!ctx) {
    throw new Error("useMenuUI ต้องใช้ภายใน MenuUIProvider");
  }
  return ctx;
}
