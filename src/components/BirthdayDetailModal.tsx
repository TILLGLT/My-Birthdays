import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cake, Pencil, Check } from "lucide-react";
import { Birthday, Category, CATEGORIES, getCategoryConfig } from "../types";
import CategoryBadge from "./CategoryBadge";

interface Props {
  birthday: Birthday | null;
  onClose: () => void;
  onUpdate: (updated: Birthday) => void;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDaysUntil(dateStr: string): { label: string; isToday: boolean; isSoon: boolean } {
  const today = new Date();
  const [, month, day] = dateStr.split("-").map(Number);
  const next = new Date(today.getFullYear(), month - 1, day);
  const tToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (next < tToday) next.setFullYear(today.getFullYear() + 1);
  const diff = Math.round((next.getTime() - tToday.getTime()) / 86400000);
  const isToday = diff === 0;
  const isSoon = diff > 0 && diff <= 7;
  const label = isToday ? "🎉 Today!" : diff === 1 ? "Tomorrow" : `In ${diff} days`;
  return { label, isToday, isSoon };
}

export default function BirthdayDetailModal({ birthday, onClose, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState<Category>("friends");
  const [draftDate, setDraftDate] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  useEffect(() => {
    if (birthday) {
      setIsEditing(false);
      setDraftName(birthday.name);
      setDraftCategory(birthday.category);
      setDraftDate(birthday.date);
      setDraftNotes(birthday.notes ?? "");
    }
  }, [birthday]);

  if (!birthday) return null;

  const config = getCategoryConfig(birthday.category);
  const draftConfig = getCategoryConfig(draftCategory);
  const [, bMonth, bDay] = birthday.date.split("-").map(Number);
  const formattedDate = `${MONTH_NAMES[bMonth - 1]} ${bDay}`;
  const { label, isToday, isSoon } = getDaysUntil(birthday.date);

  function handleSave() {
    if (!draftName.trim() || !draftDate) return;
    onUpdate({
      ...birthday!,
      name: draftName.trim(),
      category: draftCategory,
      date: draftDate,
      notes: draftNotes,
    });
    setIsEditing(false);
  }

  const displayConfig = isEditing ? draftConfig : config;

  return (
    <AnimatePresence>
      {birthday && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl overflow-hidden relative"
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                background: "linear-gradient(145deg, rgba(30,10,60,0.97) 0%, rgba(2,6,23,0.99) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: `1px solid ${displayConfig.borderColor}`,
                boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 60px ${displayConfig.color}18`,
              }}
            >
              {/* Top color glow */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none rounded-3xl"
                style={{
                  background: `radial-gradient(ellipse at top center, ${displayConfig.color}50 0%, transparent 55%)`,
                }}
              />

              <div className="relative p-6">
                {/* Header row: close + edit/save */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{
                        background: "rgba(132,204,22,0.15)",
                        border: "1px solid rgba(132,204,22,0.35)",
                        color: "#84cc16",
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <Pencil size={11} />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-6 pr-24">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{
                      backgroundColor: displayConfig.bgColor,
                      border: `1.5px solid ${displayConfig.borderColor}`,
                      boxShadow: `0 0 24px ${displayConfig.color}40`,
                    }}
                  >
                    {displayConfig.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="w-full text-xl font-bold text-white bg-transparent border-b outline-none leading-tight pb-0.5"
                        style={{ borderColor: "rgba(255,255,255,0.25)" }}
                        placeholder="Name"
                        autoFocus
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-white leading-tight truncate">{birthday.name}</h2>
                    )}
                    <div className="mt-1.5">
                      {isEditing ? (
                        <select
                          value={draftCategory}
                          onChange={(e) => setDraftCategory(e.target.value as Category)}
                          className="text-xs rounded-lg px-2 py-1 outline-none font-semibold"
                          style={{
                            background: draftConfig.bgColor,
                            border: `1px solid ${draftConfig.borderColor}`,
                            color: draftConfig.color,
                          }}
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}
                              style={{ background: "#0a0a14", color: "white" }}>
                              {cat.emoji} {cat.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <CategoryBadge category={birthday.category} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div
                    className="rounded-2xl px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <p className="text-white/40 text-xs mb-1 flex items-center gap-1.5">
                      <Cake size={10} /> Birthday
                    </p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={draftDate}
                        onChange={(e) => setDraftDate(e.target.value)}
                        className="text-white font-semibold text-sm bg-transparent outline-none w-full"
                        style={{ colorScheme: "dark" }}
                      />
                    ) : (
                      <p className="text-white font-semibold text-sm">{formattedDate}</p>
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3`}
                    style={{
                      background: isToday
                        ? "rgba(234,179,8,0.12)"
                        : isSoon
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(255,255,255,0.05)",
                      border: "1px solid",
                      borderColor: isToday
                        ? "rgba(234,179,8,0.3)"
                        : isSoon
                        ? "rgba(34,197,94,0.3)"
                        : "rgba(255,255,255,0.09)",
                    }}
                  >
                    <p className="text-white/40 text-xs mb-1">Countdown</p>
                    <p
                      className={`font-semibold text-sm ${
                        isToday ? "text-amber-300" : isSoon ? "text-emerald-300" : "text-white"
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2.5">Notes</p>
                  {isEditing ? (
                    <textarea
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      rows={3}
                      placeholder="Gift ideas, fun facts, anything…"
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white/80 outline-none resize-none placeholder:text-white/20"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.14)",
                      }}
                    />
                  ) : (
                    <div
                      className="w-full rounded-xl px-3 py-2.5 text-sm text-white/50 italic"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        minHeight: "64px",
                      }}
                    >
                      {birthday.notes ? birthday.notes : ""}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
