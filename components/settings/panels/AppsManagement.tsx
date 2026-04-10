"use client";

import { useState } from "react";
import { MonitorSmartphone, Flower2, PenTool, Building2, Link2 } from "lucide-react";

const apps = [
  { id: "rental", name: "렌탈", desc: "사무기기/IT장비 월 단위 렌탈", icon: MonitorSmartphone },
  { id: "flowers", name: "화환", desc: "축하/조의 화환 전국 배송", icon: Flower2 },
  { id: "custom", name: "주문제작", desc: "명함, 봉투, 사인물 인쇄/제작", icon: PenTool },
  { id: "scm", name: "SCM", desc: "공급기업 관리 및 RFQ", icon: Building2 },
];

const connectors = [
  { id: "slack", name: "슬랙 (회사)", desc: "주문/승인 알림을 전사 채널로" },
  { id: "gcal", name: "구글 캘린더 (회사)", desc: "배송일정 전사 캘린더에 공유" },
];

export default function AppsManagement() {
  const [enabledApps, setEnabledApps] = useState<Set<string>>(new Set(["scm"]));
  const [enabledConn, setEnabledConn] = useState<Set<string>>(new Set(["slack"]));
  const [toast, setToast] = useState<string | null>(null);

  const toggleApp = (id: string) => {
    setEnabledApps((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setToast("저장되었습니다"); setTimeout(() => setToast(null), 2000);
  };
  const toggleConn = (id: string) => {
    setEnabledConn((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="max-w-[520px]">
      <h2 className="text-[18px] font-semibold mb-5">앱 관리</h2>

      {/* Connectors */}
      <p className="text-[12px] text-[#999] mb-2">커넥터</p>
      <div className="flex flex-col gap-2 mb-6">
        {connectors.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-3.5" style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center"><Link2 size={16} strokeWidth={1.5} color="#777" /></div>
              <div><p className="text-[13px] font-medium">{c.name}</p><p className="text-[11px] text-[#999]">{c.desc}</p></div>
            </div>
            <button onClick={() => toggleConn(c.id)} className="w-[40px] h-[22px] rounded-full cursor-pointer relative" style={{ backgroundColor: enabledConn.has(c.id) ? "#000" : "#e5e5e5" }}>
              <span className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: enabledConn.has(c.id) ? "20px" : "2px", boxShadow: "rgba(0,0,0,0.1) 0px 1px 2px" }} />
            </button>
          </div>
        ))}
      </div>

      {/* Apps */}
      <p className="text-[12px] text-[#999] mb-2">앱</p>
      <div className="flex flex-col gap-2">
        {apps.map((app) => {
          const Icon = app.icon;
          const on = enabledApps.has(app.id);
          return (
            <div key={app.id} className="flex items-center justify-between p-3.5" style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px", backgroundColor: on ? "rgba(0,0,0,0.02)" : "#fff" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center"><Icon size={16} strokeWidth={1.5} color="#777" /></div>
                <div>
                  <p className="text-[13px] font-medium">{app.name}</p>
                  <p className="text-[11px] text-[#999]">{app.desc}</p>
                  {on && <p className="text-[10px] text-[#3b82f6] mt-0.5">스토어 사이드바에 표시됩니다</p>}
                </div>
              </div>
              <button onClick={() => toggleApp(app.id)} className="w-[40px] h-[22px] rounded-full cursor-pointer relative" style={{ backgroundColor: on ? "#000" : "#e5e5e5" }}>
                <span className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: on ? "20px" : "2px", boxShadow: "rgba(0,0,0,0.1) 0px 1px 2px" }} />
              </button>
            </div>
          );
        })}
      </div>

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#1a1a1a] text-white text-[13px] font-medium" style={{ borderRadius: "10px" }}>{toast}</div>}
    </div>
  );
}
