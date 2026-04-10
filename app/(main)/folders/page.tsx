"use client";

import Link from "next/link";
import { Paperclip, Monitor, Armchair, Coffee, Plus, Settings } from "lucide-react";
import { folders } from "@/data/folders";
import { PlannedTooltip } from "@/components/ui/Tooltip";

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  Paperclip, Monitor, Armchair, Coffee,
};

export default function FoldersPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[640px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-semibold" style={{ letterSpacing: "-0.2px" }}>
              회사 상품 폴더
            </h1>
            <p className="text-[14px] text-[#777169] mt-1" style={{ letterSpacing: "0.14px" }}>
              자주 주문하는 상품을 폴더별로 관리하세요
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <PlannedTooltip description="폴더 추가">
              <button className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors hover:bg-[#f5f5f5]">
                <Plus size={18} strokeWidth={1.5} color="#4e4e4e" />
              </button>
            </PlannedTooltip>
            <PlannedTooltip description="폴더 관리">
              <button className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors hover:bg-[#f5f5f5]">
                <Settings size={18} strokeWidth={1.5} color="#4e4e4e" />
              </button>
            </PlannedTooltip>
          </div>
        </div>

        {/* Folder grid */}
        <div className="grid grid-cols-2 gap-3">
          {folders.map((folder) => {
            const Icon = iconMap[folder.icon] ?? Paperclip;
            return (
              <Link
                key={folder.id}
                href={`/folders/${folder.id}`}
                className="flex items-start gap-3.5 p-4 bg-white cursor-pointer transition-all hover:translate-y-[-1px]"
                style={{
                  borderRadius: "16px",
                  boxShadow:
                    "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
                }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl bg-[#f5f5f5] flex items-center justify-center shrink-0"
                >
                  <Icon size={20} strokeWidth={1.5} color="#4e4e4e" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-medium">{folder.name}</p>
                    <span
                      className="inline-flex items-center justify-center px-1.5 py-0 text-[11px] font-medium text-[#777169] bg-[#f5f5f5] rounded-full"
                      style={{ minWidth: "20px" }}
                    >
                      {folder.productIds.length}
                    </span>
                  </div>
                  {folder.description && (
                    <p className="text-[12px] text-[#777169] mt-0.5 line-clamp-1" style={{ letterSpacing: "0.14px" }}>
                      {folder.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
