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

export const paymentMethods = [
  { id: "pay-1", type: "card" as const, issuer: "신한카드", number: "****-****-****-1234", alias: "경영지원 법인카드", isDefault: true },
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
