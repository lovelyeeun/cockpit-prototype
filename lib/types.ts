/* ============================================
   Cockpit — 전체 타입 정의
   ============================================ */

/* ─── 상품 ─── */
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  brand: string;
  image: string;
  description: string;
  specs: Record<string, string>;
  inStock: boolean;
  purchaseFrequency?: "weekly" | "biweekly" | "monthly";
}

export type ProductCategory =
  | "용지"
  | "잉크/토너"
  | "사무기기"
  | "가구"
  | "전자기기"
  | "사무용품"
  | "생활용품";

/* ─── 주문 ─── */
export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  orderedBy: string;
  orderedAt: string;       // ISO date
  deliveryDate: string;    // ISO date (예정/완료)
  approvedBy?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  note?: string;
  isRecurring?: boolean;   // 정기구매 여부
}

export type OrderStatus =
  | "승인대기"
  | "승인완료"
  | "결제완료"
  | "배송준비"
  | "배송중"
  | "배송완료"
  | "구매확정"
  | "반품요청"
  | "반려";

/* ─── 채팅 ─── */
export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;       // ISO datetime
  status: ChatStatus;
  tags: string[];
  messages: ChatMessage[];
}

export type ChatStatus = "진행중" | "완료" | "대기";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;       // ISO datetime
  agent?: string;          // 자동 호출된 에이전트 (주문, 배송, 권한 등)
  productIds?: string[];   // 상품 추천 시 포함되는 상품 ID 목록
}

/* ─── 폴더 ─── */
export interface Folder {
  id: string;
  name: string;
  icon: string;          // lucide icon name hint
  productIds: string[];
  description?: string;
}

/* ─── 공급기업 ─── */
export interface Company {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  contractStatus: ContractStatus;
  rating: number;          // 1-5
  transactionCount: number;
  lastTransaction?: string; // ISO date
  note?: string;
}

export type ContractStatus = "계약중" | "계약만료" | "협상중" | "미계약";

/* ─── 지출 ─── */
export interface Expense {
  id: string;
  date: string;            // ISO date
  category: ProductCategory;
  team: string;
  amount: number;
  productName: string;
  orderId?: string;
}

/* ─── RFQ ─── */
export interface RFQ {
  id: string;
  companyId: string;
  companyName: string;
  items: { name: string; quantity: number; unitPrice?: number }[];
  deliveryDate?: string;
  paymentTerms?: string;
  note?: string;
  status: "작성중" | "발송완료" | "회신대기" | "계약진행";
  createdAt: string;
  sentAt?: string;
}

/* ─── 사용자/팀원 ─── */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  permissions: UserPermissions;
  joinedAt: string;        // ISO date
}

export type UserRole = "관리자" | "매니저" | "구매담당" | "일반";

export interface UserPermissions {
  menuAccess: string[];
  canApprove: boolean;
  canPurchase: boolean;
  purchaseLimit: number;   // 원, 0 = 무제한
  aiRestricted: boolean;
}
