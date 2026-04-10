"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { ChevronLeft, TrendingDown, Users } from "lucide-react";
import { folders } from "@/data/folders";
import { products } from "@/data/products";
import type { Product } from "@/lib/types";
import { useRightPanel } from "@/lib/right-panel-context";
import ProductCard from "@/components/commerce/ProductCard";
import ProductDetailPanel from "@/components/chat/ProductDetailPanel";
import CartPanel, { type CartItem } from "@/components/commerce/CartPanel";

/* ─── Dummy insights per product ─── */

const insights: Record<string, { team: string; freq: string; benchmark: string }> = {
  "prod-001": { team: "마케팅팀", freq: "월 2회", benchmark: "동종업계 평균 대비 8% 저렴" },
  "prod-002": { team: "마케팅팀", freq: "분기 1회", benchmark: "동종업계 평균 대비 12% 저렴" },
  "prod-003": { team: "경영지원", freq: "연 1회", benchmark: "동종업계 평균가 수준" },
  "prod-004": { team: "디자인팀", freq: "분기 2회", benchmark: "동종업계 평균 대비 5% 저렴" },
  "prod-005": { team: "개발팀", freq: "월 1회", benchmark: "동종업계 평균 대비 15% 저렴" },
  "prod-006": { team: "디자인팀", freq: "월 1회", benchmark: "동종업계 평균가 수준" },
  "prod-007": { team: "전 부서", freq: "월 3회", benchmark: "동종업계 평균 대비 3% 저렴" },
  "prod-008": { team: "개발팀", freq: "분기 1회", benchmark: "동종업계 평균 대비 10% 저렴" },
  "prod-009": { team: "경영지원", freq: "월 렌탈", benchmark: "동종업계 평균 대비 7% 저렴" },
  "prod-010": { team: "개발팀", freq: "분기 1회", benchmark: "동종업계 평균 대비 12% 저렴" },
  "prod-011": { team: "경영지원", freq: "연 2회", benchmark: "동종업계 평균가 수준" },
  "prod-012": { team: "경영지원", freq: "분기 1회", benchmark: "동종업계 평균 대비 5% 저렴" },
};

export default function FolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { openPanel } = useRightPanel();

  const folderId = params.folderId as string;
  const folder = folders.find((f) => f.id === folderId);

  const folderProducts = folder
    ? folder.productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => !!p)
    : [];

  /* ── Cart (local to this page for simplicity) ── */

  const handleAddToCart = useCallback((product: Product) => {
    const item: CartItem = { product, quantity: 1 };
    openPanel(
      <CartPanel
        items={[item]}
        onUpdateQuantity={() => {}}
        onRemove={() => {}}
        onRequestApproval={() => router.push("/chat")}
        onDirectPurchase={() => router.push("/chat")}
      />
    );
  }, [openPanel, router]);

  const handleView = useCallback((product: Product) => {
    openPanel(
      <ProductDetailPanel
        product={product}
        onAddToCart={() => handleAddToCart(product)}
      />
    );
  }, [openPanel, handleAddToCart]);

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[14px] text-[#777169]">폴더를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/folders")}
            className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors hover:bg-[#f5f5f5]"
          >
            <ChevronLeft size={18} strokeWidth={1.5} color="#4e4e4e" />
          </button>
          <div>
            <h1 className="text-[20px] font-semibold" style={{ letterSpacing: "-0.2px" }}>
              {folder.name}
            </h1>
            <p className="text-[13px] text-[#777169]" style={{ letterSpacing: "0.14px" }}>
              {folder.description} · {folderProducts.length}개 상품
            </p>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {folderProducts.map((product) => {
            const insight = insights[product.id];
            return (
              <div key={product.id} className="flex flex-col">
                <ProductCard
                  product={product}
                  onView={handleView}
                  onAddToCart={handleAddToCart}
                />

                {/* Insights below card */}
                {insight && (
                  <div className="mt-2 flex flex-col gap-1 px-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#777169]" style={{ letterSpacing: "0.14px" }}>
                      <Users size={11} strokeWidth={1.5} />
                      <span>{insight.team}에서 {insight.freq} 주문</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#22c55e]" style={{ letterSpacing: "0.14px" }}>
                      <TrendingDown size={11} strokeWidth={1.5} />
                      <span>{insight.benchmark}</span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
