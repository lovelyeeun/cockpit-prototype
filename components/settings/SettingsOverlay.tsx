"use client";

import { X } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import SettingsNav from "./SettingsNav";
import PersonalGeneral from "./panels/PersonalGeneral";
import PersonalPlan from "./panels/PersonalPlan";
import PersonalConnectors from "./panels/PersonalConnectors";
import SettingsAIChat from "./panels/SettingsAIChat";
import SettingsDashboard from "./panels/SettingsDashboard";
import ProductsManagement from "./panels/ProductsManagement";
import AppsManagement from "./panels/AppsManagement";
import NotificationsSettings from "./panels/NotificationsSettings";

export default function SettingsOverlay() {
  const { open, section, closeSettings } = useSettings();

  if (!open) return null;

  const panelMap: Record<string, React.ReactNode> = {
    "personal-general": <PersonalGeneral />,
    "personal-plan": <PersonalPlan />,
    "personal-connectors": <PersonalConnectors />,
    "ai-settings": <SettingsAIChat />,
    "settings-dashboard": <SettingsDashboard />,
    "products": <ProductsManagement />,
    "apps": <AppsManagement />,
    "notifications": <NotificationsSettings />,
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
        onClick={closeSettings}
      />
      <div
        className="relative m-4 flex-1 bg-white overflow-hidden flex"
        style={{
          borderRadius: "16px",
          boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.08) 0px 8px 40px",
        }}
      >
        <button
          onClick={closeSettings}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors hover:bg-[#f5f5f5]"
        >
          <X size={18} strokeWidth={1.5} color="#777" />
        </button>
        <SettingsNav />
        <div className="flex-1 overflow-y-auto px-10 py-8">
          {panelMap[section]}
        </div>
      </div>
    </div>
  );
}
