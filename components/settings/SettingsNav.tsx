"use client";

import {
  User, PieChart, Link2, Sparkles, Building2, FileText, Package, AppWindow, Bell,
} from "lucide-react";
import { useSettings, type SettingsSection } from "@/lib/settings-context";

interface NavItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    label: "개인 설정",
    items: [
      { id: "personal-general", label: "일반", icon: User },
      { id: "personal-plan", label: "플랜(사용량)", icon: PieChart },
      { id: "personal-connectors", label: "커넥터 연결", icon: Link2 },
    ],
  },
  {
    label: "회사 설정",
    items: [
      { id: "company-info", label: "회사 정보", icon: Building2 },
      { id: "accounting-rules", label: "회계 규칙", icon: FileText },
      { id: "products", label: "상품 관리", icon: Package },
      { id: "apps", label: "앱 관리", icon: AppWindow },
    ],
  },
];

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-3 py-[7px] rounded-lg text-[13px] cursor-pointer transition-all hover:bg-[#f0f0f0]"
      style={{
        backgroundColor: active ? "#fff" : "transparent",
        color: active ? "#111" : "#555",
        fontWeight: active ? 500 : 400,
        boxShadow: active ? "rgba(0,0,0,0.06) 0px 0px 0px 1px" : "none",
      }}
    >
      <span style={{ color: active ? "#333" : "#999" }}><Icon size={15} strokeWidth={1.5} /></span>
      {item.label}
    </button>
  );
}

export default function SettingsNav() {
  const { section, setSection } = useSettings();

  return (
    <nav className="w-[220px] shrink-0 bg-[#fafafa] h-full overflow-y-auto py-4 px-3" style={{ borderRight: "1px solid rgba(0,0,0,0.05)" }}>
      {groups.map((group, gi) => (
        <div key={group.label} className="mb-4">
          <p className="px-3 pb-1.5 text-[11px] font-medium text-[#999] uppercase tracking-wider">
            {group.label}
          </p>

          {/* AI로 설정하기 — 회사 설정 그룹 상단, 일반 항목과 동일 스타일 + 아이콘 강조 */}
          {gi === 1 && (
            <>
              <button
                onClick={() => setSection("ai-settings")}
                className="flex items-center gap-2.5 w-full px-3 py-[7px] rounded-lg text-[13px] cursor-pointer transition-all hover:bg-[#f0f0f0]"
                style={{
                  backgroundColor: section === "ai-settings" ? "#fff" : "transparent",
                  color: section === "ai-settings" ? "#111" : "#555",
                  fontWeight: section === "ai-settings" ? 500 : 400,
                  boxShadow: section === "ai-settings" ? "rgba(0,0,0,0.06) 0px 0px 0px 1px" : "none",
                }}
              >
                <Sparkles size={15} strokeWidth={1.5} style={{ color: section === "ai-settings" ? "#111" : "#555" }} />
                AI로 설정하기
              </button>
              <div className="mx-3 my-1.5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />
            </>
          )}

          {group.items.map((item) => (
            <NavButton key={item.id} item={item} active={section === item.id} onClick={() => setSection(item.id)} />
          ))}
        </div>
      ))}

      {/* 기타 */}
      <div className="mb-4">
        <p className="px-3 pb-1.5 text-[11px] font-medium text-[#999] uppercase tracking-wider">
          기타
        </p>
        <NavButton
          item={{ id: "notifications", label: "알림 설정", icon: Bell }}
          active={section === "notifications"}
          onClick={() => setSection("notifications")}
        />
      </div>
    </nav>
  );
}
