import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CONTACT_EMAIL = "hello@mybirthdays.online";

export default function ContactModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "a visitor"} — My Birthdays App`);
    const body = encodeURIComponent(
      `Name: ${name || "Not provided"}\nEmail: ${email || "Not provided"}\n\nMessage:\n${message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName("");
      setEmail("");
      setMessage("");
      onClose();
    }, 2000);
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "white",
    outline: "none",
    width: "100%",
    padding: "10px 14px",
    fontSize: "0.875rem",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
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
              <div
                className="absolute inset-0 opacity-40 pointer-events-none rounded-3xl"
                style={{ background: "radial-gradient(ellipse at top center, rgba(168,85,247,0.4) 0%, transparent 55%)" }}
              />

              <AnimatePresence>
                {sent && (
                  <motion.div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl gap-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ background: "linear-gradient(145deg, rgba(59,7,100,0.98) 0%, rgba(2,6,23,0.99) 100%)" }}
                  >
                    <CheckCircle2 size={40} className="text-purple-400" />
                    <p className="text-white font-semibold text-base">Message ready!</p>
                    <p className="text-white/50 text-sm text-center px-6">Your email app is opening — just hit send!</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative p-7">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>

                <h2 className="text-xl font-bold text-white mb-1 pr-8">Get in Touch</h2>
                <p className="text-white/40 text-sm mb-6">We'd love to hear from you.</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    placeholder="Your email (for a reply)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                  <textarea
                    placeholder="Your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    style={{ ...inputStyle, resize: "none" }}
                  />

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!message.trim()}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 mt-1"
                    style={{
                      background: message.trim()
                        ? "linear-gradient(135deg, #a855f7, #6366f1)"
                        : "rgba(168,85,247,0.25)",
                      boxShadow: message.trim()
                        ? "0 4px 24px rgba(168,85,247,0.45)"
                        : "none",
                      opacity: message.trim() ? 1 : 0.5,
                      cursor: message.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    <Send size={15} strokeWidth={2.5} />
                    Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
