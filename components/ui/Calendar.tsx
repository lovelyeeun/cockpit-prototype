"use client";

import { useState, useMemo } from "react";

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  label: string;
  color?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateClick?: (date: string) => void;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function Calendar({ events = [], onDateClick }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const eventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const arr = map.get(ev.date) ?? [];
      arr.push(ev);
      map.set(ev.date, arr);
    }
    return map;
  }, [events]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const prev = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors hover:bg-[#f5f5f5]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-[15px] font-medium" style={{ letterSpacing: "0.15px" }}>
          {year}년 {month + 1}월
        </span>
        <button
          onClick={next}
          className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors hover:bg-[#f5f5f5]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-[#777169] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;

          const dateStr = formatDate(year, month, day);
          const isToday = dateStr === todayStr;
          const dayEvents = eventMap.get(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onDateClick?.(dateStr)}
              className="flex flex-col items-center py-1 rounded-lg cursor-pointer transition-colors hover:bg-[#f5f5f5]"
              style={{ minHeight: "36px" }}
            >
              <span
                className="flex items-center justify-center w-6 h-6 text-[13px] rounded-full"
                style={{
                  backgroundColor: isToday ? "#000" : "transparent",
                  color: isToday ? "#fff" : "#000",
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {day}
              </span>
              {dayEvents && dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((ev, j) => (
                    <span
                      key={j}
                      className="w-[5px] h-[5px] rounded-full"
                      style={{ backgroundColor: ev.color ?? "#3b82f6" }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
