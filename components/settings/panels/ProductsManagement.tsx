"use client";

import { products } from "@/data/products";
import { folders } from "@/data/folders";
import Table, { type Column } from "@/components/ui/Table";
import type { Product } from "@/lib/types";
import { PlannedTooltip } from "@/components/ui/Tooltip";

function formatPrice(n: number) { return n.toLocaleString("ko-KR") + "원"; }

function getFolder(productId: string) {
  const f = folders.find((f) => f.productIds.includes(productId));
  return f?.name ?? "—";
}

export default function ProductsManagement() {
  const columns: Column<Product>[] = [
    { key: "name", header: "상품명", render: (r) => <span className="font-medium truncate block max-w-[200px]">{r.name}</span> },
    { key: "category", header: "카테고리", width: "90px" },
    { key: "price", header: "가격", width: "100px", render: (r) => formatPrice(r.price) },
    { key: "brand", header: "브랜드", width: "80px" },
    { key: "folder", header: "폴더", width: "100px", render: (r) => <span className="text-[#777]">{getFolder(r.id)}</span> },
  ];

  return (
    <div className="max-w-[640px]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-semibold">전체 상품 관리</h2>
        <PlannedTooltip description="상품 등록">
          <button className="px-4 py-[7px] text-[13px] font-medium text-[#4e4e4e] bg-[#f5f5f5] rounded-lg cursor-pointer hover:bg-[#ebebeb]">+ 상품 등록</button>
        </PlannedTooltip>
      </div>
      <Table columns={columns} data={products} rowKey={(r) => r.id} />
    </div>
  );
}
