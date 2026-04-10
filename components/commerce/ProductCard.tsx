"use client";

import type { Product } from "@/lib/types";
import { ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  compact?: boolean;
}

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function ProductCard({ product, onView, onAddToCart, compact = false }: ProductCardProps) {
  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-3 bg-white cursor-pointer transition-colors hover:bg-[#f9f9f9]"
        style={{
          borderRadius: "12px",
          boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px",
        }}
        onClick={() => onView?.(product)}
      >
        {/* Placeholder image */}
        <div
          className="w-12 h-12 shrink-0 bg-[#f5f5f5] flex items-center justify-center text-[10px] text-[#777169]"
          style={{ borderRadius: "8px" }}
        >
          {product.category}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium truncate">{product.name}</p>
          <p className="text-[13px] text-[#4e4e4e]">{formatPrice(product.price)}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white overflow-hidden"
      style={{
        borderRadius: "16px",
        boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px, rgba(0,0,0,0.04) 0px 2px 4px",
      }}
    >
      {/* Image placeholder */}
      <div className="w-full h-[140px] bg-[#f5f5f5] flex items-center justify-center text-[12px] text-[#777169]">
        {product.brand} · {product.category}
      </div>

      <div className="p-3.5">
        <p className="text-[11px] text-[#777169] mb-0.5" style={{ letterSpacing: "0.14px" }}>
          {product.brand}
        </p>
        <p className="text-[14px] font-medium leading-tight mb-1.5 line-clamp-2">
          {product.name}
        </p>
        <p className="text-[16px] font-semibold mb-3">
          {formatPrice(product.price)}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onView?.(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-[7px] text-[13px] font-medium text-[#4e4e4e] bg-[#f5f5f5] rounded-lg cursor-pointer transition-colors hover:bg-[#ebebeb]"
          >
            <Eye size={14} strokeWidth={1.5} />
            상세
          </button>
          <button
            onClick={() => onAddToCart?.(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-[7px] text-[13px] font-medium text-white bg-black rounded-lg cursor-pointer transition-opacity hover:opacity-80"
          >
            <ShoppingCart size={14} strokeWidth={1.5} />
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
