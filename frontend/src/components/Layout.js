import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import CommandPalette from "./CommandPallete";

export default function Layout({ logout }) {
  const [commandOpen, setCommandOpen] = useState(false);

  // ⌨️ GLOBAL CMD + K / CTRL + K LISTENER
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="appShell">

      {/* SIDEBAR */}
      <Sidebar logout={logout} />

      {/* MAIN AREA */}
      <div className="mainArea">

        {/* TOP BAR */}
        <div className="topBar">
          <div className="pageTitle">InventoryPro</div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* CMD BUTTON (optional click trigger) */}
            <button
              className="cmdBtn"
              onClick={() => setCommandOpen(true)}
            >
              ⌘ K
            </button>

            <div className="profile">👤</div>

          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="pageContent">
          <Outlet />
        </div>

      </div>

      {/* COMMAND PALETTE OVERLAY */}
      {commandOpen && (
        <CommandPalette onClose={() => setCommandOpen(false)} />
      )}

    </div>
  );
}