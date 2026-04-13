export type UserRole = "purchaser" | "requester";

export interface HomeTask {
  id: string;
  title: string;
  meta: string;             // 상태/시간 보조 텍스트
  icon: "file-check" | "file-search" | "truck" | "repeat" | "calendar" | "bar-chart";
  prompt: string;           // 카드 클릭 시 채팅에 자동 전송될 프롬프트
  roles: UserRole[];
}

export interface Recommendation extends HomeTask {
  insight: string;          // 차별화: 데이터 기반 인사이트 1줄
}

/* ─── 활성 작업 ─── */
export const activeTasks: HomeTask[] = [
  {
    id: "at-1",
    title: "마케팅팀 노트북 3대 (₩4,200,000)",
    meta: "이진우 팀장 결재 대기 · 2시간 전",
    icon: "file-check",
    prompt: "마케팅팀 노트북 3대 결재 현황을 알려줘",
    roles: ["purchaser"],
  },
  {
    id: "at-2",
    title: "A4용지 대량 발주",
    meta: "3개 벤더 견적 수신 완료 · 비교 필요",
    icon: "file-search",
    prompt: "A4용지 벤더 3곳 견적을 비교해줘",
    roles: ["purchaser"],
  },
  {
    id: "at-3",
    title: "프린터 토너 20개",
    meta: "배송 중 · 내일 도착 예정",
    icon: "truck",
    prompt: "프린터 토너 배송 상태를 알려줘",
    roles: ["purchaser", "requester"],
  },
];

/* ─── 예정됨 ─── */
export const upcomingTasks: HomeTask[] = [
  {
    id: "up-1",
    title: "사무용품 월간 재주문",
    meta: "4월 20일(월) · 정기구매",
    icon: "repeat",
    prompt: "4월 사무용품 정기 재주문을 준비해줘",
    roles: ["purchaser"],
  },
  {
    id: "up-2",
    title: "OO 소프트웨어 연간 라이선스 갱신",
    meta: "D-14 · 갱신 협상 필요",
    icon: "calendar",
    prompt: "OO 소프트웨어 연간 라이선스 갱신 건을 확인해줘",
    roles: ["purchaser"],
  },
  {
    id: "up-3",
    title: "Q2 구매 예산 리뷰",
    meta: "4월 28일(화) · 경영지원 공유",
    icon: "bar-chart",
    prompt: "Q2 구매 예산 리뷰를 위해 1분기 실적을 정리해줘",
    roles: ["purchaser"],
  },
];

/* ─── 추천 작업 (AI 인사이트) ─── */
export const recommendedTasks: Recommendation[] = [
  {
    id: "rec-1",
    title: "토너 재주문 타이밍 앞당기기",
    meta: "재고 관리",
    insight: "지난달 대비 토너 사용량 30% 증가",
    icon: "bar-chart",
    prompt: "토너 사용량이 늘었어. 재주문 타이밍을 언제로 잡을지 추천해줘",
    roles: ["purchaser"],
  },
  {
    id: "rec-2",
    title: "A4용지 대안 벤더 추천받기",
    meta: "공급사 리스크",
    insight: "벤더 B가 최근 3회 배송 지연",
    icon: "truck",
    prompt: "A4용지 현재 벤더 B의 배송이 자주 지연돼. 대안 벤더를 추천해줘",
    roles: ["purchaser"],
  },
  {
    id: "rec-3",
    title: "Q1 마케팅팀 구매 패턴 분석 리포트",
    meta: "분석",
    insight: "부서별 지출 패턴 인사이트",
    icon: "file-search",
    prompt: "Q1 마케팅팀 구매 패턴 분석 리포트를 만들어줘",
    roles: ["purchaser"],
  },
];

/* ─── Helper ─── */
export function filterByRole<T extends HomeTask>(tasks: T[], role: UserRole): T[] {
  return tasks.filter((t) => t.roles.includes(role));
}
