import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const COMMANDS = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Products", path: "/products" },
  { label: "Analytics", path: "/analytics" },
  { label: "Settings", path: "/settings" }
];

export default function CommandPalette({ onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // 🎯 AUTO FOCUS + OPEN ANIMATION + SOUND
  useEffect(() => {
    inputRef.current?.focus();

    // subtle "pop" sound (web-safe generated tone)
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 520;
    gain.gain.value = 0.03;

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }, []);

  // ESC + NAVIGATION
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();

      if (e.key === "ArrowDown") {
        setActiveIndex((p) => (p + 1) % filtered.length);
      }

      if (e.key === "ArrowUp") {
        setActiveIndex((p) =>
          p - 1 < 0 ? filtered.length - 1 : p - 1
        );
      }

      if (e.key === "Enter") {
        const selected = filtered[activeIndex];
        if (selected) {
          navigate(selected.path);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtered, activeIndex]);

  return (
    <div className="cmdOverlay" onClick={onClose}>
      <div className="cmdBox animateIn" onClick={(e) => e.stopPropagation()}>

        <input
          ref={inputRef}
          className="cmdInput"
          placeholder="Search pages..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
        />

        <div className="cmdList">
          {filtered.map((cmd, i) => (
            <div
              key={cmd.path}
              className={`cmdItem ${i === activeIndex ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                navigate(cmd.path);
                onClose();
              }}
            >
              {cmd.label}
            </div>
          ))}
        </div>

        <div className="cmdHint">
          ↑ ↓ navigate • Enter select • Esc close
        </div>

      </div>
    </div>
  );
}