import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Birthday, getCategoryConfig } from "../types";
import { buildHolidayMap, Holiday } from "../lib/holidays";

interface Props {
  birthdays: Birthday[];
  onSelect: (birthday: Birthday) => void;
  onSelectHoliday: (holiday: Holiday, year: number) => void;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarView({ birthdays, onSelect, onSelectHoliday }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const birthdaysByDay: Record<number, Birthday[]> = {};
  birthdays.forEach((b) => {
    const [, bMonth, bDay] = b.date.split("-").map(Number);
    if (bMonth - 1 === month) {
      if (!birthdaysByDay[bDay]) birthdaysByDay[bDay] = [];
      birthdaysByDay[bDay].push(b);
    }
  });

  const holidayMap = buildHolidayMap(year, month);

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  const todayDay = today.getDate();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const navKey = `${year}-${month}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Calendar Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Month / Year Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: "rgba(168,85,247,0.14)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors hover:bg-white/10 text-white/60 hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>

          <AnimatePresence mode="wait">
            <motion.h2
              key={navKey}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="font-bold text-white text-base"
            >
              {MONTH_NAMES[month]} {year}
            </motion.h2>
          </AnimatePresence>

          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors hover:bg-white/10 text-white/60 hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div
          className="grid grid-cols-7"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {DAY_HEADERS.map((d, i) => (
            <div
              key={i}
              className="py-2.5 text-center text-xs font-semibold tracking-wide"
              style={{
                color: i === 0 || i === 6 ? "rgba(168,85,247,0.7)" : "rgba(255,255,255,0.35)",
                borderRight: i < 6 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={navKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-7"
          >
            {Array.from({ length: totalCells }, (_, i) => {
              const dayNum = i - firstDayOfWeek + 1;
              const isValid = dayNum >= 1 && dayNum <= daysInMonth;
              const isToday = isCurrentMonth && isValid && dayNum === todayDay;
              const bdays = isValid ? (birthdaysByDay[dayNum] ?? []) : [];
              const holiday = isValid ? holidayMap[dayNum] : undefined;
              const col = i % 7;
              const row = Math.floor(i / 7);
              const totalRows = totalCells / 7;
              const hasBirthday = bdays.length > 0;
              const hasHoliday = !!holiday;
              const isClickable = hasBirthday || hasHoliday;

              return (
                <div
                  key={i}
                  className={`relative flex flex-col items-center pt-2 min-h-[72px] ${isClickable ? "cursor-pointer" : ""}`}
                  style={{
                    borderRight: col < 6 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    borderBottom: row < totalRows - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    background: isToday ? "rgba(168,85,247,0.12)" : col === 0 || col === 6 ? "rgba(255,255,255,0.015)" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onClick={() => {
                    if (hasBirthday) onSelect(bdays[0]);
                    else if (hasHoliday) onSelectHoliday(holiday!, year);
                  }}
                  onMouseEnter={(e) => {
                    if (isClickable) (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (isClickable) (e.currentTarget as HTMLElement).style.background = isToday
                      ? "rgba(168,85,247,0.12)"
                      : col === 0 || col === 6
                      ? "rgba(255,255,255,0.015)"
                      : "transparent";
                  }}
                >
                  {isValid && (
                    <>
                      {/* Day number */}
                      <span
                        className="text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full leading-none flex-shrink-0"
                        style={
                          isToday
                            ? { color: "#fff", fontWeight: 700, background: "rgba(168,85,247,0.6)", boxShadow: "0 0 12px rgba(168,85,247,0.5)" }
                            : { color: col === 0 || col === 6 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)" }
                        }
                      >
                        {dayNum}
                      </span>

                      {/* Birthday colored dots — always on top */}
                      {hasBirthday && (
                        <div className="flex items-center justify-center gap-0.5 mt-0.5 flex-wrap max-w-[36px]">
                          {bdays.slice(0, 3).map((b) => {
                            const cfg = getCategoryConfig(b.category);
                            return (
                              <div
                                key={b.id}
                                title={b.name}
                                className="rounded-full flex-shrink-0"
                                style={{
                                  width: bdays.length === 1 ? "7px" : "5px",
                                  height: bdays.length === 1 ? "7px" : "5px",
                                  backgroundColor: cfg.color,
                                  boxShadow: `0 0 4px ${cfg.color}`,
                                }}
                              />
                            );
                          })}
                          {bdays.length > 3 && (
                            <span className="text-white/40 text-[8px] leading-none">+{bdays.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Spacer pushes holiday text to bottom */}
                      <div className="flex-1" />

                      {/* Holiday name text — soft blue/grey, NO dot, always at bottom */}
                      {hasHoliday && (
                        <button
                          className="w-full pb-1.5 px-0.5 text-center leading-tight truncate"
                          style={{
                            fontSize: "8px",
                            color: "rgba(147,197,253,0.65)",
                            lineHeight: "1.1",
                            maxWidth: "100%",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                          title={holiday!.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHoliday(holiday!, year);
                          }}
                        >
                          {holiday!.name}
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Birthday list for this month */}
      {Object.keys(birthdaysByDay).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 space-y-2"
        >
          <p className="text-white/35 text-xs font-semibold uppercase tracking-wider px-1 mb-3">
            Birthdays this month
          </p>
          {Object.entries(birthdaysByDay)
            .sort(([a], [b]) => Number(a) - Number(b))
            .flatMap(([day, bdays]) =>
              bdays.map((b) => {
                const cfg = getCategoryConfig(b.category);
                return (
                  <button
                    key={b.id}
                    onClick={() => onSelect(b)}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
                    />
                    <span className="text-white font-medium text-sm flex-1 truncate">{b.name}</span>
                    <span className="text-white/40 text-xs flex-shrink-0">{cfg.emoji} {MONTH_NAMES[month]} {day}</span>
                  </button>
                );
              })
            )}
        </motion.div>
      )}

      {birthdays.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-4xl mb-3"
          >
            📅
          </motion.div>
          <p className="text-white/35 text-sm">Add birthdays to see them on the calendar</p>
        </div>
      )}
    </motion.div>
  );
}
