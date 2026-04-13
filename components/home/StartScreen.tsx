"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ChevronDown, Sparkles } from "lucide-react";
import ActiveTasksSection from "./ActiveTasksSection";
import UpcomingSection from "./UpcomingSection";
import RecommendedSection from "./RecommendedSection";
import type { UserRole } from "@/data/homeTasks";

const contexts = ["전사 구매", "경영지원팀", "마케팅팀", "디자인팀", "Q2 구매 프로젝트"];
const models = ["Claude 4.6 Opus", "Claude 4.6 Sonnet", "Claude 4.5 Haiku"];

interface StartScreenProps {
  role?: UserRole;
}

export default function StartScreen({ role = "purchaser" }: StartScreenProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [context, setContext] = useState(contexts[0]);
  const [model, setModel] = useState(models[0]);
  const [ctxOpen, setCtxOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    router.push(`/chat?new=1&q=${encodeURIComponent(text)}&ctx=${encodeURIComponent(context)}`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[680px] mx-auto px-6 py-12 flex flex-col gap-8">
        {/* ─── Greeting ─── */}
        <div className="text-center pt-4">
          <h1 className="text-[32px] font-semibold mb-2" style={{ letterSpacing: "-0.5px", lineHeight: 1.15 }}>
            오늘 구매 업무, <br className="sm:hidden" />어디서부터 시작할까요?
          </h1>
          <p className="text-[14px] text-[#777]" style={{ letterSpacing: "0.14px" }}>
            cockpit은 구매담당자를 위한 AI 에이전트입니다
          </p>
        </div>

        {/* ─── Input area ─── */}
        <div
          className="bg-white p-4"
          style={{
            borderRadius: "18px",
            boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 4px, rgba(0,0,0,0.04) 0px 4px 12px",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="어떤 구매 업무를 시작할까요? 예: 마케팅팀 모니터 5대 견적 비교"
            rows={3}
            className="w-full text-[14px] outline-none resize-none placeholder:text-[#bbb] mb-3"
            style={{ letterSpacing: "0.14px", lineHeight: "1.55" }}
          />

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Context */}
            <div className="relative">
              <button
                onClick={() => { setCtxOpen(!ctxOpen); setModelOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-[6px] text-[12px] text-[#555] bg-[#f5f5f5] cursor-pointer hover:bg-[#ebebeb] transition-colors"
                style={{ borderRadius: "9999px" }}
              >
                <span className="text-[#999]">맥락</span>
                <span className="font-medium">{context}</span>
                <ChevronDown size={12} strokeWidth={1.5} />
              </button>
              {ctxOpen && (
                <div className="absolute top-full mt-1 left-0 w-[160px] bg-white py-1 z-20" style={{ borderRadius: "10px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 12px" }}>
                  {contexts.map((c) => (
                    <button key={c} onClick={() => { setContext(c); setCtxOpen(false); }} className="block w-full text-left px-3 py-1.5 text-[12px] text-[#444] cursor-pointer hover:bg-[#f5f5f5]">{c}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Model */}
            <div className="relative">
              <button
                onClick={() => { setModelOpen(!modelOpen); setCtxOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-[6px] text-[12px] text-[#555] bg-[#f5f5f5] cursor-pointer hover:bg-[#ebebeb] transition-colors"
                style={{ borderRadius: "9999px" }}
              >
                <Sparkles size={11} strokeWidth={1.5} color="#999" />
                <span className="font-medium">{model}</span>
                <ChevronDown size={12} strokeWidth={1.5} />
              </button>
              {modelOpen && (
                <div className="absolute top-full mt-1 left-0 w-[180px] bg-white py-1 z-20" style={{ borderRadius: "10px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 12px" }}>
                  {models.map((m) => (
                    <button key={m} onClick={() => { setModel(m); setModelOpen(false); }} className="block w-full text-left px-3 py-1.5 text-[12px] text-[#444] cursor-pointer hover:bg-[#f5f5f5]">{m}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="ml-auto flex items-center gap-1.5 px-4 py-[7px] text-[13px] font-medium cursor-pointer transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderRadius: "9999px",
                backgroundColor: input.trim() ? "#000" : "#e5e5e5",
                color: "#fff",
                boxShadow: input.trim() ? "rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px" : undefined,
              }}
            >
              시작하기
              <ArrowUp size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ─── Sections ─── */}
        <ActiveTasksSection role={role} />
        <UpcomingSection role={role} />
        <RecommendedSection role={role} />
      </div>
    </div>
  );
}
