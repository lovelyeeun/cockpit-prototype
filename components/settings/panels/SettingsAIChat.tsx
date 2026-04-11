"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Check } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

const promptChips = [
  "팀원 추가하기",
  "예산 설정 변경",
  "법인카드 등록",
  "배송지 추가",
  "적요 자동생성 켜기",
];

const aiResponses: Record<string, { text: string; change?: { before: string; after: string; label: string } }> = {
  "팀원": {
    text: "팀원을 추가하겠습니다. 새 팀원의 이메일 주소와 역할을 알려주세요.\n\n역할 옵션: 관리자, 매니저, 구매담당, 일반",
  },
  "예산": {
    text: "현재 예산 설정입니다:\n\n- 연간 총 예산: 1억 2천만원\n- 월 한도: 1,000만원\n- 이번 달 잔여: 430만원\n\n어떤 항목을 변경할까요?",
    change: { label: "월 예산 한도", before: "10,000,000원", after: "15,000,000원" },
  },
  "카드": {
    text: "법인카드를 등록하겠습니다.\n\n카드사, 카드번호, 별칭을 알려주세요.\n예: 신한카드 1234-5678-9012-3456 마케팅팀 카드",
  },
  "배송": {
    text: "새 배송지를 추가하겠습니다.\n\n주소명, 상세주소, 수령인, 연락처를 알려주세요.\n예: 분당 지사, 경기도 성남시 분당구 판교로 256, 김태환, 031-789-1234",
    change: { label: "배송지 추가", before: "2개 등록", after: "3개 등록" },
  },
  "적요": {
    text: "적요 자동생성을 켜겠습니다. 주문 시 카테고리에 따라 적요 코드가 자동으로 입력됩니다.",
    change: { label: "적요 자동생성", before: "OFF", after: "ON" },
  },
};

function matchResponse(text: string) {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(aiResponses)) {
    if (lower.includes(key)) return val;
  }
  return { text: "네, 설정을 도와드리겠습니다. 어떤 항목을 변경하고 싶으신가요?\n\n회사 정보, 팀원, 배송지, 결제수단, 예산, 적요 등을 변경할 수 있습니다." };
}

interface Msg { role: "user" | "assistant"; content: string; change?: { before: string; after: string; label: string } }

export default function SettingsAIChat() {
  const { aiPrompt } = useSettings();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Apply aiPrompt from dashboard navigation
  useEffect(() => {
    if (aiPrompt && !initializedRef.current) {
      initializedRef.current = true;
      setInput(aiPrompt);
    }
  }, [aiPrompt]);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); }, []);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    setTimeout(() => {
      const resp = matchResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: resp.text, change: resp.change }]);
    }, 600);
  }, [input]);

  return (
    <div className="flex flex-col h-full max-w-[560px]">
      <h2 className="text-[18px] font-semibold mb-1" style={{ letterSpacing: "-0.2px" }}>AI로 설정하기</h2>
      <p className="text-[13px] text-[#777] mb-4">자연어로 회사 설정과 회계규칙을 변경하세요.</p>

      {/* Messages */}
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
                className="max-w-[440px] px-3.5 py-2.5 text-[14px] leading-[1.6] whitespace-pre-line"
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
            {/* Change confirmation card */}
            {msg.change && (
              <div className="flex justify-start mt-2">
                <div
                  className="px-4 py-3 max-w-[400px]"
                  style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px", backgroundColor: "#fff" }}
                >
                  <p className="text-[12px] text-[#999] mb-2">설정 변경 확인</p>
                  <p className="text-[13px] font-medium mb-1.5">{msg.change.label}</p>
                  <div className="flex items-center gap-3 text-[13px] mb-3">
                    <span className="text-[#999] line-through">{msg.change.before}</span>
                    <span className="text-[#777]">→</span>
                    <span className="font-medium text-[#000]">{msg.change.after}</span>
                  </div>
                  <button
                    onClick={() => showToast("설정이 반영되었습니다")}
                    className="px-4 py-[6px] text-[13px] font-medium text-white bg-black cursor-pointer transition-opacity hover:opacity-80"
                    style={{ borderRadius: "9999px" }}
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Prompt chips */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {promptChips.map((chip) => (
          <button
            key={chip}
            onClick={() => setInput(chip)}
            className="px-3 py-[5px] text-[12px] text-[#777] bg-[#f5f5f5] cursor-pointer transition-colors hover:bg-[#ebebeb]"
            style={{ borderRadius: "9999px" }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-3 bg-white"
        style={{ borderRadius: "14px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="설정을 변경하거나 질문하세요..."
          className="flex-1 text-[14px] outline-none bg-transparent placeholder:text-[#bbb]"
          style={{ letterSpacing: "0.14px" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-opacity disabled:opacity-30 shrink-0"
          style={{ backgroundColor: input.trim() ? "#000" : "#e5e5e5" }}
        >
          <ArrowUp size={16} color="#fff" strokeWidth={2} />
        </button>
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
