import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User } from "lucide-react";
import { Birthday, Category, CATEGORIES } from "../types";
import CategoryBadge from "./CategoryBadge";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (birthday: Omit<Birthday, "id" | "createdAt">) => void;
}

export default function AddBirthdayModal({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<Category>("friends");
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});

  function validate() {
    const e: { name?: string; date?: string } = {};
    if (!name.trim()) e.name = "Name is required";
    if (!date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onAdd({ name: name.trim(), date, category });
    setName("");
    setDate("");
    setCategory("friends");
    setErrors({});
  }

  function handleClose() {
    setName("");
    setDate("");
    setCategory("friends");
    setErrors({});
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center pb-safe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-t-3xl overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              style={{
                background: "rgba(18,18,28,0.97)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "none",
                boxShadow: "0 -24px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="px-6 pb-8 pt-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Add Birthday</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Johnson"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/25 text-sm outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: errors.name
                            ? "1px solid rgba(239,68,68,0.6)"
                            : "1px solid rgba(255,255,255,0.1)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.border = "1px solid rgba(168,85,247,0.6)";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.border = errors.name
                            ? "1px solid rgba(239,68,68,0.6)"
                            : "1px solid rgba(255,255,255,0.1)";
                          e.currentTarget.style.boxShadow = "";
                        }}
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Birthday Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all [color-scheme:dark]"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: errors.date
                            ? "1px solid rgba(239,68,68,0.6)"
                            : "1px solid rgba(255,255,255,0.1)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.border = "1px solid rgba(168,85,247,0.6)";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.border = errors.date
                            ? "1px solid rgba(239,68,68,0.6)"
                            : "1px solid rgba(255,255,255,0.1)";
                          e.currentTarget.style.boxShadow = "";
                        }}
                      />
                    </div>
                    {errors.date && <p className="text-red-400 text-xs mt-1.5">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-3">Category</label>
                    <div className="grid grid-cols-4 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all text-center"
                          style={{
                            background:
                              category === cat.value
                                ? cat.bgColor
                                : "rgba(255,255,255,0.04)",
                            border:
                              category === cat.value
                                ? `1.5px solid ${cat.borderColor}`
                                : "1.5px solid rgba(255,255,255,0.07)",
                            boxShadow:
                              category === cat.value
                                ? `0 0 12px ${cat.color}30`
                                : "none",
                          }}
                        >
                          <span className="text-xl leading-none">{cat.emoji}</span>
                          <span
                            className="text-xs leading-tight font-medium"
                            style={{ color: category === cat.value ? cat.color : "rgba(255,255,255,0.4)" }}
                          >
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl font-semibold text-white text-sm"
                      style={{
                        background: "linear-gradient(135deg, rgba(168,85,247,0.9), rgba(99,102,241,0.9))",
                        boxShadow: "0 4px 20px rgba(168,85,247,0.35)",
                      }}
                    >
                      Save Birthday 🎂
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
