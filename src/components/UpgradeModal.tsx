import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  birthdayCount?: number;
}


const PRO_FEATURES = [
  "Unlimited birthday entries",
  "Custom category colors",
  "Smart reminder notifications",
  "Export & backup your data",
  "Priority support",
];


export default function UpgradeModal({ open, onClose, birthdayCount = 0 }: Props) {
  const [confirming, setConfirming] = useState(false);

  function handleNoThanks() {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      onClose();
    }, 1600);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/70"
            style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl overflow-hidden relative"
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                background: "linear-gradient(145deg, rgba(59,7,100,0.97) 0%, rgba(2,6,23,0.99) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(168,85,247,0.35)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 80px rgba(168,85,247,0.15)",
              }}
            >
              {/* Purple top glow */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none rounded-3xl"
                style={{
                  background: "radial-gradient(ellipse at top center, rgba(168,85,247,0.4) 0%, transparent 55%)",
                }}
              />

              {/* Confirmation overlay */}
              <AnimatePresence>
                {confirming && (
                  <motion.div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl gap-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: "linear-gradient(145deg, rgba(59,7,100,0.98) 0%, rgba(2,6,23,0.99) 100%)",
                    }}
                  >
                    <CheckCircle2 size={40} className="text-purple-400" />
                    <p className="text-white font-semibold text-base">You're all set!</p>
                    <p className="text-white/50 text-sm">Staying with the free plan.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative p-7">
                {/* Close X */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>

                <h2 className="text-xl font-bold text-white mb-5 pr-8">Upgrade to Pro</h2>

                <div className="rounded-2xl px-5 py-4 mb-5 text-center" style={{ background: "rgba(234,179,8,0.10)", border: "1px solid rgba(234,179,8,0.28)" }}>
                  <p className="text-yellow-300 text-sm font-semibold">Pro checkout temporarily unavailable</p>
                  <p className="text-yellow-100/70 text-xs mt-1">We'll reopen purchases once secure payment verification is restored.</p>
                </div>

                {/* 2 — BULLET POINTS */}
                <div className="space-y-2.5 mb-6">
                  {PRO_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: "rgba(168,85,247,0.25)",
                          border: "1px solid rgba(168,85,247,0.5)",
                          boxShadow: "0 0 8px rgba(168,85,247,0.2)",
                        }}
                      >
                        <Check size={10} className="text-purple-300" strokeWidth={3} />
                      </div>
                      <span className="text-white/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* 3 — MAIN CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled
                  aria-disabled="true"
                  className="w-full py-4 rounded-xl font-bold text-white text-base mb-2.5"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #6366f1)",
                    boxShadow: "0 4px 24px rgba(168,85,247,0.5), 0 0 0 1px rgba(168,85,247,0.3)",
                  }}
                >
                  Pro Purchases Temporarily Unavailable
                </motion.button>

                {/* 4 — EXIT (styled to match, secondary) */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNoThanks}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    color: "#3b0764",
                    boxShadow: "0 4px 14px rgba(255,255,255,0.12)",
                  }}
                >
                  No, Thanks — I'll stay with my Five Free birthdays.
                </motion.button>

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
