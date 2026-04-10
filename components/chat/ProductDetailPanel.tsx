"use client";

import type { Product } from "@/lib/types";
import { ShoppingCart, Check } from "lucide-react";

interface ProductDetailPanelProps {
  product: Product;
  onAddToCart: () => void;
}

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function ProductDetailPanel({ product, onAddToCart }: ProductDetailPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Image placeholder */}
      <div
        className="w-full h-[200px] bg-[#f5f5f5] flex items-center justify-center text-[14px] text-[#777169]"
        style={{ borderRadius: "12px" }}
      >
        {product.brand} · {product.category}
      </div>

      {/* Info */}
      <div>
        <p className="text-[12px] text-[#777169] mb-1" style={{ letterSpacing: "0.14px" }}>
          {product.brand}
        </p>
        <h3 className="text-[16px] font-semibold leading-tight">
          {product.name}
        </h3>
        <p className="text-[20px] font-semibold mt-2">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Description */}
      <p className="text-[14px] text-[#4e4e4e] leading-[1.6]" style={{ letterSpacing: "0.14px" }}>
        {product.description}
      </p>

      {/* Specs */}
      <div>
        <p className="text-[12px] font-medium text-[#777169] uppercase tracking-wider mb-2">
          상세 스펙
        </p>
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "10px",
            boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px",
          }}
        >
          {Object.entries(product.specs).map(([key, value], i) => (
            <div
              key={key}
              className="flex px-3 py-2 text-[13px]"
              style={{
                backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                borderBottom: i < Object.entries(product.specs).length - 1 ? "1px solid rgba(0,0,0,0.05)" : undefined,
              }}
            >
              <span className="w-[90px] shrink-0 text-[#777169]">{key}</span>
              <span className="text-[#000]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stock badge */}
      <div className="flex items-center gap-1.5">
        <Check size={14} color="#22c55e" strokeWidth={2} />
        <span className="text-[13px] text-[#22c55e] font-medium">재고 있음</span>
      </div>

      {/* Add to cart button */}
      <button
        onClick={onAddToCart}
        className="flex items-center justify-center gap-2 w-full py-[11px] text-[14px] font-medium text-white bg-black rounded-xl cursor-pointer transition-opacity hover:opacity-80"
      >
        <ShoppingCart size={16} strokeWidth={1.5} />
        장바구니에 담기
      </button>
    </div>
  );
}
