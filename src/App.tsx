import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Dashboard from "./components/Dashboard";

function App() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const duration = 2200;
    const end = Date.now() + duration;
    const colors = ["#a855f7", "#6366f1", "#ec4899", "#f97316", "#eab308", "#22c55e", "#ffffff"];

    function frame() {
      try {
        confetti({ particleCount: 6, angle: 60,  spread: 70, origin: { x: 0, y: 0.2 }, colors, scalar: 1.1, ticks: 200 });
        confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.2 }, colors, scalar: 1.1, ticks: 200 });
      } catch { /* ignore canvas errors */ }
      if (Date.now() < end) requestAnimationFrame(frame);
    }

    try {
      confetti({ particleCount: 180, spread: 120, origin: { x: 0.5, y: 0 }, colors, scalar: 1.2, ticks: 300, gravity: 0.8, startVelocity: 45 });
      requestAnimationFrame(frame);
    } catch { /* ignore canvas errors */ }
  }, []);

  return <Dashboard />;
}

export default App;
