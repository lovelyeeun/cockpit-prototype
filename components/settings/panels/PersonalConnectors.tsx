"use client";

import { useState } from "react";

interface Connector {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const connectors: Connector[] = [
  {
    id: "google-calendar",
    name: "구글 캘린더",
    description: "배송 예정일, 회의 일정을 캘린더에 자동 등록합니다.",
    icon: "📅",
    color: "#4285f4",
  },
  {
    id: "slack",
    name: "슬랙",
    description: "주문 알림, 승인 요청을 슬랙 채널로 받습니다.",
    icon: "💬",
    color: "#611f69",
  },
];

export default function PersonalConnectors() {
  const [connected, setConnected] = useState<Set<string>>(new Set(["slack"]));

  const toggle = (id: string) => {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-[480px]">
      <h2 className="text-[18px] font-semibold mb-2" style={{ letterSpacing: "-0.2px" }}>커넥터 연결</h2>
      <p className="text-[13px] text-[#777] mb-6">외부 서비스와 연동하여 워크플로를 자동화하세요.</p>

      <div className="flex flex-col gap-3">
        {connectors.map((c) => {
          const isConnected = connected.has(c.id);
          return (
            <div
              key={c.id}
              className="flex items-center gap-4 p-4"
              style={{
                borderRadius: "14px",
                boxShadow: isConnected
                  ? `${c.color}33 0px 0px 0px 1.5px`
                  : "rgba(0,0,0,0.06) 0px 0px 0px 1px",
                backgroundColor: isConnected ? `${c.color}08` : "#fff",
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-[20px] shrink-0"
                style={{ backgroundColor: `${c.color}12` }}
              >
                {c.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium">{c.name}</p>
                  {isConnected && (
                    <span className="text-[11px] font-medium text-[#22c55e] bg-[#f0fdf4] px-1.5 py-0 rounded">
                      연결됨
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#777] mt-0.5">{c.description}</p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggle(c.id)}
                className="w-11 h-6 rounded-full cursor-pointer transition-colors shrink-0 relative"
                style={{ backgroundColor: isConnected ? "#000" : "#e5e5e5" }}
              >
                <span
                  className="absolute top-[2px] w-5 h-5 rounded-full bg-white transition-all"
                  style={{
                    left: isConnected ? "22px" : "2px",
                    boxShadow: "rgba(0,0,0,0.1) 0px 1px 2px",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
