"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface BottomNavUIContextValue {
  suppressed: boolean;
  setSuppressed: (value: boolean) => void;
}

const BottomNavUIContext = createContext<BottomNavUIContextValue | null>(null);

export function BottomNavUIProvider({ children }: { children: React.ReactNode }) {
  const [suppressed, setSuppressedState] = useState(false);
  const setSuppressed = useCallback((value: boolean) => {
    setSuppressedState(value);
  }, []);

  const value = useMemo(
    () => ({ suppressed, setSuppressed }),
    [suppressed, setSuppressed],
  );

  return (
    <BottomNavUIContext.Provider value={value}>{children}</BottomNavUIContext.Provider>
  );
}

export function useBottomNavUI(): BottomNavUIContextValue {
  const ctx = useContext(BottomNavUIContext);
  if (!ctx) {
    throw new Error("useBottomNavUI ต้องใช้ภายใน BottomNavUIProvider");
  }
  return ctx;
}

export function useBottomNavSuppress(suppress: boolean) {
  const { setSuppressed } = useBottomNavUI();

  useEffect(() => {
    setSuppressed(suppress);
    return () => setSuppressed(false);
  }, [suppress, setSuppressed]);
}
