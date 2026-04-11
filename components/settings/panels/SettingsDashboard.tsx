"use client";

import { useState } from "react";
import {
  Building2, Users, MapPin, CreditCard, Wallet, FileText,
  Sparkles, ChevronDown, Check,
} from "lucide-react";
import { users } from "@/data/users";
import { companySettings, shippingAddresses, paymentMethods, budgetSettings, ruleSettings } from "@/data/settings";
import { useSettings } from "@/lib/settings-context";

function formatPrice(n: number) { return (n / 10000).toLocaleString() + "만원"; }

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

export default function SettingsDashboard() {
  const [expandTeam, setExpandTeam] = useState(false);
  const [expandShipping, setExpandShipping] = useState(false);
  const [expandBudget, setExpandBudget] = useState(false);
  const [autoDesc, setAutoDesc] = useState(ruleSettings.autoDescription);
  const [autoLimit, setAutoLimit] = useState(String(ruleSettings.autoApproveLimit / 10000));
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const roleCount = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  const monthlyPct = Math.round(((budgetSettings.monthlyLimit - budgetSettings.monthlyRemaining) / budgetSettings.monthlyLimit) * 100);

  return (
    <div className="max-w-[560px]">
      <h2 className="text-[18px] font-semibold mb-1" style={{ letterSpacing: "-0.2px" }}>설정 모아보기</h2>
      <p className="text-[13px] text-[#777] mb-6">현재 회사 설정과 회계규칙을 한눈에 확인하세요.</p>

      <div className="flex flex-col gap-4">
        {/* ── 회사 정보 ── */}
        <DashCard icon={Building2} title="회사 정보" aiPrompt="회사 정보를 수정하고 싶어요">
          <div className="flex flex-col gap-1 text-[13px]">
            <Row label="회사명">{companySettings.name}</Row>
            <Row label="사업자번호">{companySettings.registrationNumber}</Row>
            <Row label="대표자">{companySettings.representative}</Row>
          </div>
        </DashCard>

        {/* ── 팀원 ── */}
        <DashCard icon={Users} title="팀원" aiPrompt="팀원을 추가하고 싶어요">
          <div className="flex items-center gap-3 mb-2">
            {/* Avatar stack */}
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
          <p className="text-[13px] mb-1">
            <span className="font-medium">{shippingAddresses.find((a) => a.isDefault)?.name}</span>
            <span className="text-[#777]"> — {shippingAddresses.find((a) => a.isDefault)?.address}</span>
          </p>
          <p className="text-[12px] text-[#999]">외 {shippingAddresses.length - 1}개</p>
          <button onClick={() => setExpandShipping(!expandShipping)} className="flex items-center gap-1 text-[12px] text-[#777] cursor-pointer hover:text-[#444] mt-1.5">
            <ChevronDown size={13} strokeWidth={1.5} style={{ transform: expandShipping ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }} />
            {expandShipping ? "접기" : "전체 보기"}
          </button>
          {expandShipping && (
            <div className="mt-2 flex flex-col gap-1.5">
              {shippingAddresses.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-[12px] px-2 py-1.5" style={{ borderRadius: "8px", backgroundColor: "#fafafa" }}>
                  <div>
                    <span className="font-medium">{a.name}</span>
                    {a.isDefault && <span className="ml-1.5 text-[10px] text-[#3b82f6] bg-[#eff6ff] px-1.5 py-0 rounded">기본</span>}
                    <span className="text-[#777] ml-2">{a.address}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashCard>

        {/* ── 결제수단 ── */}
        <DashCard icon={CreditCard} title="결제수단" aiPrompt="법인카드를 등록하고 싶어요">
          {paymentMethods.map((m) => (
            <div key={m.id} className="flex items-center gap-2 text-[13px]">
              <span className="font-medium">{m.alias}</span>
              <span className="text-[#777]">{m.issuer} {m.number}</span>
              {m.isDefault && <span className="text-[10px] text-[#3b82f6] bg-[#eff6ff] px-1.5 py-0 rounded">기본</span>}
            </div>
          ))}
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
            {/* Auto description toggle */}
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
            {/* Auto approve limit */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium">자동승인 한도</p>
                <p className="text-[11px] text-[#999]">이 금액 이하 품의 자동 승인</p>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={autoLimit}
                  onChange={(e) => setAutoLimit(e.target.value)}
                  onBlur={() => showToast("설정이 반영되었습니다")}
                  className="w-[60px] px-2 py-1 text-[13px] text-right outline-none"
                  style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
                />
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex">
      <span className="w-[80px] text-[#999] shrink-0">{label}</span>
      <span className="text-[#222]">{children}</span>
    </div>
  );
}
