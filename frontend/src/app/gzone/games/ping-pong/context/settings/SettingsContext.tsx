"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Settings } from "./types";

type SettingsContextValue = {
  settings: Settings;
  setSettings: (s: Settings) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetSettings: () => void;
};

const defaultSettings: Settings = {
  bgTable: "/images/table1.webp",
  paddle: "red",
  score: "5",
  ball: "/images/Balls/ball1.png",
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);

  // Optionnel : persister dans localStorage pour reload
  useEffect(() => {
    try {
      const raw = localStorage.getItem("game_settings_v1");
      if (raw) setSettingsState(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("game_settings_v1", JSON.stringify(settings));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // ignore
    }
  }, [settings]);

  const setSettings = (s: Settings) => setSettingsState(s);
  const updateSettings = (patch: Partial<Settings>) =>
    setSettingsState((prev) => ({ ...prev, ...patch }));
  const resetSettings = () => setSettingsState(defaultSettings);

  return (
    <SettingsContext.Provider
      value={{ settings, setSettings, updateSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
