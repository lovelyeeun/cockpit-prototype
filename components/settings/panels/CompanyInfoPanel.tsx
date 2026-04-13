"use client";

import { useState } from "react";
import {
  Building2, Users, MapPin, Plus,
  Sparkles, ChevronDown, Check, Pencil, X,
} from "lucide-react";
import { users } from "@/data/users";
import { companySettings, shippingAddresses as defaultAddresses } from "@/data/settings";
import { useSettings } from "@/lib/settings-context";

function AIEditButton({ prompt }: { prompt: string }) {
  const { navigateToAI } = useSettings();
  return (
    <button
      onClick={() => navigateToAI(prompt)}
      className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#777] bg-[#f5f5f5] cursor-pointer transition-colors hover:bg-[#ebebeb]"
      style={{ borderRadius: "9999px" }}
    >
      <Sparkles size={11} strokeWidth={1.5} />AI로 수정
    </button>
  );
}

function DashCard({ icon: Icon, title, aiPrompt, children }: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  aiPrompt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5" style={{ borderRadius: "16px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#777]"><Icon size={16} strokeWidth={1.5} /></span>
          <h3 className="text-[14px] font-semibold">{title}</h3>
        </div>
        <AIEditButton prompt={aiPrompt} />
      </div>
      {children}
    </div>
  );
}

function EditableRow({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => { onSave(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-[80px] text-[13px] text-[#999] shrink-0">{label}</span>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
          className="flex-1 px-2 py-0.5 text-[13px] text-[#222] outline-none"
          style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
        />
        <button onClick={commit} className="p-0.5 cursor-pointer text-[#555] hover:text-[#111]"><Check size={13} strokeWidth={2} /></button>
        <button onClick={cancel} className="p-0.5 cursor-pointer text-[#999] hover:text-[#555]"><X size={13} strokeWidth={2} /></button>
      </div>
    );
  }

  return (
    <div className="flex items-center group">
      <span className="w-[80px] text-[13px] text-[#999] shrink-0">{label}</span>
      <span className="text-[13px] text-[#222]">{value}</span>
      <button onClick={() => setEditing(true)} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer text-[#bbb] hover:text-[#555]">
        <Pencil size={11} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default function CompanyInfoPanel() {
  const [expandTeam, setExpandTeam] = useState(false);
  const [expandShipping, setExpandShipping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [company, setCompany] = useState({ ...companySettings });
  const [addresses, setAddresses] = useState([...defaultAddresses]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const updateCompany = (key: keyof typeof company, val: string) => {
    setCompany((prev) => ({ ...prev, [key]: val }));
    showToast("저장되었습니다");
  };

  const updateAddress = (id: string, key: string, val: string) => {
    setAddresses((prev) => prev.map((a) => a.id === id ? { ...a, [key]: val } : a));
    showToast("저장되었습니다");
  };

  const roleCount = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-[560px]">
      <h2 className="text-[18px] font-semibold mb-1" style={{ letterSpacing: "-0.2px" }}>회사 정보</h2>
      <p className="text-[13px] text-[#777] mb-6">회사 기본 정보, 팀원, 배송지를 관리합니다.</p>

      <div className="flex flex-col gap-4">
        {/* ── 회사 정보 ── */}
        <DashCard icon={Building2} title="회사 정보" aiPrompt="회사 정보를 수정하고 싶어요">
          <div className="flex flex-col gap-1.5">
            <EditableRow label="회사명" value={company.name} onSave={(v) => updateCompany("name", v)} />
            <EditableRow label="사업자번호" value={company.registrationNumber} onSave={(v) => updateCompany("registrationNumber", v)} />
            <EditableRow label="대표자" value={company.representative} onSave={(v) => updateCompany("representative", v)} />
            <EditableRow label="주소" value={company.address} onSave={(v) => updateCompany("address", v)} />
            <EditableRow label="업종" value={company.industry} onSave={(v) => updateCompany("industry", v)} />
          </div>
        </DashCard>

        {/* ── 팀원 ── */}
        <DashCard icon={Users} title="팀원" aiPrompt="팀원을 추가하고 싶어요">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center">
              {users.slice(0, 3).map((u, i) => (
                <div key={u.id} className="w-7 h-7 rounded-full bg-black text-white text-[10px] font-medium flex items-center justify-center border-2 border-white" style={{ marginLeft: i > 0 ? "-6px" : 0, zIndex: 3 - i, position: "relative" }}>
                  {u.name.slice(-1)}
                </div>
              ))}
              {users.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-[#f0f0f0] text-[10px] font-medium text-[#777] flex items-center justify-center border-2 border-white" style={{ marginLeft: "-6px", position: "relative" }}>
                  +{users.length - 3}
                </div>
              )}
            </div>
            <span className="text-[13px] text-[#777]">{users.length}명</span>
          </div>
          <p className="text-[12px] text-[#999] mb-2">
            {Object.entries(roleCount).map(([role, count]) => `${role} ${count}`).join(", ")}
          </p>
          <button onClick={() => setExpandTeam(!expandTeam)} className="flex items-center gap-1 text-[12px] text-[#777] cursor-pointer hover:text-[#444]">
            <ChevronDown size={13} strokeWidth={1.5} style={{ transform: expandTeam ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }} />
            {expandTeam ? "접기" : "전체 보기"}
          </button>
          {expandTeam && (
            <div className="mt-2 flex flex-col gap-1.5">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between text-[12px] px-2 py-1.5" style={{ borderRadius: "8px", backgroundColor: "#fafafa" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black text-white text-[9px] font-medium flex items-center justify-center">{u.name.slice(-1)}</div>
                    <span className="font-medium">{u.name}</span>
                    <span className="text-[#999]">{u.email}</span>
                  </div>
                  <span className="text-[#777]">{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </DashCard>

        {/* ── 배송지 ── */}
        <DashCard icon={MapPin} title="배송지" aiPrompt="배송지를 추가하고 싶어요">
          <div className="flex flex-col gap-2">
            {addresses.map((a) => (
              <div key={a.id} className="px-3 py-2.5 group" style={{ borderRadius: "10px", backgroundColor: "#fafafa" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[13px] font-medium">{a.name}</span>
                  {a.isDefault && <span className="text-[10px] text-[#3b82f6] bg-[#eff6ff] px-1.5 py-0 rounded">기본</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <EditableRow label="주소" value={a.address} onSave={(v) => updateAddress(a.id, "address", v)} />
                  <EditableRow label="수령인" value={a.receiver} onSave={(v) => updateAddress(a.id, "receiver", v)} />
                  <EditableRow label="연락처" value={a.phone} onSave={(v) => updateAddress(a.id, "phone", v)} />
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white text-[13px] font-medium" style={{ borderRadius: "10px" }}>
          <Check size={14} strokeWidth={2} />{toast}
        </div>
      )}
    </div>
  );
}
