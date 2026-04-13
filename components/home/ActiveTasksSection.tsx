"use client";

import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { activeTasks, filterByRole, type UserRole } from "@/data/homeTasks";
import TaskCard from "./TaskCard";

interface Props {
  role: UserRole;
}

export default function ActiveTasksSection({ role }: Props) {
  const router = useRouter();
  const tasks = filterByRole(activeTasks, role);
  if (tasks.length === 0) return null;

  const handleClick = (prompt: string) => {
    router.push(`/chat?new=1&q=${encodeURIComponent(prompt)}`);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} strokeWidth={1.5} color="#777" />
        <h3 className="text-[13px] font-medium text-[#444]" style={{ letterSpacing: "0.14px" }}>
          지금 붙잡고 있는 일
        </h3>
        <span className="text-[12px] text-[#bbb]">{tasks.length}건</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            icon={t.icon}
            title={t.title}
            meta={t.meta}
            onClick={() => handleClick(t.prompt)}
          />
        ))}
      </div>
    </section>
  );
}
