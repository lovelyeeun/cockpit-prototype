"use client";

import { useRouter } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { recommendedTasks, filterByRole, type UserRole } from "@/data/homeTasks";
import TaskCard from "./TaskCard";

interface Props {
  role: UserRole;
}

export default function RecommendedSection({ role }: Props) {
  const router = useRouter();
  const tasks = filterByRole(recommendedTasks, role);
  if (tasks.length === 0) return null;

  const handleClick = (prompt: string) => {
    router.push(`/chat?new=1&q=${encodeURIComponent(prompt)}`);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={14} strokeWidth={1.5} color="#8b6f47" />
        <h3 className="text-[13px] font-medium text-[#444]" style={{ letterSpacing: "0.14px" }}>
          cockpit의 제안
        </h3>
        <span className="text-[11px] text-[#8b6f47]" style={{ letterSpacing: "0.14px" }}>AI 인사이트</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            icon={t.icon}
            title={t.title}
            meta={t.meta}
            insight={t.insight}
            variant="recommended"
            onClick={() => handleClick(t.prompt)}
          />
        ))}
      </div>
    </section>
  );
}
