import { motion } from "framer-motion";
import { Trash2, Cake } from "lucide-react";
import { Birthday, getCategoryConfig } from "../types";
import CategoryBadge from "./CategoryBadge";

interface Props {
  birthday: Birthday;
  onDelete: (id: string) => void;
  onSelect: (birthday: Birthday) => void;
}

function getDaysUntil(dateStr: string): { days: number; label: string; isToday: boolean; isSoon: boolean } {
  const today = new Date();
  const [, month, day] = dateStr.split("-").map(Number);
  const next = new Date(today.getFullYear(), month - 1, day);
  const tToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (next < tToday) next.setFullYear(today.getFullYear() + 1);
  const diff = Math.round((next.getTime() - tToday.getTime()) / 86400000);
  const isToday = diff === 0;
  const isSoon = diff > 0 && diff <= 7;
  const label = isToday ? "🎉 Today!" : diff === 1 ? "Tomorrow" : `${diff} days`;
  return { days: diff, label, isToday, isSoon };
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-").map(Number);
  return new Date(2000, month - 1, day).toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default function BirthdayCard({ birthday, onDelete, onSelect }: Props) {
  const config = getCategoryConfig(birthday.category);
  const { label, isToday, isSoon } = getDaysUntil(birthday.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="relative group rounded-2xl p-5 overflow-hidden cursor-pointer"
      onClick={() => onSelect(birthday)}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
      }}
    >
      <div
        className="absolute inset-0 opacity-25 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top-left, ${config.color}50 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
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
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-base leading-tight truncate">{birthday.name}</h3>
              <p className="text-white/45 text-xs mt-0.5">{formatDate(birthday.date)}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(birthday.id); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 flex-shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <CategoryBadge category={birthday.category} />
          <div
            className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 ${
              isToday
                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                : isSoon
                ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                : "text-white/40 border border-white/10"
            }`}
            style={!isToday && !isSoon ? { background: "rgba(255,255,255,0.05)" } : {}}
          >
            <Cake size={11} />
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
