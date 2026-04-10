"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { ChevronLeft, ShoppingCart, FolderPlus, MessageSquare, Check } from "lucide-react";
import { products } from "@/data/products";
import { folders } from "@/data/folders";

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [folderOpen, setFolderOpen] = useState(false);

  const product = products.find((p) => p.id === params.productId);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[14px] text-[#777]">상품을 찾을 수 없습니다</p>
      </div>
    );
  }

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

      <div className="max-w-[720px] mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => router.push("/store")}
          className="flex items-center gap-1 text-[13px] text-[#777] cursor-pointer hover:text-[#444] transition-colors mb-6"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          스토어로 돌아가기
        </button>

        <div className="flex gap-8">
          {/* Image */}
          <div
            className="w-[320px] h-[320px] shrink-0 bg-[#f5f5f5] flex items-center justify-center text-[14px] text-[#999]"
            style={{ borderRadius: "16px" }}
          >
            {product.brand} · {product.category}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-[#999] mb-1">{product.brand}</p>
            <h1 className="text-[20px] font-semibold mb-2" style={{ letterSpacing: "-0.2px" }}>
              {product.name}
            </h1>
            <p className="text-[24px] font-semibold mb-4">{formatPrice(product.price)}</p>

            <p className="text-[14px] text-[#4e4e4e] leading-[1.7] mb-6" style={{ letterSpacing: "0.14px" }}>
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2 mb-6">
              <button
                onClick={() => showToast("장바구니에 담겼습니다")}
                className="flex items-center justify-center gap-2 w-full py-[10px] text-[14px] font-medium text-white bg-black rounded-xl cursor-pointer transition-opacity hover:opacity-80"
              >
                <ShoppingCart size={16} strokeWidth={1.5} />
                장바구니에 담기
              </button>

              <div className="relative">
                <button
                  onClick={() => setFolderOpen(!folderOpen)}
                  className="flex items-center justify-center gap-2 w-full py-[10px] text-[14px] font-medium text-[#4e4e4e] bg-[#f5f5f5] rounded-xl cursor-pointer transition-colors hover:bg-[#ebebeb]"
                >
                  <FolderPlus size={16} strokeWidth={1.5} />
                  회사 상품폴더에 담기
                </button>
                {folderOpen && (
                  <div
                    className="absolute top-full mt-1 left-0 right-0 bg-white py-1 z-50"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 8px",
                    }}
                  >
                    {folders.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setFolderOpen(false);
                          showToast(`${f.name} 폴더에 추가되었습니다`);
                        }}
                        className="block w-full text-left px-4 py-2 text-[13px] text-[#444] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  showToast("채팅으로 이동합니다");
                  setTimeout(() => router.push("/chat"), 800);
                }}
                className="flex items-center justify-center gap-2 w-full py-[10px] text-[14px] font-medium text-[#777] cursor-pointer transition-colors hover:text-[#444]"
              >
                <MessageSquare size={16} strokeWidth={1.5} />
                채팅으로 문의하기
              </button>
            </div>
          </div>
        </div>

        {/* Specs table */}
        <div className="mt-8">
          <h2 className="text-[15px] font-semibold mb-3">상세 스펙</h2>
          <div
            className="overflow-hidden"
            style={{ borderRadius: "12px", boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px" }}
          >
            {Object.entries(product.specs).map(([key, value], i) => (
              <div
                key={key}
                className="flex px-4 py-3 text-[14px]"
                style={{
                  backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                  borderBottom: i < Object.entries(product.specs).length - 1 ? "1px solid rgba(0,0,0,0.04)" : undefined,
                }}
              >
                <span className="w-[120px] shrink-0 text-[#777]">{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
