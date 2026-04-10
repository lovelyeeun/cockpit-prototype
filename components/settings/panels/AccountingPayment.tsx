"use client";

import { useState } from "react";
import { CreditCard, Plus, Star, X } from "lucide-react";
import { PlannedTooltip } from "@/components/ui/Tooltip";

const cards = [
  { id: "c1", issuer: "하나카드", number: "****-****-****-1234", alias: "경영지원 법인카드", isDefault: true },
  { id: "c2", issuer: "신한카드", number: "****-****-****-5678", alias: "마케팅팀 법인카드", isDefault: false },
];

export default function AccountingPayment() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  return (
    <div className="max-w-[520px]">
      <h2 className="text-[18px] font-semibold mb-5">결제수단 등록</h2>

      {/* Cards */}
      <p className="text-[12px] text-[#999] mb-2">법인카드</p>
      <div className="flex flex-col gap-3 mb-4">
        {cards.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-4" style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}>
            <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center shrink-0"><CreditCard size={18} strokeWidth={1.5} color="#4e4e4e" /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2"><p className="text-[14px] font-medium">{c.alias}</p>{c.isDefault && <Star size={12} fill="#f59e0b" color="#f59e0b" />}</div>
              <p className="text-[12px] text-[#777]">{c.issuer} · {c.number}</p>
            </div>
          </div>
        ))}
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 p-4 cursor-pointer hover:bg-[#fafafa] transition-colors" style={{ borderRadius: "12px", border: "1px dashed #e5e5e5" }}>
          <Plus size={16} strokeWidth={1.5} color="#999" /><span className="text-[13px] text-[#777]">카드 추가</span>
        </button>
      </div>

      {/* BNPL */}
      <p className="text-[12px] text-[#999] mb-2">BNPL (후불결제)</p>
      <PlannedTooltip description="BNPL 연동" position="right">
        <div className="p-4 text-[13px] text-[#999] text-center cursor-pointer" style={{ borderRadius: "12px", border: "1px dashed #e5e5e5" }}>
          BNPL 연동 준비중
        </div>
      </PlannedTooltip>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white p-6 w-[420px]" style={{ borderRadius: "16px", boxShadow: "rgba(0,0,0,0.08) 0px 8px 40px" }}>
            <div className="flex justify-between mb-4"><h3 className="text-[16px] font-semibold">카드 등록</h3><button onClick={() => setModalOpen(false)}><X size={18} color="#777" /></button></div>
            {["카드사", "카드번호", "유효기간", "별칭"].map((l) => (
              <div key={l} className="mb-3"><label className="block text-[12px] text-[#999] mb-1">{l}</label><input className="w-full px-3 py-2 text-[13px] outline-none" style={{ borderRadius: "8px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }} /></div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-[13px] text-[#777] bg-[#f5f5f5] rounded-lg cursor-pointer">취소</button>
              <button onClick={() => { setModalOpen(false); showToast("등록되었습니다"); }} className="px-4 py-2 text-[13px] text-white bg-black rounded-lg cursor-pointer">등록</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#1a1a1a] text-white text-[13px] font-medium" style={{ borderRadius: "10px" }}>{toast}</div>}
    </div>
  );
}
