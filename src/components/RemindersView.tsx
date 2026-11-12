import { motion } from "framer-motion";
import { Bell, Cake } from "lucide-react";
import { Birthday, getCategoryConfig } from "../types";

interface Props {
  birthdays: Birthday[];
  onSelect: (birthday: Birthday) => void;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  const [, month, day] = dateStr.split("-").map(Number);
  const next = new Date(today.getFullYear(), month - 1, day);
  const tToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (next < tToday) next.setFullYear(today.getFullYear() + 1);
  return Math.round((next.getTime() - tToday.getTime()) / 86400000);
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-").map(Number);
  return new Date(2000, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RemindersView({ birthdays, onSelect }: Props) {
  const upcoming = birthdays
    .map((b) => ({ ...b, daysUntil: getDaysUntil(b.date) }))
    .filter((b) => b.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const soon = upcoming.filter((b) => b.daysUntil <= 7);
  const later = upcoming.filter((b) => b.daysUntil > 7);

  function Section({ title, items, accent }: { title: string; items: typeof upcoming; accent: string }) {
    if (items.length === 0) return null;
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1" style={{ background: `${accent}40` }} />
          <span className="text-xs font-semibold tracking-wider uppercase px-2" style={{ color: accent }}>
            {title}
          </span>
          <div className="h-px flex-1" style={{ background: `${accent}40` }} />
        </div>
        <div className="space-y-3">
          {items.map((b) => {
            const config = getCategoryConfig(b.category);
            return (
              <motion.button
                key={b.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
                }}
                onClick={() => onSelect(b)}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    backgroundColor: config.bgColor,
                    border: `1px solid ${config.borderColor}`,
                    boxShadow: `0 0 16px ${config.color}30`,
                  }}
                >
                  {config.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{b.name}</p>
                  <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                    <Cake size={10} />
                    {formatDate(b.date)}
                  </p>
                </div>
                <div
                  className="flex-shrink-0 text-center rounded-xl px-3 py-2"
                  style={{ backgroundColor: `${accent}20`, border: `1px solid ${accent}40` }}
                >
                  <p className="text-xs font-bold" style={{ color: accent }}>
                    {b.daysUntil === 0 ? "🎉" : b.daysUntil}
                  </p>
                  <p className="text-xs" style={{ color: `${accent}99` }}>
                    {b.daysUntil === 0 ? "Today" : b.daysUntil === 1 ? "day" : "days"}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tagline */}
      <div
        className="rounded-2xl px-5 py-4 flex items-start gap-3"
        style={{
          background: "rgba(168,85,247,0.1)",
          border: "1px solid rgba(168,85,247,0.2)",
        }}
      >
        <Bell size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
        <p className="text-purple-200/80 text-sm leading-relaxed italic">
          "Reminders to help you remember the most important dates and the people who celebrate them."
        </p>
      </div>

      {birthdays.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <motion.div
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-5xl mb-4"
          >
            🔔
          </motion.div>
          <p className="text-white/40 text-sm">Add birthdays to see upcoming reminders</p>
        </div>
      )}

      {birthdays.length > 0 && upcoming.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">😌</div>
          <p className="text-white/60 text-sm font-medium">All clear for the next 30 days</p>
          <p className="text-white/30 text-xs mt-1">No birthdays coming up soon</p>
        </div>
      )}

      {soon.length > 0 && (
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{
            background: "rgba(234,179,8,0.1)",
            border: "1px solid rgba(234,179,8,0.25)",
          }}
        >
          <span className="text-lg leading-none flex-shrink-0">🎂</span>
          <p className="text-yellow-200/80 text-sm leading-relaxed">
            You have <span className="font-semibold text-white">{soon.length}</span> birthday
            {soon.length > 1 ? "s" : ""} coming up within the next 7 days!
          </p>
        </div>
      )}

      <Section title="This Week" items={soon} accent="#a855f7" />
      <Section title="This Month" items={later} accent="#6366f1" />
    </div>
  );
}
