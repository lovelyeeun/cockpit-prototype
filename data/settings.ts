export const companySettings = {
  name: "주식회사 로랩스",
  registrationNumber: "123-45-67890",
  representative: "김원균",
  address: "서울특별시 강남구 테헤란로 152, 7층",
  industry: "소프트웨어 개발 및 공급",
};

export const shippingAddresses = [
  { id: "addr-1", name: "본사", address: "서울특별시 강남구 테헤란로 152, 7층", receiver: "박은서", phone: "02-555-1234", isDefault: true },
  { id: "addr-2", name: "물류센터", address: "경기도 김포시 양촌읍 황금로 100", receiver: "김태환", phone: "031-789-5678", isDefault: false },
];

export type PaymentMethodType = "card" | "bnpl" | "invoice";
export type BnplStatus = "inactive" | "reviewing" | "active";

export interface PaymentCard {
  id: string;
  type: "card";
  issuer: string;
  number: string;
  alias: string;
  isDefault: boolean;
}

export interface PaymentBnpl {
  id: string;
  type: "bnpl";
  name: string;
  monthlyLimit: number;
  status: BnplStatus;
}

export interface PaymentInvoice {
  id: string;
  type: "invoice";
  companyName: string;
  representative: string;
  registrationNumber: string;
  industryType: string;
  businessType: string;
  address: string;
  refundBank: string;
  refundAccountHolder: string;
  refundAccountNumber: string;
}

export type PaymentMethod = PaymentCard | PaymentBnpl | PaymentInvoice;

export const paymentMethods: PaymentMethod[] = [
  { id: "pay-1", type: "card", issuer: "신한카드", number: "****-****-****-1234", alias: "경영지원 법인카드", isDefault: true },
  { id: "pay-2", type: "card", issuer: "하나카드", number: "****-****-****-5678", alias: "마케팅 법인카드", isDefault: false },
  { id: "pay-3", type: "card", issuer: "우리카드", number: "****-****-****-9012", alias: "디자인팀 법인카드", isDefault: false },
  { id: "pay-4", type: "card", issuer: "KB국민카드", number: "****-****-****-3456", alias: "개발팀 법인카드", isDefault: false },
  { id: "pay-5", type: "invoice", companyName: "주식회사 로랩스", representative: "김원균", registrationNumber: "123-45-67890", industryType: "소프트웨어 개발", businessType: "서비스", address: "서울특별시 강남구 테헤란로 152, 7층", refundBank: "기업은행", refundAccountHolder: "주식회사 로랩스", refundAccountNumber: "123-456789-01-234" },
  { id: "pay-bnpl", type: "bnpl", name: "cockpit 후불결제", monthlyLimit: 50000000, status: "inactive" },
];

export const budgetSettings = {
  annualTotal: 120000000,
  monthlyLimit: 10000000,
  monthlyRemaining: 4300000,
  departments: [
    { name: "경영지원", annual: 36000000, used: 14200000 },
    { name: "마케팅", annual: 48000000, used: 22800000 },
    { name: "디자인", annual: 24000000, used: 11500000 },
    { name: "개발", annual: 12000000, used: 5100000 },
  ],
};

export const ruleSettings = {
  autoDescription: true,
  autoApproveLimit: 300000,
};
