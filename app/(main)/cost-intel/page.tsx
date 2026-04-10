"use client";

import { useState, useMemo, useCallback } from "react";
import {
  TrendingDown, TrendingUp, Wallet, Upload, FileSpreadsheet,
  MessageSquare, BarChart3,
} from "lucide-react";
import { expenses } from "@/data/expenses";
import { orders } from "@/data/orders";
import type { Expense } from "@/lib/types";
import { useRightPanel } from "@/lib/right-panel-context";
import Table, { type Column } from "@/components/ui/Table";
import ExportMenu from "@/components/ui/ExportMenu";
import Badge from "@/components/ui/Badge";
import { PlannedTooltip } from "@/components/ui/Tooltip";

/* ─── Helpers ─── */

function formatPrice(n: number) { return n.toLocaleString("ko-KR") + "원"; }

function sum(arr: Expense[]) { return arr.reduce((s, e) => s + e.amount, 0); }

function getMonth(d: string) { return d.slice(0, 7); } // YYYY-MM

type CostTab = "지출 통계" | "분석" | "데이터 추가" | "Raw Data";
const tabs: CostTab[] = ["지출 통계", "분석", "데이터 추가", "Raw Data"];

/* ─── Component ─── */

export default function CostIntelPage() {
  const [activeTab, setActiveTab] = useState<CostTab>("지출 통계");

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[920px] mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-[20px] font-semibold mb-5" style={{ letterSpacing: "-0.2px" }}>
          비용 인텔리전스
        </h1>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-[6px] text-[13px] font-medium cursor-pointer transition-all"
              style={{
                borderRadius: "9999px",
                backgroundColor: activeTab === tab ? "#000" : "#f5f5f5",
                color: activeTab === tab ? "#fff" : "#777169",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "지출 통계" && <StatsTab />}
        {activeTab === "분석" && <AnalysisTab />}
        {activeTab === "데이터 추가" && <DataUploadTab />}
        {activeTab === "Raw Data" && <RawDataTab />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   C-12a: 지출 통계
   ═══════════════════════════════ */

function StatsTab() {
  const [period, setPeriod] = useState("3개월");

  const thisMonth = expenses.filter((e) => getMonth(e.date) === "2026-04");
  const lastMonth = expenses.filter((e) => getMonth(e.date) === "2026-03");
  const thisTotal = sum(thisMonth);
  const lastTotal = sum(lastMonth);
  const changePercent = lastTotal > 0 ? Math.round(((thisTotal - lastTotal) / lastTotal) * 100) : 0;
  const budget = 10000000;
  const burnRate = Math.round((thisTotal / budget) * 100);

  // Monthly totals for bar chart
  const months = ["2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"];
  const monthlyTotals = months.map((m) => ({
    month: m.slice(5) + "월",
    total: sum(expenses.filter((e) => getMonth(e.date) === m)),
  }));
  const maxMonthly = Math.max(...monthlyTotals.map((m) => m.total));

  // Category breakdown
  const categories = [...new Set(expenses.filter((e) => getMonth(e.date) === "2026-04").map((e) => e.category))];
  const categoryTotals = categories
    .map((cat) => ({ category: cat, total: sum(thisMonth.filter((e) => e.category === cat)) }))
    .sort((a, b) => b.total - a.total);
  const categoryMax = categoryTotals[0]?.total ?? 1;

  // Team breakdown
  const teams = [...new Set(thisMonth.map((e) => e.team))];
  const teamTotals = teams
    .map((t) => ({ team: t, total: sum(thisMonth.filter((e) => e.team === t)) }))
    .sort((a, b) => b.total - a.total);
  const teamMax = teamTotals[0]?.total ?? 1;

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-5">
        {["1개월", "3개월", "6개월", "1년"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-3 py-[5px] text-[12px] font-medium cursor-pointer transition-all"
            style={{
              borderRadius: "6px",
              backgroundColor: period === p ? "#f0f0f0" : "transparent",
              color: period === p ? "#111" : "#777",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SummaryCard label="이번 달 총 지출" value={formatPrice(thisTotal)} icon={<Wallet size={18} strokeWidth={1.5} />} />
        <SummaryCard
          label="전월 대비"
          value={`${changePercent > 0 ? "+" : ""}${changePercent}%`}
          icon={changePercent >= 0
            ? <TrendingUp size={18} strokeWidth={1.5} color="#ef4444" />
            : <TrendingDown size={18} strokeWidth={1.5} color="#22c55e" />
          }
          valueColor={changePercent >= 0 ? "#ef4444" : "#22c55e"}
        />
        <SummaryCard label="예산 소진율" value={`${burnRate}%`} icon={<BarChart3 size={18} strokeWidth={1.5} />} sub={`${formatPrice(budget)} 중 ${formatPrice(thisTotal)}`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Monthly trend (bar chart) */}
        <ChartCard title="월별 지출 추이">
          <div className="flex items-end gap-2 h-[140px]">
            {monthlyTotals.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${Math.max((m.total / maxMonthly) * 120, 4)}px`,
                    backgroundColor: m.month === "04월" ? "#000" : "#e5e5e5",
                  }}
                />
                <span className="text-[10px] text-[#999]">{m.month}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Category breakdown */}
        <ChartCard title="카테고리별 비중 (4월)">
          <div className="flex flex-col gap-2.5">
            {categoryTotals.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-[#444]">{c.category}</span>
                  <span className="text-[#777]">{formatPrice(c.total)}</span>
                </div>
                <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#000] transition-all"
                    style={{ width: `${(c.total / categoryMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Team breakdown */}
      <div className="mt-4">
        <ChartCard title="팀별 지출 비교 (4월)">
          <div className="flex items-end gap-4 h-[120px]">
            {teamTotals.map((t) => (
              <div key={t.team} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#777]">{formatPrice(t.total)}</span>
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${Math.max((t.total / teamMax) * 90, 4)}px`,
                    backgroundColor: "#000",
                    opacity: 0.15 + (t.total / teamMax) * 0.85,
                  }}
                />
                <span className="text-[11px] text-[#444] font-medium">{t.team}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, sub, valueColor }: { label: string; value: string; icon: React.ReactNode; sub?: string; valueColor?: string }) {
  return (
    <div
      className="p-4 bg-white"
      style={{ borderRadius: "14px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}
    >
      <div className="flex items-center gap-2 mb-2 text-[#777]">{icon}<span className="text-[12px]">{label}</span></div>
      <p className="text-[22px] font-semibold" style={{ color: valueColor ?? "#000", letterSpacing: "-0.3px" }}>{value}</p>
      {sub && <p className="text-[11px] text-[#999] mt-0.5">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="p-4 bg-white"
      style={{ borderRadius: "14px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}
    >
      <p className="text-[13px] font-medium text-[#444] mb-3">{title}</p>
      {children}
    </div>
  );
}

/* ═══════════════════════════════
   C-12b: 분석 모드
   ═══════════════════════════════ */

function AnalysisTab() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [started, setStarted] = useState(false);
  const { openPanel } = useRightPanel();

  const examples = [
    "지난 분기 마케팅팀 지출이 왜 늘었나요?",
    "용지 비용 절감할 수 있는 방법은?",
    "이번 달 예산 대비 진행률은?",
  ];

  const handleAsk = useCallback((text: string) => {
    setStarted(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    // Dummy AI response after delay
    setTimeout(() => {
      const responses: Record<string, string> = {
        "마케팅": "마케팅팀 지출 분석입니다.\n\n1분기 마케팅팀 총 지출: 756,500원\n- 잉크/토너: 534,000원 (70.6%)\n- 사무용품: 222,500원 (29.4%)\n\n잉크/토너 비용이 전체의 70% 이상을 차지합니다. HP 206A 토너 주문이 분기당 3~4회로, 호환 토너 전환 시 약 40% 절감 가능합니다.",
        "용지": "용지 비용 절감 제안:\n\n현재 A4 용지 월 평균 지출: 193,500원\n\n1. **대량 구매 할인**: 50박스 이상 주문 시 팩당 11,500원 (11% 할인)\n2. **재생 용지 전환**: 팩당 9,800원 (24% 절감)\n3. **양면 인쇄 정책**: 예상 용지 사용량 30% 감소\n\n연간 예상 절감: 약 580,000원",
        "예산": "4월 예산 진행 현황:\n\n총 예산: 10,000,000원\n사용액: 5,698,500원 (57.0%)\n잔여: 4,301,500원\n\n남은 일수 대비 소진율이 높은 편입니다.\n가구 카테고리(2,490,000원)가 전체의 43.7%를 차지하며, 이는 의자 대량 구매 건입니다.",
      };

      let resp = "분석 결과를 확인하겠습니다.\n\n4월 누적 지출: 5,698,500원\n전월 대비: +18.2%\n\n상세 분석이 필요하시면 구체적인 질문을 해주세요.";
      for (const [key, val] of Object.entries(responses)) {
        if (text.includes(key)) { resp = val; break; }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: resp }]);
      openPanel(
        <div className="flex flex-col gap-4">
          <h3 className="text-[15px] font-semibold">분석 결과</h3>
          <div className="text-[13px] text-[#4e4e4e] leading-[1.7] whitespace-pre-line">{resp}</div>
          <div className="pt-2"><ExportMenu /></div>
        </div>
      );
    }, 800);
  }, [openPanel]);

  if (!started) {
    return (
      <div className="flex flex-col items-center pt-12">
        <MessageSquare size={32} strokeWidth={1.2} color="#ccc" />
        <h2 className="text-[18px] font-semibold mt-4 mb-2">지출 데이터에 대해 물어보세요</h2>
        <p className="text-[13px] text-[#777] mb-6">AI가 지출 분석을 도와드립니다</p>
        <div className="flex flex-col gap-2 w-full max-w-[400px]">
          {examples.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              className="px-4 py-3 text-[13px] text-[#444] text-left bg-white cursor-pointer transition-all hover:translate-y-[-1px]"
              style={{
                borderRadius: "12px",
                boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px",
              }}
            >
              &ldquo;{q}&rdquo;
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className="max-w-[520px] px-3.5 py-2.5 text-[14px] leading-[1.6] whitespace-pre-line"
            style={{
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              backgroundColor: msg.role === "user" ? "#000" : "#fff",
              color: msg.role === "user" ? "#fff" : "#000",
              boxShadow: msg.role === "user" ? undefined : "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px",
            }}
          >
            {msg.content}
          </div>
        </div>
      ))}
      {/* Simple input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="추가 질문을 입력하세요..."
          className="w-full px-4 py-3 text-[14px] bg-white outline-none"
          style={{
            borderRadius: "12px",
            boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              handleAsk(e.currentTarget.value.trim());
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   C-12c: 데이터 추가
   ═══════════════════════════════ */

function DataUploadTab() {
  const [uploaded, setUploaded] = useState(false);

  const dummyPreview = [
    { date: "2026-03-01", item: "사무용 가위 10개", amount: "45,000", category: "사무용품" },
    { date: "2026-03-05", item: "화이트보드 마커 20개", amount: "32,000", category: "사무용품" },
    { date: "2026-03-12", item: "A3 도면 용지 100매", amount: "28,500", category: "용지" },
  ];

  return (
    <div>
      {/* Upload area */}
      <div
        className="flex flex-col items-center justify-center py-16 mb-6 cursor-pointer transition-colors hover:bg-[#fafafa]"
        style={{
          borderRadius: "16px",
          border: "2px dashed #e5e5e5",
          backgroundColor: "#fff",
        }}
        onClick={() => setUploaded(true)}
      >
        <Upload size={32} strokeWidth={1.2} color="#ccc" />
        <p className="text-[14px] font-medium text-[#444] mt-3">엑셀, CSV 파일을 업로드하세요</p>
        <p className="text-[12px] text-[#999] mt-1">지원 형식: .xlsx, .csv — 드래그앤드롭 또는 클릭</p>
        <button
          className="mt-4 px-4 py-[7px] text-[13px] font-medium text-[#4e4e4e] bg-[#f5f5f5] rounded-lg cursor-pointer transition-colors hover:bg-[#ebebeb]"
        >
          <FileSpreadsheet size={14} strokeWidth={1.5} className="inline mr-1.5 -mt-0.5" />
          파일 선택
        </button>
      </div>

      {/* Preview (after upload) */}
      {uploaded && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-medium">업로드 미리보기</p>
            <span className="text-[12px] text-[#999]">외부_지출_2026Q1.xlsx · 3행</span>
          </div>

          <div
            className="overflow-hidden bg-white mb-4"
            style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
          >
            <div className="grid grid-cols-4 gap-2 px-4 py-2.5 text-[11px] font-medium text-[#999] uppercase tracking-wider" style={{ borderBottom: "1px solid #e5e5e5" }}>
              <span>날짜</span><span>항목</span><span>금액</span><span>카테고리</span>
            </div>
            {dummyPreview.map((r, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 px-4 py-2.5 text-[13px]" style={{ borderBottom: i < dummyPreview.length - 1 ? "1px solid rgba(0,0,0,0.04)" : undefined }}>
                <span className="text-[#777]">{r.date}</span>
                <span>{r.item}</span>
                <span>{r.amount}원</span>
                <span className="text-[#777]">{r.category}</span>
              </div>
            ))}
          </div>

          <PlannedTooltip description="데이터 통합" position="right">
            <button className="px-5 py-[9px] text-[14px] font-medium text-white bg-black rounded-xl cursor-pointer transition-opacity hover:opacity-80">
              분석에 추가
            </button>
          </PlannedTooltip>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════
   C-12d: Raw Data
   ═══════════════════════════════ */

function RawDataTab() {
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    const list = [...expenses];
    list.sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortAsc ? -diff : diff;
    });
    return list;
  }, [sortAsc]);

  const columns: Column<Expense>[] = [
    { key: "date", header: "날짜", width: "100px" },
    { key: "productName", header: "상품명", render: (r) => <span className="truncate block max-w-[200px]">{r.productName}</span> },
    { key: "category", header: "카테고리", width: "90px" },
    { key: "amount", header: "금액", width: "110px", render: (r) => formatPrice(r.amount) },
    { key: "team", header: "팀", width: "80px" },
    { key: "orderId", header: "주문", width: "80px", render: (r) => r.orderId ? <Badge status="완료" /> : <span className="text-[#ccc]">—</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="text-[12px] text-[#777] cursor-pointer hover:text-[#444] transition-colors"
        >
          {sortAsc ? "오래된순 ↑" : "최신순 ↓"}
        </button>
        <ExportMenu />
      </div>

      <Table
        columns={columns}
        data={sorted}
        rowKey={(r) => r.id}
        emptyMessage="데이터가 없습니다"
      />
    </div>
  );
}
