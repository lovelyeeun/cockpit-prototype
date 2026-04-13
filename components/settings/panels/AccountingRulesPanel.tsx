"use client";

import { useState, useMemo } from "react";
import {
  CreditCard, Wallet, FileText, Plus, Pencil, X, Copy, Search,
  Sparkles, ChevronDown, Check, Clock, CircleCheck, Ban,
  Receipt,
} from "lucide-react";
import {
  paymentMethods as defaultMethods,
  budgetSettings, ruleSettings,
  type PaymentMethod, type PaymentCard, type PaymentBnpl, type PaymentInvoice, type BnplStatus,
} from "@/data/settings";
import { useSettings } from "@/lib/settings-context";

function formatPrice(n: number) { return (n / 10000).toLocaleString() + "만원"; }

/* ── Shared helpers ── */

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

function DashCard({ icon: Icon, title, aiPrompt, headerRight, children }: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  aiPrompt: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5" style={{ borderRadius: "16px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#777]"><Icon size={16} strokeWidth={1.5} /></span>
          <h3 className="text-[14px] font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {headerRight}
          <AIEditButton prompt={aiPrompt} />
        </div>
      </div>
      {children}
    </div>
  );
}

function EditableField({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => { onSave(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-[90px] text-[12px] text-[#999] shrink-0">{label}</span>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
          className="flex-1 px-2 py-0.5 text-[12px] text-[#222] outline-none"
          style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
        />
        <button onClick={commit} className="p-0.5 cursor-pointer text-[#555] hover:text-[#111]"><Check size={12} strokeWidth={2} /></button>
        <button onClick={cancel} className="p-0.5 cursor-pointer text-[#999] hover:text-[#555]"><X size={12} strokeWidth={2} /></button>
      </div>
    );
  }

  return (
    <div className="flex items-center group">
      <span className="w-[90px] text-[12px] text-[#999] shrink-0">{label}</span>
      <span className="text-[12px] text-[#222]">{value}</span>
      <button onClick={() => setEditing(true)} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer text-[#bbb] hover:text-[#555]">
        <Pencil size={10} strokeWidth={1.5} />
      </button>
    </div>
  );
}

/* ── Card action buttons (copy / delete) ── */

function CardActions({ onCopy, onDelete }: { onCopy: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={onCopy} title="복제" className="p-1 cursor-pointer text-[#bbb] hover:text-[#555] rounded transition-colors hover:bg-[#f0f0f0]">
        <Copy size={12} strokeWidth={1.5} />
      </button>
      <button onClick={onDelete} title="삭제" className="p-1 cursor-pointer text-[#bbb] hover:text-[#e11d48] rounded transition-colors hover:bg-[#fff1f2]">
        <X size={12} strokeWidth={1.5} />
      </button>
    </div>
  );
}

/* ── BNPL Status Badge ── */

function BnplBadge({ status }: { status: BnplStatus }) {
  const map = {
    inactive: { label: "비활성", bg: "#f5f5f5", color: "#999", icon: Ban },
    reviewing: { label: "심사중", bg: "#fef9c3", color: "#a16207", icon: Clock },
    active: { label: "이용중", bg: "#dcfce7", color: "#16a34a", icon: CircleCheck },
  };
  const s = map[status];
  const Icon = s.icon;
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
      <Icon size={10} strokeWidth={2} />{s.label}
    </span>
  );
}

/* ── Card type renderers ── */

function CardMethodCard({ method, onUpdate, onCopy, onRemove, showToast }: {
  method: PaymentCard; onUpdate: (m: PaymentCard) => void; onCopy: () => void; onRemove: () => void; showToast: (msg: string) => void;
}) {
  return (
    <div className="px-4 py-3.5 group" style={{ borderRadius: "12px", backgroundColor: "#fafafa" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CreditCard size={14} strokeWidth={1.5} className="text-[#777]" />
          <span className="text-[13px] font-medium">{method.alias}</span>
          {method.isDefault && <span className="text-[10px] text-[#3b82f6] bg-[#eff6ff] px-1.5 py-0.5 rounded-full font-medium">기본</span>}
        </div>
        <CardActions onCopy={onCopy} onDelete={onRemove} />
      </div>
      <div className="flex flex-col gap-1">
        <EditableField label="카드사" value={method.issuer} onSave={(v) => { onUpdate({ ...method, issuer: v }); showToast("저장되었습니다"); }} />
        <EditableField label="카드번호" value={method.number} onSave={(v) => { onUpdate({ ...method, number: v }); showToast("저장되었습니다"); }} />
        <EditableField label="별칭" value={method.alias} onSave={(v) => { onUpdate({ ...method, alias: v }); showToast("저장되었습니다"); }} />
      </div>
    </div>
  );
}

function InvoiceMethodCard({ method, onUpdate, onCopy, onRemove, showToast }: {
  method: PaymentInvoice; onUpdate: (m: PaymentInvoice) => void; onCopy: () => void; onRemove: () => void; showToast: (msg: string) => void;
}) {
  return (
    <div className="px-4 py-3.5 group" style={{ borderRadius: "12px", backgroundColor: "#fafafa" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Receipt size={14} strokeWidth={1.5} className="text-[#777]" />
          <span className="text-[13px] font-medium">계산서 거래</span>
          <span className="text-[10px] text-[#999]">{method.companyName}</span>
        </div>
        <CardActions onCopy={onCopy} onDelete={onRemove} />
      </div>

      <div className="flex flex-col gap-1">
        <EditableField label="상호(법인명)" value={method.companyName} onSave={(v) => { onUpdate({ ...method, companyName: v }); showToast("저장되었습니다"); }} />
        <EditableField label="대표" value={method.representative} onSave={(v) => { onUpdate({ ...method, representative: v }); showToast("저장되었습니다"); }} />
        <EditableField label="사업자번호" value={method.registrationNumber} onSave={(v) => { onUpdate({ ...method, registrationNumber: v }); showToast("저장되었습니다"); }} />
        <EditableField label="업태/업종" value={`${method.businessType} / ${method.industryType}`} onSave={(v) => { const [bt, it] = v.split("/").map(s => s.trim()); onUpdate({ ...method, businessType: bt || method.businessType, industryType: it || method.industryType }); showToast("저장되었습니다"); }} />
        <EditableField label="사업장 주소" value={method.address} onSave={(v) => { onUpdate({ ...method, address: v }); showToast("저장되었습니다"); }} />
      </div>

      <div className="my-2.5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />

      <div className="flex flex-col gap-1">
        <EditableField label="환불계좌 은행" value={method.refundBank} onSave={(v) => { onUpdate({ ...method, refundBank: v }); showToast("저장되었습니다"); }} />
        <EditableField label="예금주명" value={method.refundAccountHolder} onSave={(v) => { onUpdate({ ...method, refundAccountHolder: v }); showToast("저장되었습니다"); }} />
        <EditableField label="계좌번호" value={method.refundAccountNumber} onSave={(v) => { onUpdate({ ...method, refundAccountNumber: v }); showToast("저장되었습니다"); }} />
      </div>
    </div>
  );
}

/* ── Group section with collapse ── */

function PaymentGroup({ title, count, icon: Icon, defaultOpen, children }: {
  title: string; count: number; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; defaultOpen: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full py-1.5 cursor-pointer text-[12px] font-medium text-[#555] hover:text-[#222] transition-colors"
      >
        <ChevronDown size={13} strokeWidth={1.5} style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 150ms" }} />
        <Icon size={13} strokeWidth={1.5} />
        <span>{title}</span>
        <span className="text-[11px] text-[#999] font-normal">({count})</span>
      </button>
      {open && (
        <div className="flex flex-col gap-2 mt-1 mb-2">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── BNPL Section ── */

function BnplSection({ bnpl, onUpdate, showToast, invoiceExists }: {
  bnpl: PaymentBnpl; onUpdate: (m: PaymentBnpl) => void; showToast: (msg: string) => void; invoiceExists: boolean;
}) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revenue, setRevenue] = useState("");
  const [employees, setEmployees] = useState("");

  const isOn = bnpl.status !== "inactive";

  const handleToggle = () => {
    if (isOn) {
      onUpdate({ ...bnpl, status: "inactive" });
      showToast("후불결제가 비활성화되었습니다");
    } else {
      setShowReviewForm(true);
    }
  };

  const handleApply = () => {
    onUpdate({ ...bnpl, status: "reviewing" });
    setShowReviewForm(false);
    showToast("심사 신청이 완료되었습니다");
  };

  const handleSimulateApproval = () => {
    onUpdate({ ...bnpl, status: "active" });
    showToast("심사가 승인되었습니다");
  };

  return (
    <div>
      {/* Toggle header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Wallet size={13} strokeWidth={1.5} className="text-[#555]" />
          <span className="text-[12px] font-medium text-[#555]">후불결제</span>
          {isOn && <BnplBadge status={bnpl.status} />}
        </div>
        <button
          onClick={handleToggle}
          className="w-[40px] h-[22px] rounded-full cursor-pointer relative"
          style={{ backgroundColor: isOn ? "#000" : "#e5e5e5" }}
        >
          <span className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: isOn ? "20px" : "2px", boxShadow: "rgba(0,0,0,0.1) 0px 1px 2px" }} />
        </button>
      </div>

      {/* Review form — shown when toggling on for first time */}
      {showReviewForm && !isOn && (
        <div className="mt-1 mb-2 p-3.5" style={{ borderRadius: "12px", backgroundColor: "#fafafa", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}>
          <p className="text-[12px] font-medium mb-1">후불결제 이용 심사</p>
          <p className="text-[11px] text-[#999] mb-3">심사를 위한 정보를 입력해주세요. 보통 1~3 영업일이 소요됩니다.</p>
          {invoiceExists && (
            <div className="mb-3 px-3 py-2 text-[11px] text-[#a16207] bg-[#fef9c3] rounded-lg">
              후불결제를 이용하면 계산서 거래는 사용할 수 없습니다.
            </div>
          )}
          <div className="flex flex-col gap-2 mb-3">
            <div>
              <label className="text-[11px] text-[#999] mb-0.5 block">연 매출 규모</label>
              <input value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="예: 10억"
                className="w-full px-2.5 py-1.5 text-[12px] outline-none" style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }} />
            </div>
            <div>
              <label className="text-[11px] text-[#999] mb-0.5 block">직원 수</label>
              <input value={employees} onChange={(e) => setEmployees(e.target.value)} placeholder="예: 25"
                className="w-full px-2.5 py-1.5 text-[12px] outline-none" style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleApply} className="px-3 py-1.5 text-[12px] font-medium text-white bg-black rounded-lg cursor-pointer hover:bg-[#333] transition-colors">
              신청하기
            </button>
            <button onClick={() => setShowReviewForm(false)} className="px-3 py-1.5 text-[12px] font-medium text-[#777] bg-[#f0f0f0] rounded-lg cursor-pointer hover:bg-[#e5e5e5] transition-colors">
              취소
            </button>
          </div>
        </div>
      )}

      {/* Reviewing state */}
      {bnpl.status === "reviewing" && (
        <div className="mt-1 mb-2 px-4 py-3" style={{ borderRadius: "12px", backgroundColor: "#fafafa" }}>
          <p className="text-[12px] text-[#a16207] mb-2">심사가 진행 중입니다. 보통 1~3 영업일이 소요됩니다.</p>
          <button
            onClick={handleSimulateApproval}
            className="px-3 py-1.5 text-[11px] font-medium text-[#777] bg-white rounded-lg cursor-pointer hover:bg-[#f0f0f0] transition-colors"
            style={{ border: "1px dashed #ccc" }}
          >
            심사 완료 시뮬레이션
          </button>
        </div>
      )}

      {/* Active state */}
      {bnpl.status === "active" && (
        <div className="mt-1 mb-2 px-4 py-3" style={{ borderRadius: "12px", backgroundColor: "#fafafa" }}>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#999]">월 한도</span>
            <span className="text-[#222] font-medium">{formatPrice(bnpl.monthlyLimit)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Add Payment Method ── */

function AddPaymentForm({ onAdd, onCancel, bnplActive }: { onAdd: (m: PaymentMethod) => void; onCancel: () => void; bnplActive: boolean }) {
  const [step, setStep] = useState<"select" | "card" | "invoice">("select");
  const [cardForm, setCardForm] = useState({ issuer: "", number: "", alias: "" });
  const [invoiceForm, setInvoiceForm] = useState({
    companyName: "", representative: "", registrationNumber: "", industryType: "", businessType: "", address: "",
    refundBank: "", refundAccountHolder: "", refundAccountNumber: "",
  });

  if (step === "select") {
    return (
      <div className="px-4 py-4" style={{ borderRadius: "12px", border: "1px dashed #ccc", backgroundColor: "#fff" }}>
        <p className="text-[13px] font-medium mb-3">결제수단 유형을 선택하세요</p>
        <div className="flex gap-2">
          <button onClick={() => setStep("card")} className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-[12px] font-medium text-[#333] bg-[#fafafa] rounded-lg cursor-pointer hover:bg-[#f0f0f0] transition-colors" style={{ boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}>
            <CreditCard size={14} strokeWidth={1.5} />법인카드
          </button>
          <button
            onClick={() => !bnplActive && setStep("invoice")}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-[12px] font-medium rounded-lg transition-colors"
            style={{
              boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px",
              color: bnplActive ? "#bbb" : "#333",
              backgroundColor: bnplActive ? "#f5f5f5" : "#fafafa",
              cursor: bnplActive ? "not-allowed" : "pointer",
            }}
          >
            <Receipt size={14} strokeWidth={1.5} />계산서 거래
            {bnplActive && <span className="text-[10px] text-[#bbb]">(후불결제 이용중)</span>}
          </button>
        </div>
        <button onClick={onCancel} className="mt-2 text-[12px] text-[#999] cursor-pointer hover:text-[#555]">취소</button>
      </div>
    );
  }

  if (step === "card") {
    return (
      <div className="px-4 py-4" style={{ borderRadius: "12px", border: "1px dashed #ccc", backgroundColor: "#fff" }}>
        <p className="text-[13px] font-medium mb-3">법인카드 등록</p>
        <div className="flex flex-col gap-2 mb-3">
          {([
            { label: "카드사", key: "issuer" as const, ph: "예: 신한카드" },
            { label: "카드번호", key: "number" as const, ph: "예: ****-****-****-1234" },
            { label: "별칭", key: "alias" as const, ph: "예: 개발팀 법인카드" },
          ]).map(({ label, key, ph }) => (
            <div key={key}>
              <label className="text-[11px] text-[#999] mb-0.5 block">{label}</label>
              <input value={cardForm[key]} onChange={(e) => setCardForm({ ...cardForm, [key]: e.target.value })} placeholder={ph}
                className="w-full px-2.5 py-1.5 text-[12px] outline-none" style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }} />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onAdd({ id: `pay-${Date.now()}`, type: "card", ...cardForm, isDefault: false })}
            className="px-3 py-1.5 text-[12px] font-medium text-white bg-black rounded-lg cursor-pointer hover:bg-[#333] transition-colors">등록</button>
          <button onClick={onCancel} className="px-3 py-1.5 text-[12px] font-medium text-[#777] bg-[#f0f0f0] rounded-lg cursor-pointer hover:bg-[#e5e5e5] transition-colors">취소</button>
        </div>
      </div>
    );
  }

  // invoice
  const invoiceFields: { label: string; key: keyof typeof invoiceForm; ph: string }[] = [
    { label: "상호(법인명)", key: "companyName", ph: "예: 주식회사 로랩스" },
    { label: "대표", key: "representative", ph: "예: 김원균" },
    { label: "사업자번호", key: "registrationNumber", ph: "예: 123-45-67890" },
    { label: "업태", key: "businessType", ph: "예: 서비스" },
    { label: "업종", key: "industryType", ph: "예: 소프트웨어 개발" },
    { label: "사업장 주소", key: "address", ph: "예: 서울특별시 강남구..." },
    { label: "환불계좌 은행", key: "refundBank", ph: "예: 기업은행" },
    { label: "예금주명", key: "refundAccountHolder", ph: "예: 주식회사 로랩스" },
    { label: "계좌번호", key: "refundAccountNumber", ph: "예: 123-456789-01-234" },
  ];

  return (
    <div className="px-4 py-4" style={{ borderRadius: "12px", border: "1px dashed #ccc", backgroundColor: "#fff" }}>
      <p className="text-[13px] font-medium mb-3">계산서 거래 등록</p>
      <div className="flex flex-col gap-2 mb-3">
        {invoiceFields.map(({ label, key, ph }) => (
          <div key={key}>
            <label className="text-[11px] text-[#999] mb-0.5 block">{label}</label>
            <input value={invoiceForm[key]} onChange={(e) => setInvoiceForm({ ...invoiceForm, [key]: e.target.value })} placeholder={ph}
              className="w-full px-2.5 py-1.5 text-[12px] outline-none" style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }} />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onAdd({ id: `pay-${Date.now()}`, type: "invoice", ...invoiceForm })}
          className="px-3 py-1.5 text-[12px] font-medium text-white bg-black rounded-lg cursor-pointer hover:bg-[#333] transition-colors">등록</button>
        <button onClick={onCancel} className="px-3 py-1.5 text-[12px] font-medium text-[#777] bg-[#f0f0f0] rounded-lg cursor-pointer hover:bg-[#e5e5e5] transition-colors">취소</button>
      </div>
    </div>
  );
}

/* ── Main Panel ── */

export default function AccountingRulesPanel() {
  const [methods, setMethods] = useState<PaymentMethod[]>([...defaultMethods]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandBudget, setExpandBudget] = useState(false);
  const [autoDesc, setAutoDesc] = useState(ruleSettings.autoDescription);
  const [autoLimit, setAutoLimit] = useState(String(ruleSettings.autoApproveLimit / 10000));
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  // Derived
  const cards = useMemo(() => methods.filter((m): m is PaymentCard => m.type === "card"), [methods]);
  const invoices = useMemo(() => methods.filter((m): m is PaymentInvoice => m.type === "invoice"), [methods]);
  const bnpl = useMemo(() => methods.find((m): m is PaymentBnpl => m.type === "bnpl")!, [methods]);
  const bnplActive = bnpl.status !== "inactive";

  // Search filter
  const q = searchQuery.toLowerCase().trim();
  const filteredCards = useMemo(() => {
    if (!q) return cards;
    return cards.filter((c) => c.alias.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q) || c.number.includes(q));
  }, [cards, q]);
  const filteredInvoices = useMemo(() => {
    if (!q) return invoices;
    return invoices.filter((inv) => inv.companyName.toLowerCase().includes(q) || inv.registrationNumber.includes(q) || inv.refundBank.toLowerCase().includes(q));
  }, [invoices, q]);

  const updateMethod = (id: string, updated: PaymentMethod) => {
    setMethods((prev) => prev.map((m) => m.id === id ? updated : m));
  };

  const removeMethod = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    showToast("결제수단이 삭제되었습니다");
  };

  const copyMethod = (source: PaymentMethod) => {
    if (source.type === "card") {
      const copy: PaymentCard = { ...source, id: `pay-${Date.now()}`, alias: `${source.alias} (복사본)`, isDefault: false };
      setMethods((prev) => [...prev, copy]);
    } else if (source.type === "invoice") {
      const copy: PaymentInvoice = { ...source, id: `pay-${Date.now()}` };
      setMethods((prev) => [...prev, copy]);
    }
    showToast("결제수단이 복제되었습니다");
  };

  const addMethod = (m: PaymentMethod) => {
    setMethods((prev) => [...prev, m]);
    setShowAddForm(false);
    showToast("결제수단이 등록되었습니다");
  };

  const totalCount = cards.length + invoices.length;
  const monthlyPct = Math.round(((budgetSettings.monthlyLimit - budgetSettings.monthlyRemaining) / budgetSettings.monthlyLimit) * 100);

  return (
    <div className="max-w-[560px]">
      <h2 className="text-[18px] font-semibold mb-1" style={{ letterSpacing: "-0.2px" }}>회계 규칙</h2>
      <p className="text-[13px] text-[#777] mb-6">결제수단, 예산, 적요 규칙을 관리합니다.</p>

      <div className="flex flex-col gap-4">
        {/* ── 결제수단 ── */}
        <DashCard
          icon={CreditCard}
          title={`결제수단 (${totalCount})`}
          aiPrompt="결제수단을 등록하고 싶어요"
          headerRight={
            <button onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center w-6 h-6 rounded-md cursor-pointer text-[#777] bg-[#f5f5f5] hover:bg-[#ebebeb] transition-colors">
              <Plus size={13} strokeWidth={2} />
            </button>
          }
        >
          {/* Search */}
          <div className="relative mb-3">
            <Search size={13} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="결제수단 검색..."
              className="w-full pl-8 pr-3 py-1.5 text-[12px] outline-none text-[#333] placeholder:text-[#bbb]"
              style={{ borderRadius: "8px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-[#bbb] hover:text-[#555]">
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Card group */}
          {filteredCards.length > 0 && (
            <PaymentGroup title="법인카드" count={filteredCards.length} icon={CreditCard} defaultOpen={true}>
              {filteredCards.map((m) => (
                <CardMethodCard
                  key={m.id} method={m}
                  onUpdate={(u) => updateMethod(m.id, u)}
                  onCopy={() => copyMethod(m)}
                  onRemove={() => removeMethod(m.id)}
                  showToast={showToast}
                />
              ))}
            </PaymentGroup>
          )}

          {/* Invoice group */}
          {filteredInvoices.length > 0 && (
            <div style={{ opacity: bnplActive ? 0.5 : 1, pointerEvents: bnplActive ? "none" : "auto" }}>
              <PaymentGroup title="계산서 거래" count={filteredInvoices.length} icon={Receipt} defaultOpen={!bnplActive}>
                {bnplActive && (
                  <div className="px-3 py-2 text-[11px] text-[#a16207] bg-[#fef9c3] rounded-lg mb-1">
                    후불결제 이용 중에는 계산서 거래를 사용할 수 없습니다.
                  </div>
                )}
                {filteredInvoices.map((m) => (
                  <InvoiceMethodCard
                    key={m.id} method={m}
                    onUpdate={(u) => updateMethod(m.id, u)}
                    onCopy={() => copyMethod(m)}
                    onRemove={() => removeMethod(m.id)}
                    showToast={showToast}
                  />
                ))}
              </PaymentGroup>
            </div>
          )}

          {/* BNPL section — always at bottom, toggle style */}
          <div className="mt-1" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "4px" }}>
            <BnplSection
              bnpl={bnpl}
              onUpdate={(u) => updateMethod(bnpl.id, u)}
              showToast={showToast}
              invoiceExists={invoices.length > 0}
            />
          </div>

          {/* Add form */}
          {showAddForm && (
            <div className="mt-2">
              <AddPaymentForm onAdd={addMethod} onCancel={() => setShowAddForm(false)} bnplActive={bnplActive} />
            </div>
          )}

          {/* Empty search */}
          {q && filteredCards.length === 0 && filteredInvoices.length === 0 && (
            <p className="text-[12px] text-[#999] text-center py-3">검색 결과가 없습니다</p>
          )}
        </DashCard>

        {/* ── 예산 ── */}
        <DashCard icon={Wallet} title="예산" aiPrompt="예산 설정을 변경하고 싶어요">
          <div className="flex items-center justify-between text-[13px] mb-2">
            <span className="text-[#777]">연간 예산</span>
            <span className="font-medium">{formatPrice(budgetSettings.annualTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px] mb-2">
            <span className="text-[#777]">이번 달 잔여</span>
            <span className="font-medium">{formatPrice(budgetSettings.monthlyRemaining)}</span>
          </div>
          <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden mb-1.5">
            <div className="h-full rounded-full" style={{ width: `${monthlyPct}%`, backgroundColor: monthlyPct > 80 ? "#f59e0b" : "#000" }} />
          </div>
          <p className="text-[11px] text-[#999]">월 한도 {formatPrice(budgetSettings.monthlyLimit)} 중 {monthlyPct}% 사용</p>

          <button onClick={() => setExpandBudget(!expandBudget)} className="flex items-center gap-1 text-[12px] text-[#777] cursor-pointer hover:text-[#444] mt-2">
            <ChevronDown size={13} strokeWidth={1.5} style={{ transform: expandBudget ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }} />
            부서별 예산
          </button>
          {expandBudget && (
            <div className="mt-2 flex flex-col gap-1.5">
              {budgetSettings.departments.map((d) => {
                const pct = Math.round((d.used / d.annual) * 100);
                return (
                  <div key={d.name} className="px-2 py-1.5" style={{ borderRadius: "8px", backgroundColor: "#fafafa" }}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="font-medium">{d.name}</span>
                      <span className="text-[#777]">{formatPrice(d.annual)} · {pct}% 사용</span>
                    </div>
                    <div className="h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#000]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashCard>

        {/* ── 규칙 ── */}
        <DashCard icon={FileText} title="규칙" aiPrompt="적요 자동생성 설정을 변경하고 싶어요">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium">적요 자동생성</p>
                <p className="text-[11px] text-[#999]">주문 시 적요 코드 자동 입력</p>
              </div>
              <button
                onClick={() => { setAutoDesc(!autoDesc); showToast("설정이 반영되었습니다"); }}
                className="w-[40px] h-[22px] rounded-full cursor-pointer relative"
                style={{ backgroundColor: autoDesc ? "#000" : "#e5e5e5" }}
              >
                <span className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: autoDesc ? "20px" : "2px", boxShadow: "rgba(0,0,0,0.1) 0px 1px 2px" }} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium">자동승인 한도</p>
                <p className="text-[11px] text-[#999]">이 금액 이하 품의 자동 승인</p>
              </div>
              <div className="flex items-center gap-1">
                <input type="text" value={autoLimit} onChange={(e) => setAutoLimit(e.target.value)} onBlur={() => showToast("설정이 반영되었습니다")}
                  className="w-[60px] px-2 py-1 text-[13px] text-right outline-none" style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }} />
                <span className="text-[12px] text-[#777]">만원</span>
              </div>
            </div>
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
