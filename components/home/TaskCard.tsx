"use client";

import { FileCheck, FileSearch, Truck, Repeat, Calendar, BarChart3, Sparkles } from "lucide-react";

const iconMap = {
  "file-check": FileCheck,
  "file-search": FileSearch,
  "truck": Truck,
  "repeat": Repeat,
  "calendar": Calendar,
  "bar-chart": BarChart3,
};

interface TaskCardProps {
  icon: keyof typeof iconMap;
  title: string;
  meta: string;
  insight?: string;
  variant?: "default" | "recommended";
  onClick: () => void;
}

export default function TaskCard({ icon, title, meta, insight, variant = "default", onClick }: TaskCardProps) {
  const Icon = iconMap[icon];
  const isRec = variant === "recommended";

  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-3 w-full p-4 text-left cursor-pointer transition-all hover:translate-y-[-1px]"
      style={{
        borderRadius: "14px",
        backgroundColor: isRec ? "rgba(245,242,239,0.5)" : "#fff",
        boxShadow: isRec
          ? "rgba(78,50,23,0.08) 0px 0px 0px 1px, rgba(78,50,23,0.04) 0px 2px 8px"
          : "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px",
      }}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 flex items-center justify-center shrink-0"
        style={{
          borderRadius: "10px",
          backgroundColor: isRec ? "#fff" : "#f5f5f5",
        }}
      >
        <Icon size={16} strokeWidth={1.5} color={isRec ? "#8b6f47" : "#4e4e4e"} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {isRec && insight && (
          <div className="flex items-center gap-1 mb-1">
            <Sparkles size={11} strokeWidth={1.5} color="#8b6f47" />
            <span className="text-[11px] font-medium text-[#8b6f47]" style={{ letterSpacing: "0.14px" }}>
              {insight}
            </span>
          </div>
        )}
        <p className="text-[14px] font-medium text-[#111] leading-tight mb-1 truncate">
          {title}
        </p>
        <p className="text-[12px] text-[#777]" style={{ letterSpacing: "0.14px" }}>
          {meta}
        </p>
      </div>
    </button>
  );
}
