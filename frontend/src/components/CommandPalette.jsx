import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const COMMANDS = [
  { label: "Overview", path: "/" },
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

  const filtered = useMemo(
    () => COMMANDS.filter((command) =>
      command.label.toLowerCase().includes(query.trim().toLowerCase())
    ),
    [query]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowDown" && filtered.length) {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % filtered.length);
      } else if (event.key === "ArrowUp" && filtered.length) {
        event.preventDefault();
        setActiveIndex((current) =>
          current === 0 ? filtered.length - 1 : current - 1
        );
      } else if (event.key === "Enter" && filtered[activeIndex]) {
        navigate(filtered[activeIndex].path);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [activeIndex, filtered, navigate, onClose]);

  return (
    <div className="cmdOverlay" onMouseDown={onClose}>
      <section
        className="cmdBox"
        role="dialog"
        aria-modal="true"
        aria-label="Navigate to a page"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="cmdInput"
          placeholder="Search pages…"
          aria-label="Search pages"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
        />

        <div className="cmdList" role="listbox">
          {filtered.map((command, index) => (
            <button
              type="button"
              key={command.path}
              role="option"
              aria-selected={index === activeIndex}
              className={`cmdItem ${index === activeIndex ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => {
                navigate(command.path);
                onClose();
              }}
            >
              {command.label}
            </button>
          ))}
          {!filtered.length && <p className="emptyCommand">No matching pages</p>}
        </div>

        <div className="cmdHint">↑↓ Navigate · Enter Open · Esc Close</div>
      </section>
    </div>
  );
}
