import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, List, Bell, Plus, Search } from "lucide-react";
import cakeImg from "@/assets/cake.webp";
import { Birthday } from "../types";
import { getAllBirthdays, addBirthday, deleteBirthday, updateBirthday, countBirthdays } from "../lib/db";
import { getHolidayNameSet, Holiday } from "../lib/holidays";
import BirthdayCard from "./BirthdayCard";
import AddBirthdayModal from "./AddBirthdayModal";
import UpgradeModal from "./UpgradeModal";
import CalendarView from "./CalendarView";
import RemindersView from "./RemindersView";
import BirthdayDetailModal from "./BirthdayDetailModal";
import HolidayDetailModal from "./HolidayDetailModal";

const FREE_LIMIT = 5;
const PRO_KEY = "mybirthdays_pro";
type Tab = "birthdays" | "calendar" | "reminders";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "birthdays", label: "Birthdays", icon: List },
  { id: "reminders", label: "Reminders", icon: Bell },
];

export default function Dashboard() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("birthdays");
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<{ holiday: Holiday; year: number } | null>(null);
  const [isPro, setIsPro] = useState(() => localStorage.getItem(PRO_KEY) === "1");

  // Legacy local entitlement remains for compatibility; new paid grants must be server-verified.


  const loadBirthdays = useCallback(async () => {
    let data: Birthday[];
    try {
      data = await getAllBirthdays();
    } catch {
      setLoading(false);
      return;
    }

    // Auto-convert: if any saved birthday name matches (or is contained in) a known holiday name,
    // delete it so it becomes a system holiday and the slot is freed.
    const holidayNames = getHolidayNameSet(new Date().getFullYear());
    const toDelete = data.filter((b) => {
      const bName = b.name.toLowerCase().trim();
      for (const hn of holidayNames) {
        if (bName === hn || hn.includes(bName) || bName.includes(hn)) return true;
      }
      return false;
    });
    for (const b of toDelete) {
      await deleteBirthday(b.id);
    }

    const cleaned = toDelete.length > 0 ? await getAllBirthdays() : data;

    cleaned.sort((a, b) => {
      const today = new Date();
      const tToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const [, am, ad] = a.date.split("-").map(Number);
      const [, bm, bd] = b.date.split("-").map(Number);
      const da = new Date(today.getFullYear(), am - 1, ad);
      const db_ = new Date(today.getFullYear(), bm - 1, bd);
      if (da < tToday) da.setFullYear(today.getFullYear() + 1);
      if (db_ < tToday) db_.setFullYear(today.getFullYear() + 1);
      return da.getTime() - db_.getTime();
    });

    setBirthdays(cleaned);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBirthdays();
  }, [loadBirthdays]);

  async function handleAdd(data: Omit<Birthday, "id" | "createdAt">) {
    try {
      const count = await countBirthdays();
      if (!isPro && count >= FREE_LIMIT) {
        setShowUpgrade(true);
        return;
      }
      const newBirthday: Birthday = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      await addBirthday(newBirthday);
      await loadBirthdays();
      setShowAdd(false);
    } catch { /* silent — db errors shouldn't crash the UI */ }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBirthday(id);
      await loadBirthdays();
    } catch { /* silent */ }
  }

  async function handleUpdate(updated: Birthday) {
    try {
      await updateBirthday(updated);
      setSelectedBirthday(updated);
      await loadBirthdays();
    } catch { /* silent */ }
  }

  async function handleAddClick() {
    try {
      const count = await countBirthdays();
      if (!isPro && count >= FREE_LIMIT) {
        setShowUpgrade(true);
      } else {
        setShowAdd(true);
      }
    } catch { /* silent */ }
  }

  const filtered = birthdays.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white" style={{ background: "var(--bg-glow)", backgroundAttachment: "fixed" }}>
      {/* Fixed Top Navigation */}
      <div
        className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
        style={{
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src={cakeImg} alt="cake" className="w-7 h-7 object-contain" />
              <span
                className="font-bold text-base tracking-tight"
                style={{
                  background: "linear-gradient(90deg, #a855f7, #84cc16)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                My Birthdays<sup style={{ WebkitTextFillColor: "#a855f7", backgroundClip: "unset", fontSize: "0.6em", verticalAlign: "super" }}>™</sup>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/35 text-xs">
                {isPro ? "Pro ✓" : `${birthdays.length}/${FREE_LIMIT} free`}
              </span>
            </div>
          </div>

          <div className="nav-container" style={{ padding: "0", gap: "8px" }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isLime = tab.id === "birthdays";

              const activeStyle = isLime
                ? {
                    background: "linear-gradient(135deg, #84cc16 0%, #16a34a 100%)",
                    borderColor: "rgba(132,204,22,0.6)",
                    boxShadow: "0 8px 24px rgba(132,204,22,0.45), 0 2px 8px rgba(0,0,0,0.35)",
                    color: "white",
                    fontWeight: 600,
                  }
                : {
                    background: "rgba(255,255,255,0.95)",
                    borderColor: "rgba(255,255,255,0.9)",
                    boxShadow: "0 8px 24px rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.35)",
                    color: "#3b0764",
                    fontWeight: 700,
                  };

              const inactiveStyle = {
                background: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.10)",
                boxShadow: "none",
                color: "rgba(255,255,255,0.45)",
                fontWeight: 500,
              };

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  className="nav-button flex-1 justify-center"
                  style={isActive ? activeStyle : inactiveStyle}
                >
                  <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-36 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === "birthdays" && (
            <motion.div
              key="birthdays"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {birthdays.length > 0 && (
                <div className="relative mb-5">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search birthdays…"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-white/25 text-sm outline-none"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  />
                </div>
              )}

              {loading ? (
                <div className="flex justify-center py-16">
                  <motion.div
                    className="w-8 h-8 rounded-full border-2 border-purple-400/30 border-t-purple-400"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  />
                </div>
              ) : filtered.length === 0 && birthdays.length > 0 ? (
                <div className="text-center py-16 text-white/30">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-sm">No results for "{search}"</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="mb-5 flex justify-center"
                  >
                    <img src={cakeImg} alt="birthday cake" className="w-32 h-32 object-contain drop-shadow-lg" />
                  </motion.div>
                  <p className="text-white/50 font-medium">Add your first birthday</p>
                  <p className="text-white/25 text-sm mt-1">Tap the button below to get started</p>
                </div>
              ) : (
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" layout>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((b) => (
                      <BirthdayCard
                        key={b.id}
                        birthday={b}
                        onDelete={handleDelete}
                        onSelect={setSelectedBirthday}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <CalendarView
                birthdays={birthdays}
                onSelect={setSelectedBirthday}
                onSelectHoliday={(holiday, year) => setSelectedHoliday({ holiday, year })}
              />
            </motion.div>
          )}

          {activeTab === "reminders" && (
            <motion.div
              key="reminders"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <RemindersView birthdays={birthdays} onSelect={setSelectedBirthday} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Add Button */}
      <motion.div
        className="fixed bottom-14 inset-x-0 flex justify-center z-30"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 280, damping: 22 }}
      >
        <motion.button
          onClick={handleAddClick}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white text-sm"
          style={{
            background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
            boxShadow: "0 8px 40px rgba(168, 85, 247, 0.55), 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Birthday
        </motion.button>
      </motion.div>

      <AddBirthdayModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
      />
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} birthdayCount={birthdays.length} />
      <BirthdayDetailModal
        birthday={selectedBirthday}
        onClose={() => setSelectedBirthday(null)}
        onUpdate={handleUpdate}
      />
      <HolidayDetailModal
        holiday={selectedHoliday?.holiday ?? null}
        year={selectedHoliday?.year ?? new Date().getFullYear()}
        onClose={() => setSelectedHoliday(null)}
      />
      <footer className="fixed bottom-0 inset-x-0 text-center py-3 z-20">
        <a
          href="mailto:support@mybirthdays.online"
          className="text-white/30 text-xs hover:text-white/60 transition-colors"
        >
          Contact us at support@mybirthdays.online
        </a>
      </footer>
    </div>
  );
}
