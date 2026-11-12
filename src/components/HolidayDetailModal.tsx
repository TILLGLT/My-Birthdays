import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";
import { Holiday, formatHolidayDate } from "../lib/holidays";

interface Props {
  holiday: Holiday | null;
  year: number;
  onClose: () => void;
}

export default function HolidayDetailModal({ holiday, year, onClose }: Props) {
  return (
    <AnimatePresence>
      {holiday && (
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
                background: "linear-gradient(145deg, rgba(8,28,60,0.97) 0%, rgba(2,6,23,0.99) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(99,179,237,0.25)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 60px rgba(56,189,248,0.1)",
              }}
            >
              {/* Top glow */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none rounded-3xl"
                style={{
                  background: "radial-gradient(ellipse at top center, rgba(56,189,248,0.4) 0%, transparent 55%)",
                }}
              />

              <div className="relative p-6">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Global Event badge */}
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{
                      background: "rgba(56,189,248,0.12)",
                      border: "1px solid rgba(56,189,248,0.3)",
                    }}
                  >
                    <Globe size={11} className="text-sky-400" />
                    <span className="text-sky-300 text-xs font-semibold tracking-wide uppercase">
                      Global Event
                    </span>
                  </div>
                </div>

                {/* Emoji + name */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{
                      background: "rgba(56,189,248,0.12)",
                      border: "1.5px solid rgba(56,189,248,0.25)",
                      boxShadow: "0 0 20px rgba(56,189,248,0.2)",
                    }}
                  >
                    {holiday.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">{holiday.name}</h2>
                    <p className="text-sky-300/70 text-sm mt-1">{formatHolidayDate(holiday, year)}</p>
                  </div>
                </div>

                {/* Description */}
                {holiday.description && (
                  <div
                    className="rounded-2xl px-4 py-3.5 mb-4"
                    style={{
                      background: "rgba(56,189,248,0.06)",
                      border: "1px solid rgba(56,189,248,0.14)",
                    }}
                  >
                    <p className="text-white/60 text-sm leading-relaxed">{holiday.description}</p>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
