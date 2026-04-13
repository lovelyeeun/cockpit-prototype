"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowUp, Check, ChevronDown, Pencil, Trash2, Plus,
  Building2, Users as UsersIcon, MapPin, CreditCard, Wallet, FileText, Brain,
  Star,
} from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { users } from "@/data/users";
import {
  companySettings, shippingAddresses, paymentMethods, budgetSettings, ruleSettings,
  type PaymentCard, type PaymentBnpl, type PaymentInvoice,
} from "@/data/settings";

/* ═══════════════════════════════
   Constants & helpers
   ═══════════════════════════════ */

const promptChips = [
  "팀원 추가하기",
  "예산 설정 변경",
  "법인카드 등록",
  "배송지 추가",
  "적요 자동생성 켜기",
  "후불결제 신청",
];

const aiResponses: Record<string, { text: string; change?: { before: string; after: string; label: string }; highlightSection?: string }> = {
  "팀원": { text: "팀원을 추가하겠습니다. 새 팀원의 이메일 주소와 역할을 알려주세요.\n\n역할 옵션: 관리자, 매니저, 구매담당, 일반", highlightSection: "team" },
  "예산": { text: "현재 예산 설정입니다:\n\n- 연간 총 예산: 1억 2천만원\n- 월 한도: 1,000만원\n- 이번 달 잔여: 430만원\n\n어떤 항목을 변경할까요?", change: { label: "월 예산 한도", before: "10,000,000원", after: "15,000,000원" }, highlightSection: "budget" },
  "카드": { text: "법인카드를 등록하겠습니다.\n\n카드사, 카드번호, 별칭을 알려주세요.\n예: 신한카드 1234-5678-9012-3456 마케팅팀 카드", highlightSection: "payment" },
  "배송": { text: "새 배송지를 추가하겠습니다.\n\n주소명, 상세주소, 수령인, 연락처를 알려주세요.", change: { label: "배송지 추가", before: "2개 등록", after: "3개 등록" }, highlightSection: "shipping" },
  "적요": { text: "적요 자동생성을 켜겠습니다. 주문 시 카테고리에 따라 적요 코드가 자동으로 입력됩니다.", change: { label: "적요 자동생성", before: "OFF", after: "ON" }, highlightSection: "rules" },
  "후불": { text: "후불결제(BNPL) 신청을 진행하겠습니다.\n\n현재 상태: 비활성\n월 한도: 5,000만원\n\n활성화하시겠습니까?", change: { label: "후불결제", before: "비활성", after: "심사중" }, highlightSection: "payment" },
  "회사": { text: "회사 정보를 수정하겠습니다.\n\n현재 등록된 정보:\n- 회사명: 주식회사 로랩스\n- 대표: 김원균\n\n어떤 항목을 변경할까요?", highlightSection: "company" },
  "지식": { text: "회사 지식 설정을 확인하겠습니다.\n\n현재 등록된 AI 학습 항목: 5개\n- 친환경 우선, A4 용지는 Double A, IT장비 예산 월 500만원 등\n\n추가하거나 수정할 내용을 알려주세요.", highlightSection: "knowledge" },
};

function matchResponse(text: string) {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(aiResponses)) {
    if (lower.includes(key)) return val;
  }
  return { text: "네, 설정을 도와드리겠습니다. 어떤 항목을 변경하고 싶으신가요?\n\n회사 정보, 팀원, 배송지, 결제수단, 예산, 적요 등을 변경할 수 있습니다." };
}

function formatPrice(n: number) { return (n / 10000).toLocaleString() + "만원"; }

interface Msg { role: "user" | "assistant"; content: string; change?: { before: string; after: string; label: string }; highlightSection?: string }

/* ═══════════════════════════════
   Main component
   ═══════════════════════════════ */

export default function SettingsAIChat() {
  const { aiPrompt } = useSettings();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [autoDesc, setAutoDesc] = useState(ruleSettings.autoDescription);
  const [autoLimit, setAutoLimit] = useState(String(ruleSettings.autoApproveLimit / 10000));
  const bottomRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (aiPrompt && !initializedRef.current) {
      initializedRef.current = true;
      setInput(aiPrompt);
    }
  }, [aiPrompt]);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); }, []);

  const addChatLog = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content: `✓ ${text}` }]);
  }, []);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    setTimeout(() => {
      const resp = matchResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: resp.text, change: resp.change, highlightSection: resp.highlightSection }]);
      if (resp.highlightSection) {
        setHighlightedSection(resp.highlightSection);
        setTimeout(() => setHighlightedSection(null), 2000);
      }
    }, 600);
  }, [input]);

  const setInputAndFocus = useCallback((text: string) => { setInput(text); }, []);

  return (
    <div className="flex gap-0 h-full -mx-10 -my-8">
      {/* ─── Left: Chat ─── */}
      <div className="flex-1 flex flex-col px-8 py-6 min-w-0">
        <h2 className="text-[18px] font-semibold mb-1" style={{ letterSpacing: "-0.2px" }}>AI로 설정하기</h2>
        <p className="text-[13px] text-[#777] mb-4">자연어로 회사 설정과 회계규칙을 변경하세요.</p>

        <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-[13px] text-[#bbb]">아래 프롬프트를 선택하거나 직접 입력하세요</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[420px] px-3.5 py-2.5 text-[14px] leading-[1.6] whitespace-pre-line"
                  style={{
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    backgroundColor: msg.role === "user" ? "#000" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#000",
                    boxShadow: msg.role === "user" ? undefined : "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px",
                    letterSpacing: "0.14px",
                  }}
                >
                  {msg.content}
                </div>
              </div>
              {msg.change && (
                <div className="flex justify-start mt-2">
                  <div className="px-4 py-3 max-w-[380px]" style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px", backgroundColor: "#fff" }}>
                    <p className="text-[12px] text-[#999] mb-2">설정 변경 확인</p>
                    <p className="text-[13px] font-medium mb-1.5">{msg.change.label}</p>
                    <div className="flex items-center gap-3 text-[13px] mb-3">
                      <span className="text-[#999] line-through">{msg.change.before}</span>
                      <span className="text-[#777]">→</span>
                      <span className="font-medium text-[#000]">{msg.change.after}</span>
                    </div>
                    <button onClick={() => { showToast("설정이 반영되었습니다"); if (msg.highlightSection) { setHighlightedSection(msg.highlightSection); setTimeout(() => setHighlightedSection(null), 2000); } }} className="px-4 py-[6px] text-[13px] font-medium text-white bg-black cursor-pointer transition-opacity hover:opacity-80" style={{ borderRadius: "9999px" }}>
                      확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {promptChips.map((chip) => (
            <button key={chip} onClick={() => setInput(chip)} className="px-3 py-[5px] text-[12px] text-[#777] bg-[#f5f5f5] cursor-pointer transition-colors hover:bg-[#ebebeb]" style={{ borderRadius: "9999px" }}>
              {chip}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 bg-white" style={{ borderRadius: "14px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="설정을 변경하거나 질문하세요..." className="flex-1 text-[14px] outline-none bg-transparent placeholder:text-[#bbb]" style={{ letterSpacing: "0.14px" }} />
          <button onClick={handleSend} disabled={!input.trim()} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-opacity disabled:opacity-30 shrink-0" style={{ backgroundColor: input.trim() ? "#000" : "#e5e5e5" }}>
            <ArrowUp size={16} color="#fff" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ─── Right: Settings Status Panel ─── */}
      <div className="w-[360px] shrink-0 bg-[#f5f5f5] h-full overflow-y-auto px-4 py-5" style={{ borderLeft: "1px solid rgba(0,0,0,0.05)" }}>
        {/* == 회사정보 == */}
        <SectionLabel>회사정보</SectionLabel>

        <AccordionCard id="company" icon={Building2} title="회사 정보" highlighted={highlightedSection === "company"}>
          <EditableRow label="회사명" value={companySettings.name} onEdit={() => setInputAndFocus("회사명을 변경하고 싶어요")} />
          <EditableRow label="사업자번호" value={companySettings.registrationNumber} onEdit={() => setInputAndFocus("사업자번호를 변경하고 싶어요")} />
          <EditableRow label="대표자" value={companySettings.representative} onEdit={() => setInputAndFocus("대표자를 변경하고 싶어요")} />
          <EditableRow label="주소" value={companySettings.address} onEdit={() => setInputAndFocus("회사 주소를 변경하고 싶어요")} />
          <EditableRow label="업종" value={companySettings.industry} onEdit={() => setInputAndFocus("업종을 변경하고 싶어요")} />
        </AccordionCard>

        <AccordionCard id="team" icon={UsersIcon} title="팀원" highlighted={highlightedSection === "team"} summary={<>
          <div className="flex items-center gap-2">
            <div className="flex items-center">{users.slice(0, 3).map((u, i) => (<div key={u.id} className="w-6 h-6 rounded-full bg-black text-white text-[9px] font-medium flex items-center justify-center border-2 border-white" style={{ marginLeft: i > 0 ? "-5px" : 0, zIndex: 3 - i, position: "relative" }}>{u.name.slice(-1)}</div>))}{users.length > 3 && <div className="w-6 h-6 rounded-full bg-[#e5e5e5] text-[9px] font-medium text-[#777] flex items-center justify-center border-2 border-white" style={{ marginLeft: "-5px", position: "relative" }}>+{users.length - 3}</div>}</div>
            <span className="text-[12px] text-[#777]">{users.length}명</span>
          </div>
          <p className="text-[11px] text-[#999] mt-1">{Object.entries(users.reduce<Record<string, number>>((a, u) => { a[u.role] = (a[u.role] ?? 0) + 1; return a; }, {})).map(([r, c]) => `${r} ${c}`).join(", ")}</p>
        </>}>
          <div className="flex flex-col gap-1.5">
            {users.map((u) => (
              <div key={u.id} className="group flex items-center justify-between px-2 py-1.5 text-[12px]" style={{ borderRadius: "6px" }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-black text-white text-[8px] font-medium flex items-center justify-center">{u.name.slice(-1)}</div>
                  <span className="font-medium">{u.name}</span>
                  <span className="text-[#999]">{u.department}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#777]">{u.role}</span>
                  <button onClick={() => setInputAndFocus(`${u.name}의 권한을 수정하고 싶어요`)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#777] bg-[#f0f0f0] px-1.5 py-0.5 cursor-pointer hover:bg-[#e5e5e5]" style={{ borderRadius: "4px" }}>수정</button>
                </div>
              </div>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard id="shipping" icon={MapPin} title="배송지" highlighted={highlightedSection === "shipping"} summary={
          <p className="text-[12px] text-[#777]">{shippingAddresses.find((a) => a.isDefault)?.name} 외 {shippingAddresses.length - 1}개</p>
        }>
          <div className="flex flex-col gap-2">
            {shippingAddresses.map((a) => (
              <div key={a.id} className="group px-2 py-2 text-[12px]" style={{ borderRadius: "6px", backgroundColor: "#fafafa" }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-medium">{a.name}</span>
                  {a.isDefault && <span className="text-[9px] text-[#3b82f6] bg-[#eff6ff] px-1 py-0 rounded">기본</span>}
                  <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setInputAndFocus(`${a.name} 배송지를 수정하고 싶어요`)} className="cursor-pointer"><Pencil size={11} strokeWidth={1.5} color="#999" /></button>
                    <button className="cursor-pointer"><Trash2 size={11} strokeWidth={1.5} color="#999" /></button>
                  </div>
                </div>
                <p className="text-[#777]">{a.address}</p>
                <p className="text-[#999]">{a.receiver} · {a.phone}</p>
              </div>
            ))}
            <button onClick={() => setInputAndFocus("배송지를 추가하고 싶어요")} className="flex items-center gap-1 text-[11px] text-[#777] cursor-pointer hover:text-[#444]">
              <Plus size={12} strokeWidth={1.5} />배송지 추가
            </button>
          </div>
        </AccordionCard>

        {/* == 회계규칙 == */}
        <SectionLabel>회계규칙</SectionLabel>

        <AccordionCard id="payment" icon={CreditCard} title="결제수단" defaultOpen highlighted={highlightedSection === "payment"}>
          <div className="flex flex-col gap-2">
            {/* Cards */}
            {paymentMethods.filter((m): m is PaymentCard => m.type === "card").map((m) => (
              <div key={m.id} className="group flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{m.alias}</span>
                  <span className="text-[#999]">{m.issuer} {m.number}</span>
                  {m.isDefault && <Star size={10} fill="#f59e0b" color="#f59e0b" />}
                </div>
                <button onClick={() => setInputAndFocus(`${m.alias} 별칭을 변경하고 싶어요`)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Pencil size={10} strokeWidth={1.5} color="#999" /></button>
              </div>
            ))}
            {/* Invoice */}
            {paymentMethods.filter((m): m is PaymentInvoice => m.type === "invoice").map((m) => (
              <div key={m.id} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">세금계산서</span>
                  <span className="text-[#999]">{m.registrationNumber}</span>
                </div>
                <button onClick={() => setInputAndFocus("세금계산서 정보를 수정하고 싶어요")} className="cursor-pointer"><Pencil size={10} strokeWidth={1.5} color="#999" /></button>
              </div>
            ))}
            {/* BNPL */}
            {paymentMethods.filter((m): m is PaymentBnpl => m.type === "bnpl").map((m) => (
              <div key={m.id} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{m.name}</span>
                  <BnplBadge status={m.status} />
                </div>
                <button
                  onClick={() => { addChatLog("후불결제 상태가 변경되었습니다."); showToast("설정이 반영되었습니다"); }}
                  className="w-[36px] h-[18px] rounded-full cursor-pointer relative"
                  style={{ backgroundColor: m.status === "active" ? "#000" : "#e5e5e5" }}
                >
                  <span className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all" style={{ left: m.status === "active" ? "20px" : "2px", boxShadow: "rgba(0,0,0,0.1) 0px 1px 2px" }} />
                </button>
              </div>
            ))}
          </div>
        </AccordionCard>

        <AccordionCard id="budget" icon={Wallet} title="예산" defaultOpen highlighted={highlightedSection === "budget"}>
          <div className="text-[12px]">
            <div className="flex justify-between mb-1"><span className="text-[#777]">연간</span><span className="font-medium">{formatPrice(budgetSettings.annualTotal)}</span></div>
            <div className="flex justify-between mb-1.5"><span className="text-[#777]">이번 달 잔여</span><span className="font-medium">{formatPrice(budgetSettings.monthlyRemaining)}</span></div>
            <div className="h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full bg-[#000]" style={{ width: `${Math.round(((budgetSettings.monthlyLimit - budgetSettings.monthlyRemaining) / budgetSettings.monthlyLimit) * 100)}%` }} />
            </div>
            {budgetSettings.departments.map((d) => {
              const pct = Math.round((d.used / d.annual) * 100);
              return (
                <div key={d.name} className="flex items-center gap-2 mb-1">
                  <span className="w-[52px] text-[#777]">{d.name}</span>
                  <div className="flex-1 h-1 bg-[#e5e5e5] rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#000]" style={{ width: `${pct}%` }} /></div>
                  <span className="text-[#999] w-[32px] text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </AccordionCard>

        <AccordionCard id="rules" icon={FileText} title="규칙" defaultOpen highlighted={highlightedSection === "rules"}>
          <div className="flex flex-col gap-2.5 text-[12px]">
            <div className="flex items-center justify-between">
              <div><p className="font-medium">적요 자동생성</p><p className="text-[10px] text-[#999]">주문 시 적요 코드 자동 입력</p></div>
              <button onClick={() => { setAutoDesc(!autoDesc); addChatLog(`적요 자동생성이 ${!autoDesc ? "ON" : "OFF"}으로 변경되었습니다.`); showToast("설정이 반영되었습니다"); }} className="w-[36px] h-[18px] rounded-full cursor-pointer relative" style={{ backgroundColor: autoDesc ? "#000" : "#e5e5e5" }}>
                <span className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all" style={{ left: autoDesc ? "20px" : "2px", boxShadow: "rgba(0,0,0,0.1) 0px 1px 2px" }} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="font-medium">자동승인 한도</p><p className="text-[10px] text-[#999]">이 금액 이하 품의 자동 승인</p></div>
              <div className="flex items-center gap-1">
                <input type="text" value={autoLimit} onChange={(e) => setAutoLimit(e.target.value)} onBlur={() => { addChatLog(`자동승인 한도가 ${autoLimit}만원으로 변경되었습니다.`); showToast("설정이 반영되었습니다"); }} className="w-[48px] px-1.5 py-0.5 text-[12px] text-right outline-none" style={{ borderRadius: "4px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }} />
                <span className="text-[#777]">만원</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="font-medium">회사 지식</p><p className="text-[10px] text-[#999]">AI 학습 항목</p></div>
              <button onClick={() => setInputAndFocus("회사 지식 설정을 확인하고 싶어요")} className="text-[11px] text-[#777] cursor-pointer hover:text-[#444]">5개 항목 →</button>
            </div>
          </div>
        </AccordionCard>
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

/* ═══════════════════════════════
   Sub-components
   ═══════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-medium text-[#999] uppercase tracking-wider mb-2 mt-4 first:mt-0">{children}</p>;
}

function BnplBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: "rgba(34,197,94,0.1)", color: "#16a34a", label: "활성" },
    reviewing: { bg: "rgba(245,158,11,0.1)", color: "#d97706", label: "심사중" },
    inactive: { bg: "#f5f5f5", color: "#999", label: "비활성" },
  };
  const s = styles[status] ?? styles.inactive;
  return <span className="text-[9px] font-medium px-1.5 py-0 rounded" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
}

function AccordionCard({ id, icon: Icon, title, children, defaultOpen, highlighted, summary }: {
  id: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  highlighted?: boolean;
  summary?: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  // Auto-open when highlighted
  useEffect(() => {
    if (highlighted) setOpen(true);
  }, [highlighted]);

  return (
    <div
      className="mb-2 bg-white overflow-hidden transition-all"
      style={{
        borderRadius: "12px",
        boxShadow: highlighted
          ? "rgba(59,130,246,0.3) 0px 0px 0px 1.5px"
          : "rgba(0,0,0,0.06) 0px 0px 0px 1px",
        animation: highlighted ? "pulse-highlight 1s ease-out" : undefined,
      }}
    >
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-3.5 py-2.5 cursor-pointer hover:bg-[#fafafa] transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-[#777]"><Icon size={14} strokeWidth={1.5} /></span>
          <span className="text-[13px] font-medium">{title}</span>
        </div>
        <ChevronDown size={13} strokeWidth={1.5} color="#999" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }} />
      </button>
      {!open && summary && <div className="px-3.5 pb-2.5 -mt-1">{summary}</div>}
      {open && <div className="px-3.5 pb-3">{children}</div>}
    </div>
  );
}

function EditableRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="group flex items-center justify-between py-0.5 text-[12px]">
      <span className="text-[#999] w-[56px] shrink-0">{label}</span>
      <span className="text-[#222] flex-1 truncate">{value}</span>
      <button onClick={onEdit} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer">
        <Pencil size={10} strokeWidth={1.5} color="#999" />
      </button>
    </div>
  );
}
