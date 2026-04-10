"use client";

import {
  User, CreditCard, Link2, Building2, Users, Brain, MapPin,
  Wallet, FileText, PieChart, Package, AppWindow, Bell,
} from "lucide-react";
import { useSettings, type SettingsSection } from "@/lib/settings-context";

interface NavGroup {
  label: string;
  items: { id: SettingsSection; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[];
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
      { id: "company-info", label: "우리회사 정보", icon: Building2 },
      { id: "company-team", label: "팀원 관리", icon: Users },
      { id: "company-knowledge", label: "회사 지식 추가", icon: Brain },
      { id: "company-shipping", label: "배송지 관리", icon: MapPin },
    ],
  },
  {
    label: "회계규칙",
    items: [
      { id: "accounting-payment", label: "결제수단 등록", icon: CreditCard },
      { id: "accounting-description", label: "적요설정", icon: FileText },
      { id: "accounting-budget", label: "예산 설정", icon: Wallet },
    ],
  },
  {
    label: "기타",
    items: [
      { id: "products", label: "전체 상품 관리", icon: Package },
      { id: "apps", label: "앱 관리", icon: AppWindow },
      { id: "notifications", label: "알림 설정", icon: Bell },
    ],
  },
];

export default function SettingsNav() {
  const { section, setSection } = useSettings();

  return (
    <nav className="w-[220px] shrink-0 bg-[#fafafa] h-full overflow-y-auto py-4 px-3" style={{ borderRight: "1px solid rgba(0,0,0,0.05)" }}>
      {groups.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="px-3 pb-1.5 text-[11px] font-medium text-[#999] uppercase tracking-wider">
            {group.label}
          </p>
          {group.items.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
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
          })}
        </div>
      ))}
    </nav>
  );
}
