"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Check, ChevronRight,
  Cookie, Sparkles,
  Clock, TrendingUp, Star,
} from "lucide-react";
import { products } from "@/data/products";
import { industryTypes } from "@/data/industryProducts";
import type { Product, ProductCategory } from "@/lib/types";
import ProductCard from "@/components/commerce/ProductCard";
import { useRightPanel } from "@/lib/right-panel-context";
import ProductDetailPanel from "@/components/chat/ProductDetailPanel";
import { PlannedTooltip } from "@/components/ui/Tooltip";

/* ─── Constants ─── */

type StoreTab = "스토어 홈" | "간식 패키지" | "업종별 탐색" | "기획전";
const storeTabs: StoreTab[] = ["스토어 홈", "간식 패키지", "업종별 탐색", "기획전"];

const categories: ProductCategory[] = ["용지", "잉크/토너", "사무기기", "가구", "전자기기", "사무용품", "생활용품"];
const brands = [...new Set(products.map((p) => p.brand))];

const bannerSlides = [
  { id: "b1", badge: "NEW", title: "간식 패키지 출시", desc: "회사 인원·예산에 맞는 간식 세트를 AI가 추천", cta: "만들어보기 →" },
  { id: "b2", badge: "시즌 할인", title: "봄맞이 사무용품 할인", desc: "A4용지, 필기구, 포스트잇 최대 25% 할인", cta: "할인 상품 보기 →" },
  { id: "b3", badge: "기획전", title: "프린터 토너 기획전", desc: "HP·Brother·삼성 정품 토너 모음", cta: "기획전 보기 →" },
  { id: "b4", badge: "신규 입점", title: "신규 브랜드 입점", desc: "그린오피스 — 친환경 인증 사무용품 전문", cta: "브랜드 탐색 →" },
];


/* ─── Dummy data for new sections ─── */

const freqMap: Record<string, string> = { weekly: "매주", biweekly: "격주", monthly: "매월" };


const promos = [
  { id: "promo-1", name: "봄맞이 사무용품 특가", tag: "할인행사", desc: "최대 30% 할인", count: 8, period: "4/1 ~ 4/30" },
  { id: "promo-2", name: "친환경 오피스 기획전", tag: "혜택", desc: "재생용지·친환경 제품 모음", count: 5, period: "상시 진행" },
  { id: "promo-3", name: "IT장비 대량 구매 할인", tag: "할인행사", desc: "10대 이상 15% 할인", count: 6, period: "4/15 ~ 5/15" },
  { id: "promo-4", name: "신규 가입 웰컴 혜택", tag: "혜택", desc: "첫 주문 배송비 무료", count: 12, period: "상시 진행" },
];

const brandList = [
  { name: "Double A", initial: "D" },
  { name: "HP", initial: "H" },
  { name: "FUJIFILM", initial: "F" },
  { name: "시디즈", initial: "시" },
  { name: "LG", initial: "L" },
  { name: "Samsung", initial: "S" },
  { name: "3M", initial: "3" },
  { name: "STAEDTLER", initial: "S" },
  { name: "Brother", initial: "B" },
  { name: "코웨이", initial: "코" },
];

/* ─── Helpers ─── */

function formatPrice(n: number) { return n.toLocaleString("ko-KR") + "원"; }

/* ═══════════════════════════════
   Main Store Page
   ═══════════════════════════════ */

export default function StorePage() {
  const router = useRouter();
  const { openPanel } = useRightPanel();
  const [activeTab, setActiveTab] = useState<StoreTab>("스토어 홈");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleView = useCallback((product: Product) => {
    router.push(`/store/${product.id}`);
  }, [router]);

  const handleAddToCart = useCallback((product: Product) => {
    openPanel(
      <ProductDetailPanel
        product={product}
        onAddToCart={() => showToast(`${product.name} — 장바구니에 담겼습니다`)}
      />
    );
  }, [openPanel, showToast]);

  return (
    <div className="h-full overflow-y-auto relative">
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white text-[13px] font-medium"
          style={{ borderRadius: "10px", boxShadow: "rgba(0,0,0,0.2) 0px 4px 12px" }}
        >
          <Check size={14} strokeWidth={2} />{toast}
        </div>
      )}

      {/* Tab bar */}
      <div className="sticky top-0 z-10 bg-white px-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="max-w-[960px] mx-auto flex items-center gap-6">
          {storeTabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative py-3 text-[14px] cursor-pointer transition-colors"
                style={{
                  color: active ? "#000" : "#777",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {tab}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#000] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-[960px] mx-auto px-6 py-6">
        {activeTab === "스토어 홈" && (
          <StoreHomeTab
            onView={handleView}
            onAddToCart={handleAddToCart}
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "간식 패키지" && <SnackPackageTab />}
        {activeTab === "업종별 탐색" && (
          <IndustryBrowseTab onView={handleView} onAddToCart={handleAddToCart} />
        )}
        {activeTab === "기획전" && (
          <PromotionsTab onView={handleView} onAddToCart={handleAddToCart} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   스토어 홈 탭
   ═══════════════════════════════ */

function StoreHomeTab({
  onView, onAddToCart, showToast, setActiveTab,
}: {
  onView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  showToast: (msg: string) => void;
  setActiveTab: (t: StoreTab) => void;
}) {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [freqFilter, setFreqFilter] = useState("전체");
  const [bestCategory, setBestCategory] = useState("전체");
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState("it-office");
  const [indSubCat, setIndSubCat] = useState("전체");

  const bestProducts = useMemo(() => {
    if (bestCategory === "전체") return products.slice(0, 10);
    return products.filter((p) => p.category === bestCategory).slice(0, 10);
  }, [bestCategory]);

  const freqProducts = useMemo(() => {
    const withFreq = products.filter((p) => p.purchaseFrequency);
    if (freqFilter === "전체") return withFreq.slice(0, 5);
    const filterMap: Record<string, string> = { "매주": "weekly", "격주": "biweekly", "매월": "monthly" };
    return withFreq.filter((p) => p.purchaseFrequency === filterMap[freqFilter]).slice(0, 5);
  }, [freqFilter]);

  /* Auto-advance carousel */
  useEffect(() => {
    const timer = setInterval(() => setCarouselIdx((i) => (i + 1) % bannerSlides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    }
    if (searchFocused) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchFocused]);

  return (
    <div className="flex flex-col gap-14">
      {/* ══════════════════════════════
         Hero Section
         ══════════════════════════════ */}
      <div
        className="px-8 pt-8 pb-6 flex gap-6"
        style={{
          borderRadius: "20px",
          backgroundColor: "rgba(245,242,239,0.8)",
          boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
        }}
      >
        {/* Left: Search */}
        <div className="w-[340px] shrink-0 flex flex-col">
          <h2 className="text-[20px] font-semibold mb-1" style={{ letterSpacing: "-0.3px" }}>
            무엇을 찾고 계세요?
          </h2>
          <p className="text-[13px] text-[#777169] mb-4" style={{ letterSpacing: "0.14px" }}>
            상품명, 브랜드, 카테고리로 검색
          </p>

          {/* Search input with dropdown */}
          <div ref={searchRef} className="relative">
            <div
              className="flex items-center gap-2.5 px-4 py-[10px] bg-white"
              style={{
                borderRadius: "9999px",
                boxShadow: searchFocused
                  ? "rgba(0,0,0,0.12) 0px 0px 0px 1.5px, rgba(0,0,0,0.04) 0px 2px 8px"
                  : "rgba(0,0,0,0.075) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.04) 0px 4px 4px",
              }}
            >
              <Search size={16} strokeWidth={1.5} color="#777" />
              <input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="flex-1 text-[14px] outline-none bg-transparent placeholder:text-[#bbb]"
                style={{ letterSpacing: "0.14px" }}
              />
            </div>

            {/* Search dropdown */}
            {searchFocused && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white py-2 z-20"
                style={{
                  borderRadius: "14px",
                  boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 4px, rgba(0,0,0,0.04) 0px 4px 8px, rgba(0,0,0,0.04) 0px 8px 16px",
                }}
              >
                <p className="px-4 py-1 text-[11px] font-medium text-[#999]">최근 검색</p>
                {["A4용지", "물티슈", "원두커피", "무선마우스"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setSearch(q); setSearchFocused(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-[13px] text-[#444] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                  >
                    <Clock size={13} strokeWidth={1.5} color="#bbb" />{q}
                  </button>
                ))}
                <div className="mx-3 my-1.5 border-b border-[#f0f0f0]" />
                <p className="px-4 py-1 text-[11px] font-medium text-[#999]">카테고리 바로가기</p>
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSearchFocused(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-[13px] text-[#444] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                  >
                    <ChevronRight size={13} strokeWidth={1.5} color="#bbb" />{cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recent keyword chips */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {["A4용지", "물티슈", "원두커피", "무선마우스"].map((kw) => (
              <button
                key={kw}
                onClick={() => setSearch(kw)}
                className="px-2.5 py-[3px] text-[11px] text-[#777] bg-white cursor-pointer transition-colors hover:bg-[#f5f5f5]"
                style={{
                  borderRadius: "9999px",
                  boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px",
                }}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Banner carousel */}
        <div className="flex-1 min-w-0">
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: "16px" }}
          >
            {/* Slides */}
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${carouselIdx * 100}%)` }}
            >
              {bannerSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="w-full shrink-0 px-7 py-8 flex flex-col justify-between"
                  style={{
                    minHeight: "200px",
                    backgroundColor: "#fff",
                    boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px",
                  }}
                >
                  <div>
                    <span
                      className="inline-block px-2 py-0.5 text-[10px] font-medium text-[#777169] mb-3"
                      style={{ borderRadius: "9999px", backgroundColor: "rgba(245,242,239,0.8)" }}
                    >
                      {slide.badge}
                    </span>
                    <h3 className="text-[18px] font-semibold mb-1" style={{ letterSpacing: "-0.2px" }}>
                      {slide.title}
                    </h3>
                    <p className="text-[13px] text-[#777169]" style={{ letterSpacing: "0.14px" }}>
                      {slide.desc}
                    </p>
                  </div>
                  <button className="self-start mt-4 px-4 py-[6px] text-[12px] font-medium text-[#000] bg-[#f5f5f5] cursor-pointer transition-colors hover:bg-[#ebebeb]" style={{ borderRadius: "9999px" }}>
                    {slide.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
              {bannerSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  className="cursor-pointer transition-all"
                  style={{
                    width: carouselIdx === i ? "16px" : "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: carouselIdx === i ? "#000" : "rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SEC 1: 자주 구매하는 상품 ═══ */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} strokeWidth={1.5} color="#777" />
            <h3 className="text-[16px] font-semibold">자주 구매하는 상품</h3>
          </div>
          <div className="flex items-center gap-1 bg-[#f5f5f5] p-[3px]" style={{ borderRadius: "8px" }}>
            {(["전체", "매주", "격주", "매월"] as const).map((f) => {
              const active = freqFilter === f;
              return (
                <button key={f} onClick={() => setFreqFilter(f)} className="px-3 py-[4px] text-[12px] cursor-pointer transition-all" style={{ borderRadius: "6px", backgroundColor: active ? "#fff" : "transparent", color: active ? "#000" : "#777", fontWeight: active ? 500 : 400, boxShadow: active ? "rgba(0,0,0,0.06) 0px 1px 2px" : "none" }}>
                  {f}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {freqProducts.map((p) => {
            const freqLabel = p.purchaseFrequency === "weekly" ? "매주" : p.purchaseFrequency === "biweekly" ? "격주" : "매월";
            return (
              <button key={p.id} onClick={() => onView(p)} className="flex flex-col items-center p-3 bg-white cursor-pointer transition-all hover:translate-y-[-2px]" style={{ borderRadius: "14px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}>
                <div className="w-full h-[80px] bg-[#f5f5f5] flex items-center justify-center text-[10px] text-[#999] mb-2" style={{ borderRadius: "10px" }}>{p.brand}</div>
                <p className="text-[12px] font-medium text-center line-clamp-2 leading-tight mb-1">{p.name}</p>
                <p className="text-[13px] font-semibold">{formatPrice(p.price)}</p>
                <span className="mt-1.5 px-2 py-0.5 text-[10px] font-medium text-[#3b82f6] bg-[#eff6ff]" style={{ borderRadius: "9999px" }}>{freqLabel}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══ SEC 2: 업종별 상품탐색 (홈 미니) ═══ */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-semibold">로랩스와 비슷한 업종의 고객들이 구매하는 상품</h3>
            <p className="text-[12px] text-[#999] mt-0.5">업종별 인기 상품을 확인하세요</p>
          </div>
          <button onClick={() => setActiveTab("업종별 탐색")} className="text-[13px] text-[#777] cursor-pointer hover:text-[#000] transition-colors">
            전체보기 <ChevronRight size={14} strokeWidth={1.5} className="inline -mt-0.5" />
          </button>
        </div>
        <div className="flex gap-4" style={{ minHeight: "500px" }}>
          {/* Left: industry sidebar */}
          <div className="w-[110px] shrink-0 flex flex-col gap-1">
            {industryTypes.map((ind) => {
              const active = selectedIndustry === ind.id;
              return (
                <button key={ind.id} onClick={() => { setSelectedIndustry(ind.id); setIndSubCat("전체"); }} className="flex flex-col items-center gap-1 py-3 cursor-pointer transition-all" style={{ borderRadius: "12px", backgroundColor: active ? "#fff" : "transparent", boxShadow: active ? "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" : "none" }}>
                  <span className="text-[20px]">{ind.emoji}</span>
                  <span className="text-[11px] font-medium text-center leading-tight px-1" style={{ color: active ? "#000" : "#777" }}>{ind.name}</span>
                </button>
              );
            })}
          </div>
          {/* Right: products */}
          <div className="flex-1 min-w-0">
            {(() => {
              const ind = industryTypes.find((i) => i.id === selectedIndustry);
              if (!ind) return null;
              const indProducts = ind.productIds.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p);
              const indCats = [...new Set(indProducts.map((p) => p.category))];
              const filteredInd = indSubCat === "전체" ? indProducts : indProducts.filter((p) => p.category === indSubCat);
              return (
                <>
                  {/* Category tabs */}
                  <div className="flex items-center gap-1 mb-3 flex-wrap">
                    {["전체", ...indCats].map((cat) => (
                      <button key={cat} onClick={() => setIndSubCat(cat)} className="px-3 py-[5px] text-[12px] cursor-pointer transition-all" style={{ borderRadius: "9999px", backgroundColor: indSubCat === cat ? "#000" : "#f5f5f5", color: indSubCat === cat ? "#fff" : "#777", fontWeight: indSubCat === cat ? 500 : 400 }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  {/* Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {filteredInd.map((p) => (
                      <ProductCard key={p.id} product={p} onView={onView} onAddToCart={onAddToCart} />
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ═══ SEC 3: 카테고리 BEST ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} strokeWidth={1.5} color="#777" />
          <h3 className="text-[16px] font-semibold">카테고리 BEST</h3>
        </div>
        <div className="flex items-center gap-1 mb-4">
          {["전체", ...categories].map((cat) => (
            <button key={cat} onClick={() => setBestCategory(cat)} className="px-3 py-[5px] text-[12px] cursor-pointer transition-all" style={{ borderRadius: "9999px", backgroundColor: bestCategory === cat ? "#000" : "#f5f5f5", color: bestCategory === cat ? "#fff" : "#777", fontWeight: bestCategory === cat ? 500 : 400 }}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3">
          {bestProducts.map((p, i) => (
            <button key={p.id} onClick={() => onView(p)} className="relative flex flex-col items-center p-3 bg-white text-center cursor-pointer transition-all hover:translate-y-[-2px]" style={{ borderRadius: "14px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px" }}>
              {/* Rank badge */}
              <span className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center text-[11px] font-semibold rounded-md" style={{ backgroundColor: i < 3 ? "#000" : "#f5f5f5", color: i < 3 ? "#fff" : "#777" }}>{i + 1}</span>
              <div className="w-full h-[80px] bg-[#f5f5f5] flex items-center justify-center text-[10px] text-[#999] mb-2 mt-2" style={{ borderRadius: "10px" }}>{p.brand}</div>
              <p className="text-[12px] font-medium line-clamp-2 leading-tight mb-1">{p.name}</p>
              <p className="text-[13px] font-semibold">{formatPrice(p.price)}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ═══ SEC 4: 브랜드 모아보기 ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} strokeWidth={1.5} color="#777" />
          <h3 className="text-[16px] font-semibold">브랜드 모아보기</h3>
        </div>
        <div className="relative">
          <div className="flex items-center gap-5 overflow-x-auto pb-2 px-1" style={{ scrollBehavior: "smooth" }}>
            {brandList.map((b) => (
              <button key={b.name} onClick={() => setSearch(b.name)} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[18px] font-semibold text-[#777] transition-all group-hover:bg-[#ebebeb] group-hover:scale-105" style={{ boxShadow: "rgba(0,0,0,0.04) 0px 1px 2px" }}>
                  {b.initial}
                </div>
                <span className="text-[11px] text-[#777] group-hover:text-[#000] transition-colors">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEC 5: 간식 패키지 CTA 배너 ═══ */}
      <section>
        <div
          className="flex items-center justify-between px-8 py-8 overflow-hidden"
          style={{
            borderRadius: "20px",
            backgroundColor: "rgba(245,242,239,0.8)",
            boxShadow: "rgba(78,50,23,0.04) 0px 6px 16px",
          }}
        >
          <div className="max-w-[400px]">
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium text-[#777] bg-white mb-3" style={{ borderRadius: "9999px" }}>간식 패키지</span>
            <h3 className="text-[20px] font-semibold mb-2" style={{ letterSpacing: "-0.3px" }}>
              간식 고민, 3분이면 끝
            </h3>
            <p className="text-[14px] text-[#777169] mb-5" style={{ letterSpacing: "0.14px" }}>
              회사 인원과 예산만 입력하면 AI가 맞춤 간식 세트를 추천해드립니다. 25종 이상, 87% 만족도.
            </p>
            <button onClick={() => setActiveTab("간식 패키지")} className="px-5 py-[9px] text-[14px] font-medium text-white bg-[#000] cursor-pointer transition-opacity hover:opacity-80" style={{ borderRadius: "9999px", boxShadow: "rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px" }}>
              간식 세트 만들기 →
            </button>
          </div>
          <div className="flex items-center gap-3 text-[40px] opacity-60 select-none">
            <span>🍪</span><span>☕</span><span>🥤</span><span>🍫</span>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ═══════════════════════════════
   간식 패키지 탭
   ═══════════════════════════════ */

function SnackPackageTab() {
  return (
    <div className="flex flex-col items-center pt-12">
      <div className="w-16 h-16 rounded-2xl bg-[#f5f5f5] flex items-center justify-center mb-4">
        <Cookie size={28} strokeWidth={1.2} color="#bbb" />
      </div>
      <h2 className="text-[20px] font-semibold mb-2">간식 패키지</h2>
      <p className="text-[14px] text-[#777] text-center leading-[1.6] max-w-[400px] mb-4">
        회사 인원과 예산에 맞는 간식 세트를 AI가 추천해드립니다.<br />
        카테고리 비율 조정부터 상품 교체까지 한 번에.
      </p>
      <PlannedTooltip description="간식 패키지 빌더" position="bottom">
        <button className="px-6 py-[10px] text-[14px] font-medium text-white bg-black rounded-full cursor-pointer transition-opacity hover:opacity-80">
          <Sparkles size={15} strokeWidth={1.5} className="inline mr-1.5 -mt-0.5" />
          간식 세트 만들기
        </button>
      </PlannedTooltip>
      <p className="text-[12px] text-[#bbb] mt-6">3분이면 완성 · 25종 이상 · 87% 만족도</p>
    </div>
  );
}

/* ═══════════════════════════════
   업종별 탐색 탭
   ═══════════════════════════════ */

function IndustryBrowseTab({ onView, onAddToCart }: { onView: (p: Product) => void; onAddToCart: (p: Product) => void }) {
  const [selectedIndustry, setSelectedIndustry] = useState("it-office");
  const [subCategory, setSubCategory] = useState("전체");

  const filteredProducts = useMemo(() => {
    const ind = industryTypes.find((i) => i.id === selectedIndustry);
    const indProducts = ind ? ind.productIds.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p) : products;
    if (subCategory === "전체") return indProducts;
    return indProducts.filter((p) => p.category === subCategory);
  }, [subCategory, selectedIndustry]);

  return (
    <div className="flex gap-6">
      {/* Sidebar tree */}
      <div className="w-[200px] shrink-0">
        <p className="text-[11px] font-medium text-[#999] uppercase tracking-wider mb-2 px-2">업종 선택</p>
        <div className="flex flex-col gap-0.5">
          {industryTypes.map((ind) => {
            const active = selectedIndustry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className="flex items-center gap-2.5 px-3 py-[8px] rounded-lg text-[13px] cursor-pointer transition-all hover:bg-[#f5f5f5] text-left"
                style={{
                  backgroundColor: active ? "#f0f0f0" : "transparent",
                  color: active ? "#111" : "#777",
                  fontWeight: active ? 500 : 400,
                }}
              >
                <span className="text-[16px]">{ind.emoji}</span>
                {ind.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product pane */}
      <div className="flex-1">
        <h3 className="text-[16px] font-semibold mb-1">
          {industryTypes.find((i) => i.id === selectedIndustry)?.name} 추천 상품
        </h3>
        <p className="text-[13px] text-[#777] mb-4">이 업종에서 자주 구매하는 상품입니다</p>

        {/* Subcategory chips */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {["전체", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSubCategory(cat)}
              className="px-3 py-[5px] text-[12px] cursor-pointer transition-all"
              style={{
                borderRadius: "9999px",
                backgroundColor: subCategory === cat ? "#000" : "#f5f5f5",
                color: subCategory === cat ? "#fff" : "#777",
                fontWeight: subCategory === cat ? 500 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onView={onView} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   기획전 탭
   ═══════════════════════════════ */

function PromotionsTab({ onView, onAddToCart }: { onView: (p: Product) => void; onAddToCart: (p: Product) => void }) {
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);

  if (selectedPromo) {
    const promo = promos.find((p) => p.id === selectedPromo);
    if (!promo) return null;
    return (
      <div>
        <button
          onClick={() => setSelectedPromo(null)}
          className="flex items-center gap-1 text-[13px] text-[#777] cursor-pointer hover:text-[#444] mb-6"
        >
          ← 기획전 목록으로
        </button>
        <div className="px-6 py-8 mb-6" style={{ borderRadius: "16px", backgroundColor: "#f5f2ef" }}>
          <span className="inline-block px-2 py-0.5 text-[11px] font-medium text-[#777] bg-white rounded-full mb-2">{promo.tag}</span>
          <h2 className="text-[22px] font-semibold mb-1">{promo.name}</h2>
          <p className="text-[14px] text-[#777]">{promo.desc} · {promo.period}</p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {products.slice(0, promo.count).map((p) => (
            <ProductCard key={p.id} product={p} onView={onView} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[18px] font-semibold mb-1">기획전</h2>
      <p className="text-[13px] text-[#777] mb-5">브랜드별 특별 할인가 기획전. 수시 업데이트됩니다.</p>
      <div className="grid grid-cols-2 gap-4">
        {promos.map((promo) => (
          <button
            key={promo.id}
            onClick={() => setSelectedPromo(promo.id)}
            className="text-left overflow-hidden bg-white cursor-pointer transition-all hover:translate-y-[-2px]"
            style={{ borderRadius: "16px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px" }}
          >
            <div className="px-5 py-5" style={{ backgroundColor: "#f5f2ef" }}>
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-[#777] bg-white rounded-full mb-2">{promo.tag}</span>
              <h3 className="text-[16px] font-semibold mb-0.5">{promo.name}</h3>
              <p className="text-[12px] text-[#777]">{promo.desc}</p>
              <p className="flex items-center gap-1 text-[12px] text-[#444] font-medium mt-2">
                상품 {promo.count}개 보기 <ChevronRight size={12} strokeWidth={1.5} />
              </p>
            </div>
            <div className="px-5 py-3 flex items-center justify-between text-[11px] text-[#999]">
              <span>{promo.period}</span>
              <span>{promo.count}개 상품</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
