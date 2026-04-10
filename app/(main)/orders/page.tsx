"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { orders } from "@/data/orders";
import { users, currentUser } from "@/data/users";
import type { Order, OrderStatus } from "@/lib/types";
import { useRightPanel } from "@/lib/right-panel-context";
import Calendar from "@/components/ui/Calendar";
import Table, { type Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import OrderDetailPanel from "./OrderDetailPanel";

/* ─── Helpers ─── */

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function userName(id: string) {
  return users.find((u) => u.id === id)?.name ?? id;
}

type BadgeStatus = "완료" | "대기" | "진행중" | "반려";

function statusToBadge(s: OrderStatus): BadgeStatus {
  if (s === "구매확정" || s === "배송완료") return "완료";
  if (s === "승인대기") return "대기";
  if (s === "반려" || s === "반품요청") return "반려";
  return "진행중";
}

const statusColor: Record<string, string> = {
  "승인대기": "#f59e0b", "승인완료": "#3b82f6", "결제완료": "#3b82f6",
  "배송준비": "#3b82f6", "배송중": "#3b82f6", "배송완료": "#22c55e",
  "구매확정": "#22c55e", "반품요청": "#ef4444", "반려": "#ef4444",
};

/* ─── Tabs ─── */

type Tab = "내 주문" | "회사 주문" | "구매요청";
const tabs: Tab[] = ["내 주문", "회사 주문", "구매요청"];

/* ─── Component ─── */

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("내 주문");

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[880px] mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-[20px] font-semibold mb-5" style={{ letterSpacing: "-0.2px" }}>
          주문내역
        </h1>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-[6px] text-[13px] font-medium cursor-pointer transition-all"
              style={{
                borderRadius: "9999px",
                backgroundColor: activeTab === tab ? "#000" : "#f5f5f5",
                color: activeTab === tab ? "#fff" : "#777169",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "내 주문" && <MyOrdersTab />}
        {activeTab === "회사 주문" && <CompanyOrdersTab />}
        {activeTab === "구매요청" && <PurchaseRequestsTab />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   내 주문 탭 (C-3)
   ═══════════════════════════════ */

function MyOrdersTab() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { openPanel } = useRightPanel();

  const myOrders = orders.filter((o) => o.orderedBy === currentUser.id);

  const calendarEvents = myOrders.map((o) => ({
    date: o.deliveryDate,
    label: o.productName,
    color: statusColor[o.status] ?? "#3b82f6",
  }));

  const dateOrders = selectedDate
    ? myOrders.filter((o) => o.deliveryDate === selectedDate)
    : [];

  const handleOrderClick = useCallback((order: Order) => {
    openPanel(<OrderDetailPanel order={order} />);
  }, [openPanel]);

  return (
    <div className="flex gap-6">
      {/* Calendar */}
      <div
        className="w-[320px] shrink-0 bg-white p-4"
        style={{
          borderRadius: "16px",
          boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px",
        }}
      >
        <Calendar events={calendarEvents} onDateClick={setSelectedDate} />
      </div>

      {/* Orders for selected date */}
      <div className="flex-1 min-w-0">
        {selectedDate ? (
          <>
            <p className="text-[14px] font-medium mb-3">
              {selectedDate.replace(/-/g, ".")} 배송 예정
              {dateOrders.length > 0 && (
                <span className="text-[#777169] font-normal ml-1.5">
                  {dateOrders.length}건
                </span>
              )}
            </p>
            {dateOrders.length === 0 ? (
              <p className="text-[13px] text-[#777169]">해당 날짜에 주문이 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {dateOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onClick={() => handleOrderClick(order)} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-[13px] text-[#777169]">캘린더에서 날짜를 선택하세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Order card (for calendar view) ─── */

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3.5 bg-white text-left cursor-pointer transition-all hover:translate-y-[-1px]"
      style={{
        borderRadius: "12px",
        boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 1px 2px",
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[14px] font-medium truncate">{order.productName}</p>
          <Badge status={statusToBadge(order.status)} />
        </div>
        <p className="text-[12px] text-[#777169]" style={{ letterSpacing: "0.14px" }}>
          {order.quantity}개 · {formatPrice(order.totalPrice)} · {order.orderedAt}
        </p>
        {order.note && (
          <p className="text-[11px] text-[#999] mt-1 truncate">{order.note}</p>
        )}
      </div>
    </button>
  );
}

/* ═══════════════════════════════
   회사 주문 탭 (C-5 + C-11)
   ═══════════════════════════════ */

function CompanyOrdersTab() {
  const [filter, setFilter] = useState<string>("전체");
  const [subTab, setSubTab] = useState<"일반" | "정기구매">("일반");
  const { openPanel } = useRightPanel();

  const filtered = useMemo(() => {
    let list = subTab === "정기구매"
      ? orders.filter((o) => o.isRecurring)
      : orders.filter((o) => !o.isRecurring);

    if (filter !== "전체") {
      const filterMap: Record<string, OrderStatus[]> = {
        "승인대기": ["승인대기"],
        "배송중": ["배송준비", "배송중"],
        "완료": ["배송완료", "구매확정"],
      };
      const statuses = filterMap[filter];
      if (statuses) list = list.filter((o) => statuses.includes(o.status));
    }
    return list;
  }, [filter, subTab]);

  const columns: Column<Order>[] = [
    { key: "id", header: "주문번호", width: "100px" },
    { key: "productName", header: "상품명", render: (r) => (
      <span className="truncate block max-w-[200px]">{r.productName}</span>
    )},
    { key: "orderedBy", header: "주문자", width: "80px", render: (r) => userName(r.orderedBy) },
    { key: "totalPrice", header: "금액", width: "110px", render: (r) => formatPrice(r.totalPrice) },
    { key: "status", header: "상태", width: "90px", render: (r) => <Badge status={statusToBadge(r.status)} /> },
    { key: "orderedAt", header: "주문일", width: "100px" },
  ];

  return (
    <div>
      {/* Sub tabs + filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {(["일반", "정기구매"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className="px-3 py-[5px] text-[12px] font-medium cursor-pointer transition-all"
              style={{
                borderRadius: "6px",
                backgroundColor: subTab === t ? "#f0f0f0" : "transparent",
                color: subTab === t ? "#111" : "#777169",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[13px] px-3 py-[5px] bg-white cursor-pointer"
          style={{
            borderRadius: "8px",
            boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px",
            border: "none",
            outline: "none",
          }}
        >
          <option>전체</option>
          <option>승인대기</option>
          <option>배송중</option>
          <option>완료</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={filtered}
        rowKey={(r) => r.id}
        onRowClick={(r) => openPanel(<OrderDetailPanel order={r} />)}
        emptyMessage="주문이 없습니다"
      />
    </div>
  );
}

/* ═══════════════════════════════
   구매요청 탭 (C-10)
   ═══════════════════════════════ */

function PurchaseRequestsTab() {
  const [filter, setFilter] = useState<string>("전체");
  const { openPanel } = useRightPanel();

  const requests = useMemo(() => {
    const base = orders.filter((o) => ["승인대기", "승인완료", "반려"].includes(o.status));
    if (filter === "전체") return base;
    return base.filter((o) => o.status === filter);
  }, [filter]);

  const columns: Column<Order>[] = [
    { key: "id", header: "요청번호", width: "100px" },
    { key: "productName", header: "상품", render: (r) => (
      <span className="truncate block max-w-[200px]">{r.productName}</span>
    )},
    { key: "orderedBy", header: "요청자", width: "80px", render: (r) => userName(r.orderedBy) },
    { key: "totalPrice", header: "금액", width: "110px", render: (r) => formatPrice(r.totalPrice) },
    { key: "status", header: "상태", width: "90px", render: (r) => <Badge status={statusToBadge(r.status)} /> },
    { key: "orderedAt", header: "요청일", width: "100px" },
  ];

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[13px] px-3 py-[5px] bg-white cursor-pointer"
          style={{
            borderRadius: "8px",
            boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px",
            border: "none",
            outline: "none",
          }}
        >
          <option>전체</option>
          <option>승인대기</option>
          <option>승인완료</option>
          <option>반려</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={requests}
        rowKey={(r) => r.id}
        onRowClick={(r) => openPanel(<OrderDetailPanel order={r} />)}
        emptyMessage="구매요청이 없습니다"
      />
    </div>
  );
}
