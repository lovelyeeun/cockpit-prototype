"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type SettingsSection =
  | "personal-general"
  | "personal-plan"
  | "personal-connectors"
  | "ai-settings"
  | "settings-dashboard"
  | "products"
  | "apps"
  | "notifications";

interface SettingsState {
  open: boolean;
  section: SettingsSection;
  aiPrompt: string;
  openSettings: (section?: SettingsSection) => void;
  closeSettings: () => void;
  setSection: (s: SettingsSection) => void;
  navigateToAI: (prompt: string) => void;
}

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<SettingsSection>("personal-general");
  const [aiPrompt, setAiPrompt] = useState("");

  const openSettings = useCallback((s?: SettingsSection) => {
    if (s) setSection(s);
    setOpen(true);
  }, []);

  const closeSettings = useCallback(() => setOpen(false), []);

  const navigateToAI = useCallback((prompt: string) => {
    setAiPrompt(prompt);
    setSection("ai-settings");
  }, []);

  return (
    <SettingsContext.Provider value={{ open, section, aiPrompt, openSettings, closeSettings, setSection, navigateToAI }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
