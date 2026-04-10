"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage, Product } from "@/lib/types";
import { products } from "@/data/products";
import { chats } from "@/data/chats";
import { useRightPanel } from "@/lib/right-panel-context";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import ProductRecommendCard from "./ProductRecommendCard";
import ProductDetailPanel from "./ProductDetailPanel";
import CartPanel, { type CartItem } from "@/components/commerce/CartPanel";
import PaymentSelector from "@/components/commerce/PaymentSelector";
import OrderTimeline, { type TimelinePhase } from "@/components/commerce/OrderTimeline";
import type { ApprovalStep } from "@/components/commerce/ApprovalTracker";
import type { ShippingStep } from "@/components/commerce/ShippingTracker";

/* ─── Keyword → product matching ─── */

const keywordMap: Record<string, string[]> = {
  "a4": ["prod-001"], "용지": ["prod-001"], "토너": ["prod-002"],
  "프린터": ["prod-011", "prod-003"], "복합기": ["prod-003"], "의자": ["prod-004"],
  "모니터": ["prod-005"], "데스크": ["prod-010"], "포스트잇": ["prod-007"],
  "태블릿": ["prod-008"], "정수기": ["prod-009"], "추천": ["prod-001", "prod-002", "prod-007"],
};

function findProductIds(text: string): string[] | null {
  const lower = text.toLowerCase();
  for (const [kw, ids] of Object.entries(keywordMap)) {
    if (lower.includes(kw)) return ids;
  }
  return null;
}

/* ─── Fallback responses ─── */

const dummyResponses: { content: string; agent?: string }[] = [
  { content: "확인했습니다. 어떤 상품을 찾고 계신가요? 카테고리나 구체적인 품명을 알려주시면 바로 검색해드리겠습니다.", agent: "주문" },
  { content: "현재 등록된 배송지는 **본사 3층 (서울 강남구 테헤란로 152)**입니다.\n\n다른 주소로 변경하시겠어요?", agent: "배송" },
  { content: "이번 달 예산 잔여액을 확인해볼게요.\n\n4월 부서 예산: 10,000,000원\n사용액: 5,089,000원\n**잔여: 4,911,000원 (49.1%)**\n\n여유가 있습니다.", agent: "주문" },
];

const AUTO_APPROVE_LIMIT = 300000;

const PAYMENT_LABELS: Record<string, string> = {
  "pay-001": "하나 법인카드 (****-1234)",
  "pay-002": "신한 법인카드 (****-5678)",
  "pay-003": "네이버 후불결제",
};

/* ─── Component ─── */

interface ChatContainerProps {
  initialChatId?: string | null;
}

export default function ChatContainer({ initialChatId }: ChatContainerProps) {
  const selectedChat = initialChatId
    ? chats.find((c) => c.id === initialChatId)
    : chats.find((c) => c.id === "chat-002");
  const initialChat = selectedChat ?? chats[0];

  const [messages, setMessages] = useState<ChatMessage[]>(initialChat.messages);
  const [isTyping, setIsTyping] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Purchase flow state
  const [flowActive, setFlowActive] = useState(false);
  const [timelinePhase, setTimelinePhase] = useState<TimelinePhase>("products");
  const [approvalStep, setApprovalStep] = useState<ApprovalStep>("요청");
  const [isAutoApproved, setIsAutoApproved] = useState(false);
  const [approvalDate, setApprovalDate] = useState<string | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [paymentDate, setPaymentDate] = useState<string | undefined>();
  const [shippingStep, setShippingStep] = useState<ShippingStep>("접수");
  const [frozenCart, setFrozenCart] = useState<CartItem[]>([]);
  const [frozenTotal, setFrozenTotal] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const responseIdx = useRef(0);
  const { openPanel } = useRightPanel();

  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  /* ── Helpers ── */

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const addMsg = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: new Date().toISOString() },
    ]);
  }, []);

  const addSys = useCallback((text: string) => addMsg({ role: "system", content: text }), [addMsg]);
  const addAI = useCallback((text: string, agent?: string) => addMsg({ role: "assistant", content: text, agent }), [addMsg]);

  /* ── Cart ── */

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: string, q: number) => {
    setCart((prev) => prev.map((i) => i.product.id === id ? { ...i, quantity: q } : i));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }, []);

  /* ═══════════════════════════════════
     Purchase flow — unified advance
     ═══════════════════════════════════ */

  const advanceFlow = useCallback(() => {
    // Central "next step" handler for the demo button
    if (timelinePhase === "approval" && approvalStep === "대기") {
      // Approve
      setApprovalStep("승인");
      setApprovalDate("2026-04-10");
      addSys("김지현 매니저가 품의를 승인했습니다.");
      addAI("승인 완료! 결제를 진행합니다.", "주문");
      setTimeout(() => {
        setTimelinePhase("payment");
        showPaymentSelector();
      }, 600);
    } else if (timelinePhase === "shipping") {
      const order: ShippingStep[] = ["접수", "준비", "배송중", "배송완료"];
      const ci = order.indexOf(shippingStep);
      if (ci < order.length - 1) {
        const next = order[ci + 1];
        setShippingStep(next);
        const msgs: Record<string, string> = {
          "준비": "상품이 배송 준비 중입니다.",
          "배송중": "배송이 시작되었습니다! CJ대한통운 송장번호: CJ1234567890",
          "배송완료": "배송이 완료되었습니다! 수령 확인 후 구매확정 부탁드립니다.",
        };
        addAI(msgs[next] ?? `배송 상태: ${next}`, "배송");
        if (next === "배송완료") setTimelinePhase("complete");
      }
    }
  }, [timelinePhase, approvalStep, shippingStep, addSys, addAI]);

  /* ── Start purchase (from cart) ── */

  const startApproval = useCallback(() => {
    // Freeze cart state for timeline display
    setFrozenCart([...cart]);
    setFrozenTotal(totalPrice);
    setFlowActive(true);

    const isAuto = totalPrice <= AUTO_APPROVE_LIMIT;
    setIsAutoApproved(isAuto);

    if (isAuto) {
      setApprovalStep("자동승인");
      setApprovalDate("2026-04-10");
      setTimelinePhase("payment");
      addAI(`총 ${totalPrice.toLocaleString()}원은 소액 자동승인 대상입니다. 승인이 즉시 완료되었습니다!`, "주문");
      setTimeout(() => showPaymentSelector(), 800);
    } else {
      setApprovalStep("요청");
      setTimelinePhase("approval");
      addAI(`품의 요청을 올렸습니다. 총 ${totalPrice.toLocaleString()}원 — **김지현 매니저**님의 승인을 기다리고 있습니다.`, "주문");
      setTimeout(() => setApprovalStep("대기"), 500);
    }
  }, [cart, totalPrice, addAI]);

  const startDirectPurchase = useCallback(() => {
    setFrozenCart([...cart]);
    setFrozenTotal(totalPrice);
    setFlowActive(true);
    setIsAutoApproved(true);
    setApprovalStep("자동승인");
    setApprovalDate("2026-04-10");
    setTimelinePhase("payment");
    addAI("직접 결제 권한이 확인되었습니다. 결제수단을 선택해주세요.", "주문");
    setTimeout(() => showPaymentSelector(), 400);
  }, [cart, totalPrice, addAI]);

  /* ── Payment selector (shown in panel alongside timeline) ── */

  const showPaymentSelector = useCallback(() => {
    // Temporarily show PaymentSelector; after confirm it switches back to timeline
  }, []);

  const confirmPayment = useCallback((methodId: string) => {
    const label = PAYMENT_LABELS[methodId] ?? methodId;
    setPaymentMethod(label);
    setPaymentDate("2026-04-10");
    setTimelinePhase("shipping");
    setShippingStep("접수");
    setCart([]); // Clear cart
    addSys(`결제 완료 — ${label}`);
    addAI(`결제가 완료되었습니다!\n\n결제수단: **${label}**\n결제 금액: **${frozenTotal.toLocaleString()}원**\n\n주문이 접수되었습니다.`, "주문");
  }, [addSys, addAI, frozenTotal]);

  /* ── Confirm / Return ── */

  const confirmPurchase = useCallback(() => {
    setShippingStep("구매확정");
    addSys("구매가 확정되었습니다.");
    addAI("구매 확정 처리되었습니다. 이용해 주셔서 감사합니다!", "주문");
  }, [addSys, addAI]);

  const requestReturn = useCallback(() => {
    setShippingStep("반품요청");
    addSys("반품 요청이 접수되었습니다.");
    addAI("반품 요청이 접수되었습니다. CS 담당자가 확인 후 연락드리겠습니다.", "주문");
  }, [addSys, addAI]);

  /* ── Right panel sync — single OrderTimeline ── */

  useEffect(() => {
    if (!flowActive) return;

    // During payment phase, show PaymentSelector instead
    if (timelinePhase === "payment" && !paymentMethod) {
      openPanel(
        <PaymentSelector totalPrice={frozenTotal} onConfirm={confirmPayment} />
      );
      return;
    }

    openPanel(
      <OrderTimeline
        activePhase={timelinePhase}
        cart={frozenCart}
        totalPrice={frozenTotal}
        approvalStep={approvalStep}
        approver="김지현 매니저"
        approvalDate={approvalDate}
        isAutoApproved={isAutoApproved}
        paymentMethod={paymentMethod}
        paymentDate={paymentDate}
        shippingStep={shippingStep}
        trackingNumber="CJ1234567890"
        estimatedDate="2026-04-14"
        onAdvance={advanceFlow}
        onConfirmPurchase={confirmPurchase}
        onRequestReturn={requestReturn}
      />
    );
  }, [
    flowActive, timelinePhase, frozenCart, frozenTotal,
    approvalStep, approvalDate, isAutoApproved,
    paymentMethod, paymentDate, shippingStep,
    advanceFlow, confirmPurchase, requestReturn, confirmPayment, openPanel,
  ]);

  /* ── Open cart panel ── */

  const openCart = useCallback(() => {
    openPanel(
      <CartPanel
        items={cart}
        onUpdateQuantity={updateQty}
        onRemove={removeItem}
        onRequestApproval={startApproval}
        onDirectPurchase={startDirectPurchase}
      />
    );
  }, [cart, openPanel, updateQty, removeItem, startApproval, startDirectPurchase]);

  /* ── View product detail ── */

  const viewProduct = useCallback((product: Product) => {
    openPanel(
      <ProductDetailPanel
        product={product}
        onAddToCart={() => {
          addToCart(product);
          addSys(`${product.name} 이(가) 장바구니에 담겼습니다.`);
        }}
      />
    );
  }, [openPanel, addToCart, addSys]);

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
    addSys(`${product.name} 이(가) 장바구니에 담겼습니다.`);
  }, [addToCart, addSys]);

  /* ── Send message ── */

  const handleSend = useCallback((text: string) => {
    addMsg({ role: "user", content: text });
    setIsTyping(true);

    setTimeout(() => {
      const matchedIds = findProductIds(text);
      if (matchedIds) {
        const count = matchedIds.filter((id) => products.find((p) => p.id === id)).length;
        addMsg({
          role: "assistant",
          content: `검색 결과 ${count}개 상품을 찾았습니다. 상품을 확인해보시고, 필요하시면 장바구니에 담아주세요.`,
          agent: "주문",
          productIds: matchedIds,
        });
      } else {
        const resp = dummyResponses[responseIdx.current % dummyResponses.length];
        responseIdx.current++;
        addMsg({ role: "assistant", content: resp.content, agent: resp.agent });
      }
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  }, [addMsg]);

  /* ─── Render ─── */

  return (
    <div className="flex flex-col h-full">
      {/* Cart floating badge */}
      {cart.length > 0 && !flowActive && (
        <button
          onClick={openCart}
          className="fixed bottom-24 right-6 z-20 flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-80"
          style={{ borderRadius: "9999px", boxShadow: "rgba(0,0,0,0.2) 0px 4px 12px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          장바구니 ({cart.reduce((s, i) => s + i.quantity, 0)})
        </button>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="max-w-[720px] mx-auto flex flex-col gap-1">
          {messages.map((msg) => (
            <div key={msg.id}>
              <ChatBubble message={msg} />
              {msg.productIds && msg.productIds.length > 0 && (
                <div className="flex justify-start mb-1 mt-1">
                  <div className="max-w-[520px]">
                    <ProductRecommendCard
                      productIds={msg.productIds}
                      onViewProduct={viewProduct}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-1">
              <div className="px-3.5 py-2.5 flex items-center gap-1" style={{ borderRadius: "16px 16px 16px 4px", backgroundColor: "#fff", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}>
                <span className="w-2 h-2 rounded-full bg-[#777169] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#777169] animate-pulse [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-[#777169] animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="max-w-[720px] mx-auto w-full">
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
