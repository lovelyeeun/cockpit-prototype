/* ─── Industry types for store browse ─── */

export interface IndustryType {
  id: string;
  name: string;
  emoji: string;
  categories: string[];
  /** Product IDs recommended for this industry */
  productIds: string[];
}

export const industryTypes: IndustryType[] = [
  {
    id: "food",
    name: "음식료형",
    emoji: "🍽",
    categories: ["생활용품", "사무용품"],
    productIds: ["prod-009", "prod-012", "prod-007", "prod-001", "prod-006"],
  },
  {
    id: "space",
    name: "공간운영형",
    emoji: "🏢",
    categories: ["가구", "생활용품", "전자기기"],
    productIds: ["prod-004", "prod-010", "prod-009", "prod-005", "prod-012"],
  },
  {
    id: "it-office",
    name: "IT오피스형",
    emoji: "💻",
    categories: ["전자기기", "사무기기", "사무용품", "용지"],
    productIds: ["prod-005", "prod-008", "prod-011", "prod-001", "prod-002", "prod-003", "prod-006", "prod-007"],
  },
  {
    id: "manufacturing",
    name: "제조/하드웨어형",
    emoji: "🏭",
    categories: ["사무기기", "전자기기", "용지"],
    productIds: ["prod-003", "prod-011", "prod-001", "prod-005", "prod-002"],
  },
  {
    id: "ecommerce",
    name: "이커머스/유통형",
    emoji: "📦",
    categories: ["사무용품", "용지", "잉크/토너"],
    productIds: ["prod-001", "prod-002", "prod-007", "prod-006", "prod-011"],
  },
  {
    id: "professional",
    name: "전문서비스형",
    emoji: "⚖",
    categories: ["용지", "사무용품", "가구"],
    productIds: ["prod-001", "prod-006", "prod-004", "prod-010", "prod-007"],
  },
  {
    id: "creative",
    name: "크리에이티브형",
    emoji: "🎨",
    categories: ["전자기기", "사무용품", "가구"],
    productIds: ["prod-005", "prod-008", "prod-006", "prod-004", "prod-010"],
  },
];
