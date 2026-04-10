"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderPlus, Check } from "lucide-react";
import { products } from "@/data/products";
import { folders } from "@/data/folders";
import type { Product, ProductCategory } from "@/lib/types";
import ProductCard from "@/components/commerce/ProductCard";
import { useRightPanel } from "@/lib/right-panel-context";
import ProductDetailPanel from "@/components/chat/ProductDetailPanel";

/* ─── Filter options ─── */

const categories: ProductCategory[] = ["용지", "잉크/토너", "사무기기", "가구", "전자기기", "사무용품", "생활용품"];
const brands = [...new Set(products.map((p) => p.brand))];

/* ─── Component ─── */

export default function StorePage() {
  const router = useRouter();
  const { openPanel } = useRightPanel();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedBrand, setSelectedBrand] = useState<string>("전체");
  const [toast, setToast] = useState<string | null>(null);
  const [folderDropdown, setFolderDropdown] = useState<string | null>(null); // productId

  const filtered = useMemo(() => {
    let list = products;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (selectedCategory !== "전체") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedBrand !== "전체") {
      list = list.filter((p) => p.brand === selectedBrand);
    }
    return list;
  }, [search, selectedCategory, selectedBrand]);

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

  const handleAddToFolder = useCallback((productId: string, folderName: string) => {
    setFolderDropdown(null);
    showToast(`${folderName} 폴더에 추가되었습니다`);
  }, [showToast]);

  return (
    <div className="h-full overflow-y-auto relative">
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white text-[13px] font-medium"
          style={{ borderRadius: "10px", boxShadow: "rgba(0,0,0,0.2) 0px 4px 12px" }}
        >
          <Check size={14} strokeWidth={2} />
          {toast}
        </div>
      )}

      <div className="max-w-[960px] mx-auto px-6 py-8">
        {/* Header + Search */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[20px] font-semibold" style={{ letterSpacing: "-0.2px" }}>
            소모품 스토어
          </h1>
          <div
            className="flex items-center gap-2 w-[280px] px-3 py-2 bg-white"
            style={{ borderRadius: "10px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
          >
            <Search size={15} strokeWidth={1.5} color="#999" />
            <input
              type="text"
              placeholder="상품 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-[13px] outline-none bg-transparent placeholder:text-[#999]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          {/* Category */}
          <div className="flex items-center gap-1">
            <span className="text-[12px] text-[#999] mr-1">카테고리</span>
            <button
              onClick={() => setSelectedCategory("전체")}
              className="px-2.5 py-[4px] text-[12px] cursor-pointer transition-all"
              style={{
                borderRadius: "6px",
                backgroundColor: selectedCategory === "전체" ? "#f0f0f0" : "transparent",
                color: selectedCategory === "전체" ? "#111" : "#777",
                fontWeight: selectedCategory === "전체" ? 500 : 400,
              }}
            >
              전체
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className="px-2.5 py-[4px] text-[12px] cursor-pointer transition-all"
                style={{
                  borderRadius: "6px",
                  backgroundColor: selectedCategory === c ? "#f0f0f0" : "transparent",
                  color: selectedCategory === c ? "#111" : "#777",
                  fontWeight: selectedCategory === c ? 500 : 400,
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Brand */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="text-[12px] px-2.5 py-[5px] bg-white cursor-pointer"
            style={{ borderRadius: "6px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px", border: "none", outline: "none" }}
          >
            <option>전체</option>
            {brands.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>

        {/* Results count */}
        <p className="text-[12px] text-[#999] mb-3">{filtered.length}개 상품</p>

        {/* Product grid */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onView={handleView}
                onAddToCart={handleAddToCart}
              />
              {/* Folder button */}
              <div className="relative mt-1.5 px-1">
                <button
                  onClick={() => setFolderDropdown(folderDropdown === product.id ? null : product.id)}
                  className="flex items-center gap-1 text-[11px] text-[#999] cursor-pointer hover:text-[#444] transition-colors"
                >
                  <FolderPlus size={12} strokeWidth={1.5} />
                  폴더에 담기
                </button>

                {/* Folder dropdown */}
                {folderDropdown === product.id && (
                  <div
                    className="absolute bottom-full mb-1 left-0 w-[160px] bg-white py-1 z-50"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 8px",
                    }}
                  >
                    {folders.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleAddToFolder(product.id, f.name)}
                        className="block w-full text-left px-3 py-1.5 text-[12px] text-[#444] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[14px] text-[#999]">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
